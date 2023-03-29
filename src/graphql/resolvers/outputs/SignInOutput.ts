import { Field, ObjectType } from 'type-graphql';

import UserOutput from './UserOutput';

@ObjectType()
export default class SignInOutput extends UserOutput {
  @Field({
    description: 'The token of this session.',
  })
  cyToken!: string;
}
