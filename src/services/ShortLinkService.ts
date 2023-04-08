import ResponseNotOkError from '@/graphql/resolvers/errors/ResponseNotOkError';
import ShortLinkNotFoundError from '@/graphql/resolvers/errors/ShortLinkNotFoundError';
import AddShortLinkInput from '@/graphql/resolvers/inputs/AddShortLinkInput';
import AddShortLinkOutput from '@/graphql/resolvers/outputs/AddShortLinkOutput';
import logger from '@/logger';
import type { ShortLink, ShortLinkMeta, ShortLinkView, User } from '@/models';
import parse, { valid } from 'node-html-parser';
import { Inject, Service } from 'typedi';

import SequelizeDatabase from './SequelizeDatabase';
import ShortLinkLoader from './ShortLinkLoader';
import ShortLinkMetasByShortLinkIdLoader from './ShortLinkMetasByShortLinkIdLoader';
import ShortLinksByUserIdLoader from './ShortLinksByUserIdLoader';

@Service()
export default class ShortLinkService {
  static readonly parseMetaFromHtml = parseMetaFromHtml;

  constructor(
    @Inject(() => SequelizeDatabase)
    private readonly db: SequelizeDatabase,
    @Inject(() => ShortLinkLoader)
    private readonly shortLinkLoader: ShortLinkLoader,
    @Inject(() => ShortLinksByUserIdLoader)
    private readonly shortLinksByUserIdLoader: ShortLinksByUserIdLoader,
    @Inject(() => ShortLinkMetasByShortLinkIdLoader)
    private readonly shortLinkMetasByShortLinkIdLoader: ShortLinkMetasByShortLinkIdLoader,
  ) {}

  async addShortLink(
    { fullLink }: AddShortLinkInput,
    { id: userId }: User,
  ): Promise<AddShortLinkOutput> {
    const url = new URL(fullLink);
    const res = await fetch(url);
    if (!res.ok) {
      throw new ResponseNotOkError(url, res);
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
      logger.warn('addShortLink', { error, module: module.id });
    }

    return { shortLink };
  }

  async loadShortLinkById(id: string): Promise<ShortLink> {
    const shortLink = await this.shortLinkLoader.load(id);
    if (!shortLink) {
      throw new ShortLinkNotFoundError(id);
    }
    return shortLink;
  }

  getShortLinkBySlug(
    slug: string,
    includeMetas = true,
  ): Promise<ShortLink | null> {
    const include = includeMetas ? this.db.ShortLinkMetaModel : void 0;

    return this.db.ShortLinkModel.findOne({
      where: { slug },
      include,
    });
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
