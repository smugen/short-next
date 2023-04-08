import type { ShortLink } from '@/models';
import DataLoader from 'dataloader';
import { Inject, Service } from 'typedi';

import SequelizeDatabase from './SequelizeDatabase';

type LoadShortLinksByUserIdKey = string;

@Service()
export default class ShortLinksByUserIdLoader extends DataLoader<
  LoadShortLinksByUserIdKey,
  ShortLink[]
> {
  constructor(
    @Inject(() => SequelizeDatabase) { ShortLinkModel }: SequelizeDatabase,
  ) {
    async function batchQuery(keys: readonly LoadShortLinksByUserIdKey[]) {
      const userId = [...new Set(keys)];
      const shortLinks = await ShortLinkModel.findAll({ where: { userId } });
      return keys.map(key =>
        shortLinks.filter(shortLink => shortLink.userId === key),
      );
    }

    super(batchQuery, { cache: false });
  }
}
