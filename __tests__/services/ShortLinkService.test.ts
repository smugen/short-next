import type { Models, User } from '@/models';
import { ShortLink } from '@/models';
import SequelizeDatabase from '@/services/SequelizeDatabase';
import ShortLinkLoader from '@/services/ShortLinkLoader';
import ShortLinkMetasByShortLinkIdLoader from '@/services/ShortLinkMetasByShortLinkIdLoader';
import ShortLinksByUserIdLoader from '@/services/ShortLinksByUserIdLoader';
import ShortLinkService from '@/services/ShortLinkService';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import html from './html';

// Mocks
const id = '912c365a-2825-4045-8f7f-ae758405475e';
const userId = '0d557716-6016-49d7-be27-2f58e244882f';
const slug = 'test';
const fullLink =
  'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head';
const mockShortLink = { id, userId, slug, fullLink } as ShortLink;

const findAll = jest
  .fn()
  .mockReturnValueOnce([mockShortLink])
  .mockReturnValue([]) as
  | Models['ShortLink']['findAll']
  | Models['ShortLinkMeta']['findAll'];
const create = jest.fn().mockReturnValue(mockShortLink) as
  | Models['ShortLink']['create']
  | Models['ShortLinkView']['create'];
const findOne = jest
  .fn()
  .mockReturnValueOnce(null)
  .mockReturnValue(mockShortLink) as Models['ShortLink']['findOne'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const destroy = jest.fn((arg: any) =>
    Array.isArray(arg?.where?.id) ? arg.where.id.length : 0,
  ) as Models['ShortLink']['destroy'];
  const ShortLinkModel = {
    findAll,
    create,
    findOne,
    destroy,
  } as Models['ShortLink'];

  const bulkCreate = jest.fn() as Models['ShortLinkMeta']['bulkCreate'];
  const ShortLinkMetaModel = { bulkCreate, findAll } as Models['ShortLinkMeta'];

  const count = jest
    .fn()
    .mockReturnValue(0) as Models['ShortLinkView']['count'];
  const ShortLinkViewModel = { create, count } as Models['ShortLinkView'];

  const db = {
    ShortLinkModel,
    ShortLinkMetaModel,
    ShortLinkViewModel,
    models: {
      ShortLink: ShortLinkModel,
      ShortLinkMeta: ShortLinkMetaModel,
      ShortLinkView: ShortLinkViewModel,
    },
  } as SequelizeDatabase;

  const mockFetch = jest
    .fn<typeof fetch>()
    .mockResolvedValueOnce({
      ok: false,
      status: 777,
      statusText: 'Mocked status text',
    } as Response)
    .mockResolvedValue({
      ok: true,
      text: jest
        .fn<Response['text']>()
        .mockResolvedValue(html) as Response['text'],
    } as Response);

  const shortLinkLoader = new ShortLinkLoader(db);
  const shortLinksByUserIdLoader = new ShortLinksByUserIdLoader(db);
  const shortLinkMetasByShortLinkIdLoader =
    new ShortLinkMetasByShortLinkIdLoader(db);
  const shortLinkService = new ShortLinkService(
    db,
    shortLinkLoader,
    shortLinksByUserIdLoader,
    shortLinkMetasByShortLinkIdLoader,
  );

  describe('ShortLinkService', () => {
    describe('.parseMetaFromHtml', () => {
      it('should parse meta from html', () => {
        const metaList = ShortLinkService.parseMetaFromHtml(html);
        expect(metaList).toMatchInlineSnapshot(`
        [
          {
            "rawText": "
              &lt;head&gt;: The Document Metadata (Header) element - HTML: HyperText
              Markup Language | MDN
            ",
            "tagName": "TITLE",
          },
          {
            "content": "The <head> HTML element contains machine-readable information (metadata) about the document, like its title, scripts, and style sheets.",
            "name": "description",
            "property": undefined,
            "tagName": "META",
          },
          {
            "content": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head",
            "name": undefined,
            "property": "og:url",
            "tagName": "META",
          },
          {
            "content": "<head>: The Document Metadata (Header) element - HTML: HyperText Markup Language | MDN",
            "name": undefined,
            "property": "og:title",
            "tagName": "META",
          },
          {
            "content": "en-US",
            "name": undefined,
            "property": "og:locale",
            "tagName": "META",
          },
          {
            "content": "The <head> HTML element contains machine-readable information (metadata) about the document, like its title, scripts, and style sheets.",
            "name": undefined,
            "property": "og:description",
            "tagName": "META",
          },
          {
            "content": "https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png",
            "name": undefined,
            "property": "og:image",
            "tagName": "META",
          },
          {
            "content": "summary_large_image",
            "name": undefined,
            "property": "twitter:card",
            "tagName": "META",
          },
        ]
      `);
      });
    });

    describe('#addShortLink', () => {
      const globalFetch = global.fetch;
      beforeAll(() => {
        global.fetch = mockFetch;
      });
      afterAll(() => {
        global.fetch = globalFetch;
      });

      it('should throw ResponseNotOkError', async () => {
        await expect(
          shortLinkService.addShortLink({ fullLink }, {
            id: userId,
          } as User),
        ).rejects.toMatchInlineSnapshot(`
        [GraphQLError: Response: 777 Mocked status text
        from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head]
      `);

        expect(mockFetch).toHaveBeenLastCalledWith(new URL(fullLink));
      });

      it('should add shortLink', async () => {
        expect(
          await shortLinkService.addShortLink({ fullLink }, {
            id: userId,
          } as User),
        ).toMatchInlineSnapshot(`
        {
          "shortLink": {
            "fullLink": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head",
            "id": "912c365a-2825-4045-8f7f-ae758405475e",
            "slug": "test",
            "userId": "0d557716-6016-49d7-be27-2f58e244882f",
          },
        }
      `);

        expect(mockFetch).toHaveBeenLastCalledWith(new URL(fullLink));
        expect(create).toHaveBeenLastCalledWith({ fullLink, userId });
        expect((bulkCreate as jest.Mock).mock.calls[0][0])
          .toMatchInlineSnapshot(`
        [
          {
            "rawText": "
              &lt;head&gt;: The Document Metadata (Header) element - HTML: HyperText
              Markup Language | MDN
            ",
            "shortLinkId": "912c365a-2825-4045-8f7f-ae758405475e",
            "tagName": "TITLE",
          },
          {
            "content": "The <head> HTML element contains machine-readable information (metadata) about the document, like its title, scripts, and style sheets.",
            "name": "description",
            "property": undefined,
            "shortLinkId": "912c365a-2825-4045-8f7f-ae758405475e",
            "tagName": "META",
          },
          {
            "content": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head",
            "name": undefined,
            "property": "og:url",
            "shortLinkId": "912c365a-2825-4045-8f7f-ae758405475e",
            "tagName": "META",
          },
          {
            "content": "<head>: The Document Metadata (Header) element - HTML: HyperText Markup Language | MDN",
            "name": undefined,
            "property": "og:title",
            "shortLinkId": "912c365a-2825-4045-8f7f-ae758405475e",
            "tagName": "META",
          },
          {
            "content": "en-US",
            "name": undefined,
            "property": "og:locale",
            "shortLinkId": "912c365a-2825-4045-8f7f-ae758405475e",
            "tagName": "META",
          },
          {
            "content": "The <head> HTML element contains machine-readable information (metadata) about the document, like its title, scripts, and style sheets.",
            "name": undefined,
            "property": "og:description",
            "shortLinkId": "912c365a-2825-4045-8f7f-ae758405475e",
            "tagName": "META",
          },
          {
            "content": "https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png",
            "name": undefined,
            "property": "og:image",
            "shortLinkId": "912c365a-2825-4045-8f7f-ae758405475e",
            "tagName": "META",
          },
          {
            "content": "summary_large_image",
            "name": undefined,
            "property": "twitter:card",
            "shortLinkId": "912c365a-2825-4045-8f7f-ae758405475e",
            "tagName": "META",
          },
        ]
      `);
      });
    });

    describe('#removeShortLinks', () => {
      it('should remove shortLinks', async () => {
        expect(
          await shortLinkService.removeShortLinks({ shortLinkIdList: [id] }, {
            id: userId,
          } as User),
        ).toMatchObject({ removedCount: 1 });
        expect(destroy).toHaveBeenLastCalledWith({
          where: { id: [id], userId },
        });
      });
    });

    describe('#loadShortLinkById', () => {
      it('should load shortLink by id', async () => {
        expect(await shortLinkService.loadShortLinkById(id)).toMatchObject({
          ...mockShortLink,
        });
        expect(findAll).toHaveBeenLastCalledWith({ where: { id: [id] } });
      });
    });

    describe('#getShortLinkBySlug', () => {
      it('should get shortLink by slug', async () => {
        expect(await shortLinkService.getShortLinkBySlug(slug, false)).toBe(
          null,
        );
        expect(findOne).toHaveBeenLastCalledWith({
          where: { slug },
          include: void 0,
        });

        expect(await shortLinkService.getShortLinkBySlug(slug)).toMatchObject({
          ...mockShortLink,
        });
        expect(findOne).toHaveBeenLastCalledWith({
          where: { slug },
          include: ShortLinkMetaModel,
        });
      });
    });

    describe('#recordViewOfShortLink', () => {
      it('should record view of shortLink', async () => {
        await shortLinkService.recordViewOfShortLink(mockShortLink);
        expect(create).toHaveBeenLastCalledWith({ shortLinkId: id });
      });
    });

    describe('#loadShortLinksByUserId', () => {
      it('should load shortLinks by userId', async () => {
        expect(
          await shortLinkService.loadShortLinksByUserId(userId),
        ).toBeInstanceOf(Array);
        expect(findAll).toHaveBeenLastCalledWith({
          where: { userId: [userId] },
        });
      });
    });

    describe('#countViews', () => {
      it('should count views', async () => {
        expect(await shortLinkService.countViews(mockShortLink)).toBe(0);
        expect(count).toHaveBeenLastCalledWith({ where: { shortLinkId: id } });
      });
    });

    describe('#loadShortLinkMetas', () => {
      it('should load shortLink metas', async () => {
        expect(
          await shortLinkService.loadShortLinkMetas(mockShortLink),
        ).toBeInstanceOf(Array);
        expect(findAll).toHaveBeenLastCalledWith({
          where: { shortLinkId: [id] },
        });
      });
    });
  });
