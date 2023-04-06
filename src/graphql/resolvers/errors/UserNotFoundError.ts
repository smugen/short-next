import { GraphQLError } from 'graphql';

export default class UserNotFoundError extends GraphQLError {
  constructor(id: string) {
    super(`Could not resolve to a User with the id of '${id}'`);
  }
}
