import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'gql_generated/schema.gql',
  documents: ['src/**/*.ts', '__tests__/**/*.test.ts'],
  generates: {
    'gql_generated/': {
      preset: 'client-preset',
    },
  },
};

export default config;
