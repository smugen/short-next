import { ModelStatic } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';

import { User } from './User';

export type { User };

export interface Models {
  User: ModelStatic<User> & typeof User;
}

export const models = [User] as ModelCtor[];
