import assert from 'assert';
import crypto from 'crypto';

import SequelizeDatabase from '@/services/SequelizeDatabase';
import { afterAll, beforeAll, expect } from '@jest/globals';
import Container from 'typedi';

import { graphql } from '../../gql_generated';
import executorFactory, { addUser, signIn } from './setup';

const fullLink =
  'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head';

const db = Container.get(SequelizeDatabase);

beforeAll(() => db.sequelize.sync());
afterAll(() => db.sequelize.close());

describe('ShortLinkResolver', () => {
  const executor = executorFactory({
    headers() {
      return token
        ? ({
            authorization: `Bearer ${token}`,
          } as { authorization: string })
        : {};
    },
  });

  const username = `${crypto.randomUUID()}@example.com`;
  const password = 'password';
  let token: string;
  let shortLinkIds: string[];
  let shortLinkCount: number;

  beforeAll(async () => {
    const result = await executor({
      document: addUser,
      variables: { input: { username, password } },
    });
    expect(result.data?.addUser).toBeTruthy();
    expect(result.errors).toBeUndefined();

    const { data } = await executor({
      document: signIn,
      variables: { input: { username, password } },
    });

    assert(data?.signIn.cyToken);
    token = data?.signIn.cyToken;
  });

  describe('#addShortLink', () => {
    const addShortLink = graphql(/* GraphQL */ `
      mutation addShortLink_test($input: AddShortLinkInput!) {
        addShortLink(input: $input) {
          shortLink {
            id
            slug
            fullLink
            user {
              username
            }
          }
        }
      }
    `);

    it('should add a shortLink', async () => {
      const { data } = await executor({
        document: addShortLink,
        variables: { input: { fullLink } },
      });

      expect(data?.addShortLink).toMatchObject({
        shortLink: {
          id: expect.any(String),
          slug: expect.any(String),
          fullLink,
          user: { username },
        },
      });
    });

    it('should return null if not signed in', async () => {
      const savedToken = token;
      token = '';

      const { data } = await executor({
        document: addShortLink,
        variables: { input: { fullLink } },
      });

      token = savedToken;

      expect(data?.addShortLink).toBeNull();
    });
  });

  describe('#me.shortLinks', () => {
    const myShortLinks = graphql(/* GraphQL */ `
      query myShortLinks_test {
        me {
          shortLinks {
            id
            viewCount
            metaList {
              id
              shortLink {
                id
              }
            }
          }
        }
      }
    `);

    it('should return shortLinks of the current user', async () => {
      const { data } = await executor({
        document: myShortLinks,
      });

      expect(data?.me?.shortLinks).toBeInstanceOf(Array);
      expect(data?.me?.shortLinks?.length).toBeGreaterThan(0);
      expect(data?.me?.shortLinks?.[0]).toMatchObject({
        id: expect.any(String),
        viewCount: expect.any(Number),
        metaList: expect.any(Array),
      });

      expect(data?.me?.shortLinks?.[0].metaList.length).toBeGreaterThan(0);
      expect(data?.me?.shortLinks?.[0].metaList[0]).toMatchObject({
        id: expect.any(String),
        shortLink: {
          id: data?.me?.shortLinks?.[0].id,
        },
      });

      assert(data?.me?.shortLinks);
      shortLinkIds = data?.me?.shortLinks?.map(sl => sl.id);
      shortLinkCount = data?.me?.shortLinks?.length;
    });
  });

  describe('#removeShortLinks', () => {
    const removeShortLinks = graphql(/* GraphQL */ `
      mutation removeShortLinks_test($input: RemoveShortLinksInput!) {
        removeShortLinks(input: $input) {
          removedCount
        }
      }
    `);

    it('should return null if not signed in', async () => {
      const savedToken = token;
      token = '';

      const { data } = await executor({
        document: removeShortLinks,
        variables: { input: { shortLinkIdList: shortLinkIds } },
      });

      token = savedToken;

      expect(data?.removeShortLinks).toBeNull();
    });

    it('should remove shortLinks', async () => {
      const { data } = await executor({
        document: removeShortLinks,
        variables: { input: { shortLinkIdList: shortLinkIds } },
      });

      expect(data?.removeShortLinks).toMatchObject({
        removedCount: shortLinkCount,
      });
    });
  });
});
