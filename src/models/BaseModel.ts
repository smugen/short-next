import { inspect } from 'util';

import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { DataTypes } from 'sequelize';
import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey,
  UpdatedAt,
} from 'sequelize-typescript';

interface IModel {
  readonly id: CreationOptional<string>;
  readonly createdAt?: Date | null;
  readonly updatedAt?: Date | null;
  readonly deletedAt?: Date | null;
}

export default abstract class BaseModel<M extends Model = Model>
  extends Model<
    InferAttributes<M & IModel>,
    InferCreationAttributes<M & IModel>
  >
  implements IModel
{
  [inspect.custom]() {
    return this.toJSON();
  }

  @PrimaryKey
  @Column({
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  readonly id!: CreationOptional<string>;

  @CreatedAt
  readonly createdAt?: Date | null;

  @UpdatedAt
  readonly updatedAt?: Date | null;

  @DeletedAt
  readonly deletedAt?: Date | null;
}
