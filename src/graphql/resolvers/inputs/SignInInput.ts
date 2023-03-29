import { EmailAddressResolver } from 'graphql-scalars';
import { Field, InputType } from 'type-graphql';

@InputType()
export default class SignInInput {
  @Field(() => EmailAddressResolver, {
    description: 'Email address as username for the User.',
  })
  username!: string;

  @Field({
    description: 'Password for the User.',
  })
  password!: string;
}
