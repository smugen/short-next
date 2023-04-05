import { ModelStatic } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';

import { ShortLink } from './ShortLink';
import { User } from './User';

export { User };
export { ShortLink };

export interface Models {
  User: ModelStatic<User> & typeof User;
  ShortLink: ModelStatic<ShortLink> & typeof ShortLink;
}

export const models = [User, ShortLink] as ModelCtor[];
