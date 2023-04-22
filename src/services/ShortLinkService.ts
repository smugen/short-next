import FullLinkNotOkError from '@/graphql/resolvers/errors/FullLinkNotOkError';
import ShortLinkNotFoundError from '@/graphql/resolvers/errors/ShortLinkNotFoundError';
import type AddShortLinkInput from '@/graphql/resolvers/inputs/AddShortLinkInput';
import type RemoveShortLinksInput from '@/graphql/resolvers/inputs/RemoveShortLinksInput';
import type AddShortLinkOutput from '@/graphql/resolvers/outputs/AddShortLinkOutput';
import type RemoveShortLinksOutput from '@/graphql/resolvers/outputs/RemoveShortLinksOutput';
import logger from '@/logger';
import type { ShortLink, ShortLinkMeta, ShortLinkView, User } from '@/models';
import { LRUCache } from 'lru-cache';
import parse, { valid } from 'node-html-parser';
import { Inject, Service } from 'typedi';

import SequelizeDatabase from './SequelizeDatabase';
import ShortLinkLoader from './ShortLinkLoader';
import ShortLinkMetasByShortLinkIdLoader from './ShortLinkMetasByShortLinkIdLoader';
import ShortLinksByUserIdLoader from './ShortLinksByUserIdLoader';

const MAX_CACHE_SIZE = 500;
const CACHE_TTL = 1000 * 60;

@Service()
export default class ShortLinkService {
  static readonly parseMetaFromHtml = parseMetaFromHtml;

  private readonly cache: LRUCache<ShortLink['slug'], ShortLink>;

  constructor(
    @Inject(() => SequelizeDatabase)
    private readonly db: SequelizeDatabase,
    @Inject(() => ShortLinkLoader)
    private readonly shortLinkLoader: ShortLinkLoader,
    @Inject(() => ShortLinksByUserIdLoader)
    private readonly shortLinksByUserIdLoader: ShortLinksByUserIdLoader,
    @Inject(() => ShortLinkMetasByShortLinkIdLoader)
    private readonly shortLinkMetasByShortLinkIdLoader: ShortLinkMetasByShortLinkIdLoader,
  ) {
    this.cache = new LRUCache({
      max: MAX_CACHE_SIZE,
      ttl: CACHE_TTL,
      fetchMethod: this.#fetchMethod.bind(this),
      dispose: this.#dispose.bind(this),
    });
  }

  readonly #fetchMethod: NonNullable<typeof this.cache.fetchMethod> =
    async function fetchMethod(
      this: ShortLinkService,
      key,
      staleValue,
      { signal, options, context },
    ) {
      logger.debug('fetchMethod', {
        key,
        staleValue,
        options,
        context,
        module: module.id,
      });

      const shortLink = await this.db.ShortLinkModel.findOne({
        where: { slug: key },
        include: this.db.ShortLinkMetaModel,
      });

      return (!signal.aborted && shortLink) || void 0;
    };

  readonly #dispose: NonNullable<typeof this.cache.dispose> = function dispose(
    this: ShortLinkService,
    value,
    key,
    reason,
  ) {
    logger.debug('dispose', {
      value,
      key,
      reason,
      module: module.id,
    });
  };

  async addShortLink(
    { fullLink }: AddShortLinkInput,
    { id: userId }: User,
  ): Promise<AddShortLinkOutput> {
    const TAG = 'addShortLink';
    let url: URL;
    let res: Response;

    try {
      url = new URL(fullLink);
      res = await fetch(url);
    } catch (error) {
      logger.warn(TAG, { error, module: module.id });
      throw new FullLinkNotOkError(fullLink, new Error('' + error));
    }

    if (!res.ok) {
      throw new FullLinkNotOkError(url, res);
    }

    const shortLink = await this.db.ShortLinkModel.create({
      fullLink,
      userId,
    });

    try {
      const html = await res.text();
      const metaList = valid(html) && parseMetaFromHtml(html);
      if (metaList) {
        await this.db.ShortLinkMetaModel.bulkCreate(
          metaList.map(meta => ({
            ...meta,
            shortLinkId: shortLink.id,
          })),
        );
      }
    } catch (error) {
      logger.warn(TAG, { error, module: module.id });
    }

    return { shortLink };
  }

  async removeShortLinks(
    { shortLinkIdList }: RemoveShortLinksInput,
    { id: userId }: User,
  ): Promise<RemoveShortLinksOutput> {
    const removedCount = await this.db.ShortLinkModel.destroy({
      where: { id: shortLinkIdList, userId },
    });

    return { removedCount };
  }

  async loadShortLinkById(id: string): Promise<ShortLink> {
    const shortLink = await this.shortLinkLoader.load(id);
    if (!shortLink) {
      throw new ShortLinkNotFoundError(id);
    }
    return shortLink;
  }

  async getShortLinkBySlug(slug: string): Promise<ShortLink | null> {
    return (await this.cache.fetch(slug)) ?? null;
  }

  recordViewOfShortLink({ id }: ShortLink): Promise<ShortLinkView> {
    return this.db.ShortLinkViewModel.create({ shortLinkId: id });
  }

  loadShortLinksByUserId(userId: string): Promise<ShortLink[]> {
    return this.shortLinksByUserIdLoader.load(userId);
  }

  countViews({ id }: ShortLink): Promise<number> {
    return this.db.ShortLinkViewModel.count({ where: { shortLinkId: id } });
  }

  loadShortLinkMetas({ id }: ShortLink): Promise<ShortLinkMeta[]> {
    return this.shortLinkMetasByShortLinkIdLoader.load(id);
  }
}

const META_PREFIXES = ['og:', 'twitter:', 'article:'] as const;
const SELECTOR = 'head title, meta';
const META_PATTERN = new RegExp(
  `^((description$)|${META_PREFIXES.join('|')})`,
  'i',
);

interface Meta {
  tagName: string;
  rawText?: string;
  content?: string;
  property?: string;
  name?: string;
}

function parseMetaFromHtml(html: string): Meta[] {
  const root = parse(html);
  const nodeList = root.querySelectorAll(SELECTOR);

  return nodeList
    .map(node => {
      const { tagName, rawText } = node;
      const meta: Meta = { tagName };
      let isMeta = false;

      if ('TITLE' === tagName && rawText) {
        meta.rawText = rawText;
        isMeta = true;
      }

      if ('META' === tagName && !isMeta) {
        const content = node.getAttribute('content');
        if (content) {
          const property = node.getAttribute('property');
          const name = node.getAttribute('name');

          if (
            (property && META_PATTERN.test(property)) ||
            (name && META_PATTERN.test(name))
          ) {
            meta.content = content;
            meta.property = property;
            meta.name = name;
            isMeta = true;
          }
        }
      }

      return { meta, isMeta };
    })
    .filter(({ isMeta }) => isMeta)
    .map(({ meta }) => meta);
}
