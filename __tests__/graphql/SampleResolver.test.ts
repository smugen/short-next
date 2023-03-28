import { describe, expect, it } from '@jest/globals';

import { graphql } from '../../gql_generated';
import { executorFactory } from './setup';

const executor = executorFactory();

describe('SampleResolver', () => {
  describe('#hello', () => {
    const helloQuery = graphql(/* GraphQL */ `
      query helloQuery {
        hello
      }
    `);

    it('should return "Hello World!"', async () => {
      const { data } = await executor({
        document: helloQuery,
      });

      expect(data?.hello).toBe('Hello World!');
    });
  });
});
