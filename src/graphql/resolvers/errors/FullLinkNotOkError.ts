import { GraphQLError } from 'graphql';

export default class FullLinkNotOkError extends GraphQLError {
  constructor(url: string | URL, fetchResOrErr: Response | Error) {
    super(
      fetchResOrErr instanceof Error
        ? `Error: ${fetchResOrErr.message}\nfrom: ${url}`
        : `Response: ${fetchResOrErr.status} ${fetchResOrErr.statusText}\nfrom: ${url}`,
    );
  }
}
