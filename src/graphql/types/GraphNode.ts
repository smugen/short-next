import { Field, ID, InterfaceType } from 'type-graphql';

@InterfaceType('Node')
export default abstract class GraphNode {
  @Field(() => ID)
  get id(): string {
    throw new TypeError('Please override it');
  }
}
