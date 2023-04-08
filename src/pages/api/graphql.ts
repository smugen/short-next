import schemaFactory, { context } from '@/graphql';
import type { ServerContext, UserContext } from '@/graphql';
import { createYoga } from 'graphql-yoga';

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};

export default createYoga<ServerContext, UserContext>({
  schema: schemaFactory(),
  context,

  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',

  // graphiql: {
  //   credentials: 'same-origin',
  // },
});
