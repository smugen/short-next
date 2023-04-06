import ShortLinkService from '@/services/ShortLinkService';
import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import html from './html';

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
});
