import { User } from '@/models';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ isAbstract: true })
export default class UserOutput {
  @Field({
    description: 'The User object.',
  })
  user!: User;
}
