import assert from 'assert';

import { ShortLink } from '@/models';
import type { ShortLinkMeta, User } from '@/models';
import ShortLinkService from '@/services/ShortLinkService';
import UserService from '@/services/UserService';
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  ResolverInterface,
  Root,
} from 'type-graphql';
import { Inject, Service } from 'typedi';

import AddShortLinkInput from './inputs/AddShortLinkInput';
import AddShortLinkOutput from './outputs/AddShortLinkOutput';
import type { GraphqlContext } from '..';

@Service()
@Resolver(() => ShortLink)
export default class ShortLinkResolver implements ResolverInterface<ShortLink> {
  constructor(
    @Inject(() => ShortLinkService)
    private readonly shortLinkService: ShortLinkService,
    @Inject(() => UserService)
    private readonly userService: UserService,
  ) {}

  @Authorized()
  @Mutation(() => AddShortLinkOutput, {
    description: 'Add a new ShortLink.',
    nullable: true,
  })
  addShortLink(
    @Arg('input') input: AddShortLinkInput,
    @Ctx('user') user: GraphqlContext['user'],
  ): Promise<AddShortLinkOutput> {
    assert(user, 'User is not authenticated');
    return this.shortLinkService.addShortLink(input, user);
  }

  @FieldResolver()
  user(@Root() { userId }: ShortLink): Promise<User> {
    return this.userService.loadUserById(userId);
  }

  @FieldResolver()
  metaList(@Root() shortLink: ShortLink): Promise<ShortLinkMeta[]> {
    return this.shortLinkService.loadShortLinkMetas(shortLink);
  }

  @FieldResolver()
  viewCount(@Root() shortLink: ShortLink): Promise<number> {
    return this.shortLinkService.countViews(shortLink);
  }
}
