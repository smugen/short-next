import { User } from '@/models';
import type { ShortLink } from '@/models';
import ShortLinkService from '@/services/ShortLinkService';
import UserService from '@/services/UserService';
import { GraphQLVoid } from 'graphql-scalars';
import type { PromiseOrValue } from 'graphql-yoga';
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from 'type-graphql';
import { Inject, Service } from 'typedi';

import AddUserInput from './inputs/AddUserInput';
import SignInInput from './inputs/SignInInput';
import AddUserOutput from './outputs/AddUserOutput';
import SignInOutput from './outputs/SignInOutput';
import type { GraphqlContext } from '..';

@Service()
@Resolver(() => User)
export default class UserResolver implements ResolverInterface<User> {
  constructor(
    @Inject(() => UserService)
    private readonly userService: UserService,
    @Inject(() => ShortLinkService)
    private readonly shortLinkService: ShortLinkService,
  ) {}

  @Query(() => User, {
    description: 'Who am I?',
    nullable: true,
  })
  me(
    @Ctx('user') user: GraphqlContext['user'],
  ): PromiseOrValue<User | undefined> {
    return user;
  }

  @Mutation(() => AddUserOutput, {
    description: 'Add a new User.',
  })
  addUser(@Arg('input') input: AddUserInput): Promise<AddUserOutput> {
    return this.userService.addUser(input);
  }

  @Mutation(() => SignInOutput, {
    description: 'User sign-in.',
  })
  signIn(
    @Arg('input') input: SignInInput,
    @Ctx() { req, res }: GraphqlContext,
  ): Promise<SignInOutput> {
    return this.userService.signIn(input, req, res);
  }

  @Mutation(() => GraphQLVoid, {
    description: 'User sign-out.',
    nullable: true,
  })
  signOut(@Ctx('res') res: GraphqlContext['res']) {
    return this.userService.signOut(res);
  }

  @FieldResolver()
  shortLinks(@Root() { id }: User): Promise<ShortLink[]> {
    return this.shortLinkService.loadShortLinksByUserId(id);
  }
}
