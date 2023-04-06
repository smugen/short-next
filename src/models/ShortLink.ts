import crypto from 'crypto';
import { promisify } from 'util';

import type { CreationOptional } from 'sequelize';
import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BeforeValidate,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Index,
  Table,
} from 'sequelize-typescript';

import BaseModel from './BaseModel';
import ShortLinkMeta from './ShortLinkMeta';
import ShortLinkView from './ShortLinkView';
import User from './User';

const randomBytes = promisify(crypto.randomBytes);

@Table<ShortLink>({})
export default class ShortLink extends BaseModel<ShortLink> {
  /** short link */
  @Index({ unique: true, type: 'UNIQUE' })
  @AllowNull(false)
  @Column(DataTypes.STRING)
  slug!: CreationOptional<string>;

  @BeforeValidate
  static async defaultSlug(shortLink: ShortLink) {
    shortLink.slug || (shortLink.slug = await genSlug(ShortLink));
  }

  /** full link */
  @AllowNull(false)
  @Column(DataTypes.STRING)
  fullLink!: string;

  /** user id */
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.UUID)
  userId!: string;

  /** user */
  @BelongsTo(() => User)
  user?: User;

  /** meta list */
  @HasMany(() => ShortLinkMeta, 'shortLinkId')
  metaList?: ShortLinkMeta[];

  /** views */
  @HasMany(() => ShortLinkView, 'shortLinkId')
  views?: ShortLinkView[];
}

async function genSlug(M: typeof ShortLink, lenFactor = 1): Promise<string> {
  const buf = await randomBytes(3 * lenFactor);
  const slug = urlSafeBase64Encode(buf);
  const exists = await M.count({ where: { slug } });
  if (exists) {
    return genSlug(M, lenFactor + 1);
  }
  return slug;
}

function urlSafeBase64Encode(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '~');
}
