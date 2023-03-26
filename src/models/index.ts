import { ModelStatic } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';

import { Entry } from './Entry';

export { Entry };

export interface Models {
  Entry: ModelStatic<Entry>;
}

export const models = [Entry] as ModelCtor[];
