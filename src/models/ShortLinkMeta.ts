import GraphNode from '@/graphql/types/GraphNode';
import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Directive, Field, ID, ObjectType } from 'type-graphql';

import BaseModel from './BaseModel';
import ShortLink from './ShortLink';
import type ShortLinkType from './ShortLink';

@Directive(`@key(fields: "id")`)
@ObjectType({ implements: [GraphNode, BaseModel] })
@Table<ShortLinkMeta>({})
export default class ShortLinkMeta extends BaseModel<ShortLinkMeta> {
  /** tag name */
  @Field({
    description: 'The ShortLinkMeta tag name',
  })
  @AllowNull(false)
  @Column(DataTypes.STRING)
  tagName!: string;

  /** raw text */
  @Field({
    description: 'The ShortLinkMeta raw text',
    nullable: true,
  })
  @Column(DataTypes.TEXT)
  rawText?: string;

  /** content */
  @Field({
    description: 'The ShortLinkMeta content',
    nullable: true,
  })
  @Column(DataTypes.TEXT)
  content?: string;

  /** property */
  @Field({
    description: 'The ShortLinkMeta property',
    nullable: true,
  })
  @Column(DataTypes.STRING)
  property?: string;

  /** name */
  @Field({
    description: 'The ShortLinkMeta name',
    nullable: true,
  })
  @Column(DataTypes.STRING)
  name?: string;

  /** shortLink id */
  @Field(() => ID, {
    description: 'The ShortLinkMeta shortLink id',
  })
  @ForeignKey(() => ShortLink)
  @AllowNull(false)
  @Column(DataTypes.UUID)
  shortLinkId!: string;

  /** shortLink */
  @Field(() => ShortLink, {
    description: 'The ShortLinkMeta shortLink',
  })
  @BelongsTo(() => ShortLink)
  shortLink?: ShortLinkType;
}
