import type { User } from '@/models';
import DataLoader from 'dataloader';
import { Inject, Service } from 'typedi';

import SequelizeDatabase from './SequelizeDatabase';

type LoadUserKey = string;

@Service()
export default class UserLoader extends DataLoader<
  LoadUserKey,
  User | undefined
> {
  constructor(
    @Inject(() => SequelizeDatabase) { UserModel }: SequelizeDatabase,
  ) {
    async function batchQuery(keys: readonly LoadUserKey[]) {
      const id = [...new Set(keys)];
      const users = await UserModel.findAll({ where: { id } });
      return keys.map(key => users.find(user => user.id === key));
    }

    super(batchQuery, { cache: false });
  }
}
