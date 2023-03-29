import { GraphQLError } from 'graphql';

export default class SignInError extends GraphQLError {
  constructor(username: string) {
    super(
      `Could not sign-in, The username '${username}' or password is incorrect.`,
    );
  }
}
