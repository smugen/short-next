import { Field, InputType } from 'type-graphql';

import SignInInput from './SignInInput';

@InputType()
export default class AddUserInput extends SignInInput {
  @Field({
    description: 'Specify name for the User.',
    nullable: true,
  })
  name?: string;
}
