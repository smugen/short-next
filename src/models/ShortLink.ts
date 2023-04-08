import crypto from 'crypto';
import { promisify } from 'util';

import GraphNode from '@/graphql/types/GraphNode';
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
import { Directive, Field, ID, ObjectType } from 'type-graphql';

import BaseModel from './BaseModel';
import ShortLinkMeta from './ShortLinkMeta';
import ShortLinkView from './ShortLinkView';
import User from './User';

const randomBytes = promisify(crypto.randomBytes);

@Directive(`@key(fields: "id")`)
@ObjectType('ShortLink', { implements: [GraphNode, BaseModel] })
@Table<ShortLink>({ modelName: 'ShortLink' })
export default class ShortLink extends BaseModel<ShortLink> {
  /** short link */
  @Field(() => String, {
    description: 'The ShortLink slug',
  })
  @Index({ unique: true, type: 'UNIQUE' })
  @AllowNull(false)
  @Column(DataTypes.STRING)
  slug!: CreationOptional<string>;

  @BeforeValidate
  static async defaultSlug(shortLink: ShortLink) {
    shortLink.slug || (shortLink.slug = await genSlug(ShortLink));
  }

  /** full link */
  @Field({
    description: 'The ShortLink full link',
  })
  @AllowNull(false)
  @Column(DataTypes.STRING)
  fullLink!: string;

  /** user id */
  @Field(() => ID, {
    description: 'The ShortLink user id',
  })
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.UUID)
  userId!: string;

  /** user */
  @Field(() => User, {
    description: 'The ShortLink user',
  })
  @BelongsTo(() => User)
  user?: User;

  /** meta list */
  @Field(() => [ShortLinkMeta], {
    description: 'The ShortLink meta list',
  })
  @HasMany(() => ShortLinkMeta, 'shortLinkId')
  metaList?: ShortLinkMeta[];

  /** views */
  @HasMany(() => ShortLinkView, 'shortLinkId')
  views?: ShortLinkView[];

  /** view count */
  @Field(() => Number, {
    description: 'The ShortLink view count',
  })
  viewCount: CreationOptional<number> = 0;
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
