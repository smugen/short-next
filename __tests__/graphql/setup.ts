import schemaFactory, { context } from '@/graphql';
import type { UserContext } from '@/graphql';
import {
  HTTPExecutorOptions,
  buildHTTPExecutor,
} from '@graphql-tools/executor-http';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { createYoga } from 'graphql-yoga';

import { graphql } from '../../gql_generated';

type AsyncExecutor<
  TBaseContext = Record<string, any>,
  TBaseExtensions = Record<string, any>,
> = <
  TReturn = any,
  TArgs extends Record<string, any> = Record<string, any>,
  TContext extends TBaseContext = TBaseContext,
  TRoot = any,
  TExtensions extends TBaseExtensions = TBaseExtensions,
>(
  // eslint-disable-next-line no-unused-vars
  request: ExecutionRequest<TArgs, TContext, TRoot, TExtensions, TReturn>,
) => Promise<ExecutionResult<TReturn>>;

export default function executorFactory(options: HTTPExecutorOptions = {}) {
  const yoga = createYoga<Record<string, never>, UserContext>({
    schema: schemaFactory(),
    context,
  });

  return buildHTTPExecutor({
    ...options,
    fetch: yoga.fetch,
  }) as AsyncExecutor<any, HTTPExecutorOptions>;
}

export const addUser = graphql(/* GraphQL */ `
  mutation addUser_test($input: AddUserInput!) {
    addUser(input: $input) {
      password
      user {
        createdAt
        deletedAt
        id
        name
        updatedAt
        username
      }
    }
  }
`);

export const signIn = graphql(/* GraphQL */ `
  mutation signIn_test($input: SignInInput!) {
    signIn(input: $input) {
      cyToken
      user {
        id
        username
      }
    }
  }
`);
