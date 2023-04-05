import { ModelStatic } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';

import { ShortLink } from './ShortLink';
import { ShortLinkView } from './ShortLinkView';
import { User } from './User';

export { User };
export { ShortLink };
export { ShortLinkView };

export interface Models {
  User: ModelStatic<User> & typeof User;
  ShortLink: ModelStatic<ShortLink> & typeof ShortLink;
  ShortLinkView: ModelStatic<ShortLinkView> & typeof ShortLinkView;
}

export const models = [User, ShortLink, ShortLinkView] as ModelCtor[];
