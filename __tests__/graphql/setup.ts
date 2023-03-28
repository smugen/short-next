import schemaFactory from '@/graphql';
import {
  HTTPExecutorOptions,
  buildHTTPExecutor,
} from '@graphql-tools/executor-http';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { createYoga } from 'graphql-yoga';

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

export function executorFactory() {
  const yoga = createYoga({ schema: schemaFactory() });

  return buildHTTPExecutor({
    fetch: yoga.fetch,
  }) as AsyncExecutor<any, HTTPExecutorOptions>;
}
