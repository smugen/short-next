import 'reflect-metadata';

import { writeSchemaFile } from '@/graphql';
import { generate } from '@graphql-codegen/cli';

import config from './codegen';

module.exports = async function setup() {
  await writeSchemaFile();
  await generate(config, true);
};
