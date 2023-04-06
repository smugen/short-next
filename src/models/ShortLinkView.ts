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

@Table<ShortLinkView>({})
export default class ShortLinkView extends BaseModel<ShortLinkView> {
  /** shortLink id */
  @ForeignKey(() => ShortLink)
  @AllowNull(false)
  @Column(DataTypes.UUID)
  shortLinkId!: string;

  /** shortLink */
  @BelongsTo(() => ShortLink)
  shortLink?: ShortLink;
}
