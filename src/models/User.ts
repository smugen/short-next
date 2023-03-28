import assert from 'assert';
import crypto from 'crypto';
import { promisify } from 'util';

import GraphNode from '@/graphql/types/GraphNode';
import logger from '@/logger';
import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BeforeValidate,
  Column,
  Index,
  Table,
} from 'sequelize-typescript';
import { Directive, Field, ObjectType } from 'type-graphql';

import BaseModel from './BaseModel';

const randomBytes = promisify(crypto.randomBytes);
const scrypt = promisify(crypto.scrypt);

const USERNAME_MIN_LEN = 3;
export const SALT_LEN = 16;
export const KEY_LEN = 64;

/**
 * how many times {@link User.verify} performs {@link User.verifyPassword}
 */
let verifyCallCount = 0;
/**
 * average time {@link User.verify} takes to perform {@link User.verifyPassword}
 */
let verifyAvgTime = 0;

@Directive(`@key(fields: "id")`)
@ObjectType({ implements: [GraphNode, BaseModel] })
@Table<User>({})
export class User extends BaseModel<User> implements ScryptPassword {
  toJSON() {
    const { salt, derivedKey } = this;
    return {
      ...super.toJSON(),
      /** hide content */
      salt: `${salt.constructor.name}(${salt.length})`,
      /** hide content */
      derivedKey: `${derivedKey.constructor.name}(${derivedKey.length})`,
    };
  }

  /** name for display */
  @Field({
    description: 'The User name for display',
  })
  @Index
  @AllowNull(false)
  @Column(DataTypes.STRING)
  name!: string;

  @BeforeValidate
  static defaultNameFromUsername(user: User) {
    user.name || (user.name = user.username?.split('@')[0]);
  }

  /** username used for login */
  @Field({
    description: 'The User username',
  })
  @Index({ unique: true, type: 'UNIQUE' })
  @AllowNull(false)
  @Column({
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
      len: [USERNAME_MIN_LEN, 255],
    },
  })
  username!: string;

  @AllowNull(false)
  @Column(DataTypes.STRING(SALT_LEN).BINARY)
  salt!: Buffer;

  @AllowNull(false)
  @Column(DataTypes.STRING(KEY_LEN).BINARY)
  derivedKey!: Buffer;

  async setPassword(password: string): Promise<this> {
    const { salt, derivedKey } = await hashPswd(password);
    this.salt = salt;
    this.derivedKey = derivedKey;
    return this;
  }

  async verifyPassword(password: string): Promise<boolean> {
    const { salt, derivedKey } = this;
    if (
      !(
        salt &&
        Buffer.isBuffer(salt) &&
        salt.length === SALT_LEN &&
        derivedKey &&
        Buffer.isBuffer(derivedKey) &&
        derivedKey.length === KEY_LEN
      )
    ) {
      return false;
    }

    const { salt: hSalt, derivedKey: hDerivedKey } = await hashPswd(
      password,
      salt,
    );

    return salt.equals(hSalt) && derivedKey.equals(hDerivedKey);
  }

  static async verify(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findOne({ where: { username } });
    if (!user) {
      /**
       * delay response to prevent timing attack
       * that reveals whether username exists
       */
      return new Promise<null>(r => setTimeout(() => r(null), verifyAvgTime));
    }

    const start = Date.now();
    const ok = await user.verifyPassword(password);

    verifyAvgTime =
      (verifyAvgTime * verifyCallCount + Date.now() - start) /
      ++verifyCallCount;

    logger.debug('User.verify', {
      verifyAvgTime,
      verifyCallCount,
      module: module.filename,
    });

    return ok ? user : null;
  }
}

interface ScryptPassword {
  /**
   * {@link SALT_LEN} bytes long from
   *  {@link https://nodejs.org/dist/latest/docs/api/crypto.html#crypto_crypto_randombytes_size_callback | crypto.randomBytes}
   */
  salt: Buffer;

  /**
   * {@link KEY_LEN} bytes long from
   *  {@link https://nodejs.org/dist/latest/docs/api/crypto.html#crypto_crypto_scrypt_password_salt_keylen_options_callback | crypto.scrypt}
   */
  derivedKey: Buffer;
}

/**
 * hash password using `scrypt` password-based key derivation
 * @param password plain text to
 *  {@link https://nodejs.org/dist/latest/docs/api/crypto.html#crypto_crypto_scrypt_password_salt_keylen_options_callback | crypto.scrypt}
 * @param salt {Buffer} {@link SALT_LEN} bytes long for
 *  {@link https://nodejs.org/dist/latest/docs/api/crypto.html#crypto_crypto_scrypt_password_salt_keylen_options_callback | crypto.scrypt}
 */
async function hashPswd(
  password: string,
  salt?: Buffer,
): Promise<ScryptPassword> {
  assert(
    password && typeof password === 'string',
    new TypeError(`Bad password ${password}`),
  );

  if (!(salt && Buffer.isBuffer(salt) && salt.length === SALT_LEN)) {
    salt = await randomBytes(SALT_LEN);
  }
  return {
    salt,
    derivedKey: (await scrypt(password, salt, KEY_LEN)) as Buffer,
  };
}
