import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export default class MeArgs {
  @Field({
    description:
      'User token take precedence of Authorization header and Cookie.',
    nullable: true,
  })
  token?: string;
}
