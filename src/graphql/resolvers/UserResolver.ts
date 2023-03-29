import { User } from '@/models';
import UserService from '@/services/UserService';
import { GraphQLVoid } from 'graphql-scalars';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import MeArgs from './args/MeArgs';
import AddUserInput from './inputs/AddUserInput';
import SignInInput from './inputs/SignInInput';
import AddUserOutput from './outputs/AddUserOutput';
import SignInOutput from './outputs/SignInOutput';
import type { GraphqlContext } from '..';

@Resolver(() => User)
@Service()
export default class UserResolver {
  constructor(
    @Inject(() => UserService)
    private readonly userService: UserService,
  ) {}

  @Query(() => User, {
    description: 'Who am I?',
    nullable: true,
  })
  async me(
    @Args() { token }: MeArgs,
    @Ctx('user') user: GraphqlContext['user'],
  ): Promise<User | undefined> {
    return token ? this.userService.authenticate(token) : user;
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
}
