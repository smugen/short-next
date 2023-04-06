import crypto from 'crypto';
import { promisify } from 'util';

import logger from '@/logger';
import type { Models, User } from '@/models';
import SequelizeDatabase from '@/services/SequelizeDatabase';
import UserLoader from '@/services/UserLoader';
import UserService from '@/services/UserService';
import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

const randomBytes = promisify(crypto.randomBytes);

// Mocks
const id = '0d557716-6016-49d7-be27-2f58e244882f';
const username = 'username';
const setPassword = jest.fn().mockReturnThis() as User['setPassword'];
const save = jest.fn().mockReturnThis() as User['save'];
const mockUser = { id, username, setPassword, save } as User;

const build = jest.fn().mockReturnValue(mockUser) as Models['User']['build'];
const verify = jest.fn().mockReturnValue(mockUser) as Models['User']['verify'];
const findByPk = jest
  .fn()
  .mockReturnValue(mockUser) as Models['User']['findByPk'];
const findAll = jest
  .fn()
  .mockReturnValueOnce([])
  .mockReturnValue([mockUser]) as Models['User']['findAll'];

const UserModel = { build, verify, findByPk, findAll } as Models['User'];

const db = {
  UserModel,
  models: { User: UserModel },
} as SequelizeDatabase;

const userLoader = new UserLoader(db);
const userService = new UserService(db, userLoader);

const setHeader = jest.fn() as NextApiResponse['setHeader'];
const res = { setHeader } as NextApiResponse;
const symbol = Symbol('symbol');
jest.spyOn(cookie, 'serialize').mockReturnValue(symbol as unknown as string);

const req = {
  socket: { encrypted: true },
  headers: { authorization: '' },
  cookies: { [UserService.TOKEN_COOKIE_NAME]: '' },
} as unknown as NextApiRequest;

jest.spyOn(logger, 'info').mockReturnThis();
jest.spyOn(logger, 'warn').mockReturnThis();

beforeAll(async () => {
  mockUser.derivedKey = await randomBytes(SequelizeDatabase.USER_KEY_LEN);
});

describe('UserService', () => {
  const password = 'password';
  let token: string;

  describe('#addUser', () => {
    it('should add a user', async () => {
      const name = 'name';

      expect(
        await userService.addUser({ name, username, password }),
      ).toMatchObject({ user: mockUser, password });
      expect(build).toHaveBeenLastCalledWith({ name, username });
      expect(setPassword).toHaveBeenLastCalledWith(password);
      expect(save).toHaveBeenLastCalledWith();
    });
  });

  describe('#signIn', () => {
    it('should sign in', async () => {
      const result = await userService.signIn({ username, password }, req, res);
      expect(result).toMatchObject({
        user: mockUser,
        cyToken: expect.any(String),
      });
      expect(verify).toHaveBeenLastCalledWith(username, password);
      expect(cookie.serialize).toHaveBeenLastCalledWith(
        UserService.TOKEN_COOKIE_NAME,
        expect.any(String),
        {
          path: '/',
          httpOnly: true,
          maxAge: UserService.TOKEN_EXPIRES_IN,
          secure: true,
        },
      );
      expect(setHeader).toHaveBeenLastCalledWith('Set-Cookie', symbol);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (req.socket as any).encrypted;
      await userService.signIn({ username, password }, req, res);
      expect(cookie.serialize).toHaveBeenLastCalledWith(
        UserService.TOKEN_COOKIE_NAME,
        expect.any(String),
        {
          path: '/',
          httpOnly: true,
          maxAge: UserService.TOKEN_EXPIRES_IN,
          secure: undefined,
        },
      );

      token = result.cyToken;
    });

    it('should throw SignInError', async () => {
      (verify as jest.MockedFunction<typeof verify>).mockResolvedValueOnce(
        null,
      );
      await expect(
        userService.signIn({ username, password }, req, res),
      ).rejects.toMatchInlineSnapshot(
        `[GraphQLError: Could not sign-in, The username 'username' or password is incorrect.]`,
      );
    });
  });

  describe('#authenticate', () => {
    it('should not authenticate with no token', async () => {
      expect(await userService.authenticate(req)).toBeUndefined();
    });

    it('should authenticate with authorization header', async () => {
      req.headers.authorization = `Bearer ${token}`;
      expect(await userService.authenticate(req)).toMatchObject({
        ...mockUser,
      });
    });

    it('should authenticate with cookie', async () => {
      delete req.headers.authorization;
      req.cookies[UserService.TOKEN_COOKIE_NAME] = token;
      expect(await userService.authenticate(req)).toMatchObject({
        ...mockUser,
      });
    });

    it('should not authenticate with invalid token', async () => {
      req.cookies[UserService.TOKEN_COOKIE_NAME] = 'invalid';
      expect(await userService.authenticate(req)).toBeUndefined();

      req.headers.authorization = `Bearer invalid`;
      expect(await userService.authenticate(req)).toBeUndefined();
    });

    it('should not authenticate with different secret', async () => {
      const { derivedKey } = mockUser;
      mockUser.derivedKey = Buffer.alloc(derivedKey.length);
      expect(await userService.authenticate(req)).toBeUndefined();
      mockUser.derivedKey = derivedKey;
    });
  });

  describe('#signOut', () => {
    it('should Set-Cookie empty', () => {
      userService.signOut(res);

      expect(cookie.serialize).toHaveBeenLastCalledWith(
        UserService.TOKEN_COOKIE_NAME,
        '',
        { path: '/' },
      );
      expect(setHeader).toHaveBeenLastCalledWith('Set-Cookie', symbol);
    });
  });

  describe('#loadUserById', () => {
    it('should throw UserNotFoundError', async () => {
      await expect(userService.loadUserById(id)).rejects.toMatchInlineSnapshot(
        `[GraphQLError: Could not resolve to a User with the id of '${id}']`,
      );
      expect(findAll).toHaveBeenLastCalledWith({ where: { id: [id] } });
    });

    it('should load user by id', async () => {
      expect(await userService.loadUserById(id)).toMatchObject({
        ...mockUser,
      });
      expect(findAll).toHaveBeenLastCalledWith({ where: { id: [id] } });
    });
  });
});
