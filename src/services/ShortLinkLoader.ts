import type { ShortLink } from '@/models';
import DataLoader from 'dataloader';
import { Inject, Service } from 'typedi';

import SequelizeDatabase from './SequelizeDatabase';

type LoadShortLinkKey = string;

@Service()
export default class ShortLinkLoader extends DataLoader<
  LoadShortLinkKey,
  ShortLink | undefined
> {
  constructor(
    @Inject(() => SequelizeDatabase) { ShortLinkModel }: SequelizeDatabase,
  ) {
    async function batchQuery(keys: readonly LoadShortLinkKey[]) {
      const id = [...new Set(keys)];
      const shortLinks = await ShortLinkModel.findAll({ where: { id } });
      return keys.map(key =>
        shortLinks.find(shortLink => shortLink.id === key),
      );
    }

    super(batchQuery, { cache: false });
  }
}
