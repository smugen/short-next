import { inspect } from 'util';

import GraphNode from '@/graphql/types/GraphNode';
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
import { Field, ID, InterfaceType } from 'type-graphql';

interface IModel {
  readonly id: CreationOptional<string>;
  readonly createdAt?: Date | null;
  readonly updatedAt?: Date | null;
  readonly deletedAt?: Date | null;
}

@InterfaceType('DaoNode', { implements: GraphNode })
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

  @Field(() => ID)
  @PrimaryKey
  @Column({
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  readonly id!: CreationOptional<string>;

  @Field(() => Date, {
    description: 'The DAO created at.',
    nullable: true,
  })
  @CreatedAt
  readonly createdAt?: Date | null;

  @Field(() => Date, {
    description: 'The DAO updated at.',
    nullable: true,
  })
  @UpdatedAt
  readonly updatedAt?: Date | null;

  @Field(() => Date, {
    description: 'The DAO deleted at.',
    nullable: true,
  })
  @DeletedAt
  readonly deletedAt?: Date | null;
}
