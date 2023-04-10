import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export default class RemoveOutput {
  @Field(() => Int, {
    description: 'The number of objects that been removed.',
  })
  removedCount!: number;
}
