import assert from 'assert';
import type { IncomingHttpHeaders } from 'http';
import type { TLSSocket } from 'tls';
import { promisify } from 'util';

import SequelizeValidationError from '@/graphql/resolvers/errors/SequelizeValidationError';
import SignInError from '@/graphql/resolvers/errors/SignInError';
import UserNotFoundError from '@/graphql/resolvers/errors/UserNotFoundError';
import type AddUserInput from '@/graphql/resolvers/inputs/AddUserInput';
import type SignInInput from '@/graphql/resolvers/inputs/SignInInput';
import type AddUserOutput from '@/graphql/resolvers/outputs/AddUserOutput';
import type SignInOutput from '@/graphql/resolvers/outputs/SignInOutput';
import logger from '@/logger';
import type { User } from '@/models';
import { parse, serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ValidationError } from 'sequelize';
import { Inject, Service } from 'typedi';

import SequelizeDatabase from './SequelizeDatabase';
import UserLoader from './UserLoader';

const jwtSign = promisify<object, Buffer, jwt.SignOptions, string | undefined>(
  jwt.sign,
);
const jwtVerify = promisify<
  string,
  Buffer,
  jwt.VerifyOptions,
  object | undefined
>(jwt.verify);

const TOKEN_COOKIE_NAME = 'CYToken';
const path = '/';
/** 8 hours in seconds */
const TOKEN_EXPIRES_IN = 28800;
const TOKEN_TYPE = 'Bearer';

type NextReq = GetServerSidePropsContext['req'] | Request;

@Service()
export default class UserService {
  static readonly TOKEN_COOKIE_NAME = TOKEN_COOKIE_NAME;
  static readonly TOKEN_EXPIRES_IN = TOKEN_EXPIRES_IN;

  constructor(
    @Inject(() => SequelizeDatabase)
    private readonly db: SequelizeDatabase,
    @Inject(() => UserLoader)
    private readonly userLoader: UserLoader,
  ) {}

  async authenticate(reqOrToken: NextReq | string): Promise<User | undefined> {
    const TAG = 'authenticate';
    const token =
      typeof reqOrToken === 'string' ? reqOrToken : getToken(reqOrToken);
    if (!token) {
      return;
    }

    let decoded: Partial<TokenClaims>;
    try {
      const dec = jwt.decode(token);
      assert(dec && typeof dec === 'object', `Malformed claims ${dec}`);
      decoded = dec as typeof decoded;
    } catch (err) {
      logger.warn(TAG, { err, module: module.id });
      return;
    }

    const id = decoded.sub;
    try {
      const user = await this.db.UserModel.findByPk(id);
      if (user) {
        const secret = user.derivedKey;
        const verified = await jwtVerify(token, secret, {});
        if (verified) {
          return user;
        }
      }
    } catch (err) {
      logger.warn(TAG, { id, err, module: module.id });
    }

    return;
  }

  async signIn(
    { username, password }: SignInInput,
    req?: NextApiRequest,
    res?: NextApiResponse,
  ): Promise<SignInOutput> {
    const user =
      (await this.db.UserModel.verify(username, password)) ??
      (() => {
        const err = new SignInError(username);
        logger.warn(err.name, { username, module: module.id });
        throw err;
      })();

    const claims = new TokenClaims(user);
    const secret = user.derivedKey;
    const cyToken = await jwtSign({ ...claims }, secret, {
      expiresIn: TOKEN_EXPIRES_IN,
    });

    assert(cyToken, `Sign JWT got token ${cyToken}`);
    res?.setHeader(
      'Set-Cookie',
      serialize(TOKEN_COOKIE_NAME, cyToken, {
        path,
        httpOnly: true,
        maxAge: TOKEN_EXPIRES_IN,
        secure: (req?.socket as TLSSocket).encrypted,
      }),
    );

    logger.info('signIn', { username, module: module.id });
    return { user, cyToken };
  }

  signOut(res?: NextApiResponse) {
    res?.setHeader('Set-Cookie', serialize(TOKEN_COOKIE_NAME, '', { path }));
  }

  async addUser({
    name,
    username,
    password,
  }: AddUserInput): Promise<AddUserOutput> {
    try {
      let user = await this.db.UserModel.build({
        name,
        username,
      }).setPassword(password);

      user = await user.save();

      return { user, password };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new SequelizeValidationError(error);
      }
      logger.error('addUser', { error, module: module.id });
      throw error;
    }
  }

  async loadUserById(id: string): Promise<User> {
    const user = await this.userLoader.load(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return user;
  }
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageName = require('../../package.json').name;

/** @see https://auth0.com/docs/tokens/json-web-tokens/json-web-token-claims */
class TokenClaims {
  /** issuer */
  readonly iss: string = packageName;

  /** subject (user id) */
  readonly sub: string;

  /** audience */
  readonly aud: string = 'user';

  /** username */
  readonly username: string;

  constructor(user?: User) {
    this.sub = user?.id ?? '';
    this.username = user?.username ?? '';
  }
}

function getToken({ headers }: NextReq): string | undefined {
  const authorization =
    headers.get instanceof Function
      ? headers.get('authorization')
      : (headers as IncomingHttpHeaders).authorization;

  const [type, token] = authorization?.split(' ') ?? [];
  if (type === TOKEN_TYPE && token && typeof token === 'string') {
    return token;
  }

  const cookie =
    headers.get instanceof Function
      ? headers.get('cookie')
      : (headers as IncomingHttpHeaders).cookie;

  return (cookie && parse(cookie)[TOKEN_COOKIE_NAME]) || void 0;
}
