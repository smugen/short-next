import { writeSchemaFile } from '@/graphql';
import { generate } from '@graphql-codegen/cli';
import { Head, Html, Main, NextScript } from 'next/document';

import config from '../../codegen';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

(async function setup() {
  await writeSchemaFile();
  await generate(config, true);
})();
