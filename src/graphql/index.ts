import { writeFile } from 'fs/promises';
import { resolve } from 'path';

import { User } from '@/models';
import { printSchemaWithDirectives } from '@graphql-tools/utils';
import * as cv from 'class-validator';
import { GraphQLSchema, lexicographicSortSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';

import SampleResolver from './resolvers/SampleResolver';

// https://github.com/typestack/class-validator#using-service-container
cv.useContainer(Container);
Container.set(cv.Validator, new cv.Validator());

export default function schemaFactory() {
  return buildSchema({
    resolvers: [SampleResolver],
    orphanedTypes: [User],
    dateScalarMode: 'isoDate',
    container: Container,
  });
}

export async function writeSchemaFile() {
  await writeSchemaWithDirectives(
    resolve(process.cwd(), './gql_generated/schema.gql'),
    await schemaFactory(),
  );
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
