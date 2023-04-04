import { writeFile } from 'fs/promises';
import { resolve } from 'path';

import { User } from '@/models';
import SequelizeDatabase from '@/services/SequelizeDatabase';
import { generate } from '@graphql-codegen/cli';
import { printSchemaWithDirectives } from '@graphql-tools/utils';
import * as cv from 'class-validator';
import { GraphQLSchema, lexicographicSortSchema } from 'graphql';
import { YogaInitialContext } from 'graphql-yoga';
import type { NextApiRequest, NextApiResponse } from 'next';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';

import config from '../../codegen';
import UserResolver from './resolvers/UserResolver';

export type GraphqlContext = YogaInitialContext & ServerContext & UserContext;

export interface ServerContext {
  req: NextApiRequest;
  res: NextApiResponse;
}

export interface UserContext {
  user?: User;
}

// https://github.com/typestack/class-validator#using-service-container
cv.useContainer(Container);
Container.set(cv.Validator, new cv.Validator());

export default async function schemaFactory() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    orphanedTypes: [],
    dateScalarMode: 'isoDate',
    container: Container,
    validate: { forbidUnknownValues: false },
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
