import { GraphQLError } from 'graphql';

export default class ResponseNotOkError extends GraphQLError {
  constructor(url: URL, response: Response) {
    super(`Response: ${response.status} ${response.statusText}\nfrom: ${url}`);
  }
}
