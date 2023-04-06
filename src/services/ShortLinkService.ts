import { User } from '@/models';
import parse from 'node-html-parser';
import { Inject, Service } from 'typedi';

import SequelizeDatabase from './SequelizeDatabase';

@Service()
export default class ShortLinkService {
  static readonly parseMetaFromHtml = parseMetaFromHtml;

  constructor(
    @Inject(() => SequelizeDatabase)
    private readonly db: SequelizeDatabase,
  ) {}

  // async addShortLink(
  //   fullLink: string,
  //   { id: userId }: User,
  // ): Promise<ShortLink> {}
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
