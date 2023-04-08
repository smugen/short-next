import { ShortLinkMeta } from '@/models';
import type { ShortLink } from '@/models';
import ShortLinkService from '@/services/ShortLinkService';
import { FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';

@Service()
@Resolver(() => ShortLinkMeta)
export default class ShortLinkMetaResolver
  implements ResolverInterface<ShortLinkMeta>
{
  constructor(
    @Inject(() => ShortLinkService)
    private readonly shortLinkService: ShortLinkService,
  ) {}

  @FieldResolver()
  shortLink(@Root() { shortLinkId }: ShortLinkMeta): Promise<ShortLink> {
    return this.shortLinkService.loadShortLinkById(shortLinkId);
  }
}
