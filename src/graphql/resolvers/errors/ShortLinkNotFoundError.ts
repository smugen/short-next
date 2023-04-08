import { GraphQLError } from 'graphql';

export default class ShortLinkNotFoundError extends GraphQLError {
  constructor(id: string) {
    super(`Could not resolve to a ShortLink with the id of '${id}'`);
  }
}
