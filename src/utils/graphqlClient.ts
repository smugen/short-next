import { Client, cacheExchange, fetchExchange } from 'urql';

const client = new Client({
  url: '/api/graphql',
  exchanges: [cacheExchange, fetchExchange],
  requestPolicy: 'cache-and-network',
  fetchOptions: () => ({
    credentials: 'same-origin',
  }),
});

export default client;
