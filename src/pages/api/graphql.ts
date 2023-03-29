import schemaFactory from '@/graphql';
import type { ServerContext, UserContext } from '@/graphql';
import UserService from '@/services/UserService';
import { createYoga } from 'graphql-yoga';
import Container from 'typedi';

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};

export default createYoga<ServerContext, UserContext>({
  schema: schemaFactory(),
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',

  async context({ req }) {
    const userService = Container.get(UserService);
    const user = await userService.authenticate(req);
    return { user };
  },

  // graphiql: {
  //   credentials: 'same-origin',
  // },
});
