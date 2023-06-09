import assert from 'assert';

import SequelizeDatabase from '@/services/SequelizeDatabase';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import Container from 'typedi';

import { graphql } from '../../gql_generated';
import executorFactory, { addUser, signIn } from './setup';

const db = Container.get(SequelizeDatabase);

beforeAll(() => db.sequelize.sync());
afterAll(() => db.sequelize.close());

describe('UserResolver', () => {
  const executor = executorFactory({
    headers() {
      return token
        ? ({
            authorization: `Bearer ${token}`,
          } as { authorization: string })
        : {};
    },
  });

  const username = 'abc@example.com';
  const password = 'password';
  let id: string;
  let token: string;

  describe('#addUser', () => {
    const name = 'name';

    it('should add a user', async () => {
      const { data } = await executor({
        document: addUser,
        variables: { input: { name, username, password } },
      });

      expect(data?.addUser).toMatchObject({
        password,
        user: { name, username },
      });

      const user = data?.addUser.user;
      expect(user?.id).toStrictEqual(expect.any(String));
      expect(user?.createdAt).toStrictEqual(expect.any(String));
      expect(user?.updatedAt).toStrictEqual(expect.any(String));
      expect(user?.deletedAt).toBeNull();
      expect(user?.createdAt).toBe(new Date(user?.createdAt).toISOString());
      expect(user?.updatedAt).toBe(new Date(user?.updatedAt).toISOString());

      assert(user?.id);
      id = user?.id;
    });

    it('should not add a user with duplicate username', async () => {
      const { data, errors } = await executor({
        document: addUser,
        variables: { input: { name, username, password } },
      });

      expect(data?.addUser).toBeUndefined();
      expect(errors).toHaveLength(1);
      expect(errors?.[0]).toMatchInlineSnapshot(`
        {
          "locations": [
            {
              "column": 3,
              "line": 2,
            },
          ],
          "message": "username must be unique",
          "path": [
            "addUser",
          ],
        }
      `);
    });
  });

  describe('#signIn', () => {
    it('should sign in', async () => {
      const { data } = await executor({
        document: signIn,
        variables: { input: { username, password } },
      });

      expect(data?.signIn).toMatchObject({
        user: { id, username },
        cyToken: expect.any(String),
      });

      assert(data?.signIn?.cyToken);
      token = data?.signIn?.cyToken;
    });

    it('should not sign in with wrong password', async () => {
      const { data, errors } = await executor({
        document: signIn,
        variables: { input: { username, password: 'wrong' } },
      });

      expect(data?.signIn).toBeUndefined();
      expect(errors).toHaveLength(1);
      expect(errors?.[0]).toMatchInlineSnapshot(`
        {
          "locations": [
            {
              "column": 3,
              "line": 2,
            },
          ],
          "message": "Could not sign-in, The username 'abc@example.com' or password is incorrect.",
          "path": [
            "signIn",
          ],
        }
      `);
    });

    it('should not sign in with wrong username', async () => {
      const { data, errors } = await executor({
        document: signIn,
        variables: { input: { username: 'a@b.com', password } },
      });

      expect(data?.signIn).toBeUndefined();
      expect(errors).toHaveLength(1);
      expect(errors?.[0]).toMatchInlineSnapshot(`
        {
          "locations": [
            {
              "column": 3,
              "line": 2,
            },
          ],
          "message": "Could not sign-in, The username 'a@b.com' or password is incorrect.",
          "path": [
            "signIn",
          ],
        }
      `);
    });
  });

  describe('#me', () => {
    const me = graphql(/* GraphQL */ `
      query me_test {
        me {
          id
          username
        }
      }
    `);

    it('should return the current user', async () => {
      const { data } = await executor({
        document: me,
      });

      expect(data?.me).toMatchObject({ id, username });
    });

    it('should return null if not signed in', async () => {
      const savedToken = token;
      token = '';

      const { data } = await executor({
        document: me,
      });

      token = savedToken;

      expect(data?.me).toBeNull();
    });
  });

  describe('#signOut', () => {
    const signOut = graphql(/* GraphQL */ `
      mutation signOut_test {
        signOut
      }
    `);

    it('should sign out', async () => {
      const { data } = await executor({
        document: signOut,
      });

      expect(data?.signOut).toBeNull();
    });
  });
});
