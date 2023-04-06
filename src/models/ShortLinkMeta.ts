import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Table,
} from 'sequelize-typescript';

import BaseModel from './BaseModel';
import ShortLink from './ShortLink';

@Table<ShortLinkMeta>({})
export default class ShortLinkMeta extends BaseModel<ShortLinkMeta> {
  /** tag name */
  @AllowNull(false)
  @Column(DataTypes.STRING)
  tagName!: string;

  /** raw text */
  @Column(DataTypes.TEXT)
  rawText?: string;

  /** content */
  @Column(DataTypes.TEXT)
  content?: string;

  /** property */
  @Column(DataTypes.STRING)
  property?: string;

  /** name */
  @Column(DataTypes.STRING)
  name?: string;

  /** shortLink id */
  @ForeignKey(() => ShortLink)
  @AllowNull(false)
  @Column(DataTypes.UUID)
  shortLinkId!: string;

  /** shortLink */
  @BelongsTo(() => ShortLink)
  shortLink?: ShortLink;
}
