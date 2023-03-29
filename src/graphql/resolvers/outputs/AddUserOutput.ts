import { Field, ObjectType } from 'type-graphql';

import UserOutput from './UserOutput';

@ObjectType()
export default class AddUserOutput extends UserOutput {
  @Field({
    description: 'The password of the User.',
  })
  password!: string;
}
