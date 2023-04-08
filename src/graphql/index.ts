import { writeFile } from 'fs/promises';
import { resolve } from 'path';

import { User } from '@/models';
import SequelizeDatabase from '@/services/SequelizeDatabase';
import UserService from '@/services/UserService';
import { generate } from '@graphql-codegen/cli';
import { printSchemaWithDirectives } from '@graphql-tools/utils';
import * as cv from 'class-validator';
import { GraphQLSchema, lexicographicSortSchema } from 'graphql';
import type { YogaInitialContext, YogaServerOptions } from 'graphql-yoga';
import type { NextApiRequest, NextApiResponse } from 'next';
import { buildSchema } from 'type-graphql';
import type { AuthChecker } from 'type-graphql';
import Container from 'typedi';

import config from '../../codegen';
import ShortLinkMetaResolver from './resolvers/ShortLinkMetaResolver';
import ShortLinkResolver from './resolvers/ShortLinkResolver';
import UserResolver from './resolvers/UserResolver';

export type GraphqlContext = YogaInitialContext & ServerContext & UserContext;

export interface ServerContext {
  req?: NextApiRequest;
  res?: NextApiResponse;
}

export interface UserContext {
  user?: User;
}

// https://github.com/typestack/class-validator#using-service-container
cv.useContainer(Container);
Container.set(cv.Validator, new cv.Validator());

const authChecker: AuthChecker<GraphqlContext> = function authChecker({
  context,
}) {
  return !!context.user;
};

export default async function schemaFactory() {
  const schema = await buildSchema({
    resolvers: [UserResolver, ShortLinkResolver, ShortLinkMetaResolver],
    orphanedTypes: [],
    dateScalarMode: 'isoDate',
    container: Container,
    validate: { forbidUnknownValues: false },
    authMode: 'null',
    authChecker,
  });

  await setup(schema);

  return schema;
}

export async function setup(schema: GraphQLSchema) {
  await writeSchemaWithDirectives(
    resolve(process.cwd(), './gql_generated/schema.gql'),
    schema,
  );
  await generate(config, true);

  await Container.get(SequelizeDatabase).sequelize.sync();
}

async function writeSchemaWithDirectives(
  schemaFilePath: string,
  schema: GraphQLSchema,
): Promise<void> {
  const schemaFileContent = printSchemaWithDirectives(
    lexicographicSortSchema(schema),
  );
  await writeFile(schemaFilePath, schemaFileContent);
}

export const context: YogaServerOptions<ServerContext, UserContext>['context'] =
  async function context({ request }) {
    const userService = Container.get(UserService);
    const user = await userService.authenticate(request);
    return { user };
  };
