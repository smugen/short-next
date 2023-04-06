import { ModelStatic } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';

import ShortLink from './ShortLink';
import ShortLinkMeta from './ShortLinkMeta';
import ShortLinkView from './ShortLinkView';
import User from './User';

export { User };
export { ShortLink };
export { ShortLinkView };
export { ShortLinkMeta };

export interface Models {
  User: ModelStatic<User> & typeof User;
  ShortLink: ModelStatic<ShortLink> & typeof ShortLink;
  ShortLinkView: ModelStatic<ShortLinkView> & typeof ShortLinkView;
  ShortLinkMeta: ModelStatic<ShortLinkMeta> & typeof ShortLinkMeta;
}

export const models = [
  User,
  ShortLink,
  ShortLinkView,
  ShortLinkMeta,
] as ModelCtor[];
