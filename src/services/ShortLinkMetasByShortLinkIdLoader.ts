import type { ShortLinkMeta } from '@/models';
import DataLoader from 'dataloader';
import { Inject, Service } from 'typedi';

import SequelizeDatabase from './SequelizeDatabase';

type LoadShortLinkMetasByShortLinkIdKey = string;

@Service()
export default class ShortLinkMetasByShortLinkIdLoader extends DataLoader<
  LoadShortLinkMetasByShortLinkIdKey,
  ShortLinkMeta[]
> {
  constructor(
    @Inject(() => SequelizeDatabase) { ShortLinkMetaModel }: SequelizeDatabase,
  ) {
    async function batchQuery(
      keys: readonly LoadShortLinkMetasByShortLinkIdKey[],
    ) {
      const shortLinkId = [...new Set(keys)];
      const shortLinkMetas = await ShortLinkMetaModel.findAll({
        where: { shortLinkId },
      });
      return keys.map(key =>
        shortLinkMetas.filter(
          shortLinkMeta => shortLinkMeta.shortLinkId === key,
        ),
      );
    }

    super(batchQuery, { cache: false });
  }
}
