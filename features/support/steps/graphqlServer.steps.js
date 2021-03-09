import { Given } from '@cucumber/cucumber';
import { ApolloServer, AuthenticationError } from 'apollo-server';

import world from '../world/world';

const createGraphQLServer = async ({
  endpoint,
  schema,
  bearerToken,
}) => {
  const url = new URL(endpoint);
  const { port } = url;
  const server = new ApolloServer({
    typeDefs: schema,
    mocks: true,
    context: ({ req }) => {
      const { headers } = req || {};
      const { authorization } = headers || {};
      const authorizationParts = (authorization || '').split(' ');
      if ((authorizationParts[0] || '').toLowerCase() !== 'bearer' && authorizationParts[1] !== bearerToken) {
        throw new AuthenticationError('Unauthorized');
      }
    },
  });

  await server.listen({ port });
  world.stoppableServers[port] = server;
};

Given('a GraphQL server exists at {string} with the following schema definition:', async (endpoint, schema) => {
  await createGraphQLServer({
    endpoint,
    schema,
  });
});

Given('a secure GraphQL server requiring the {string} bearer token exists at {string} with the following schema definition:', async (bearerToken, endpoint, schema) => {
  await createGraphQLServer({
    endpoint,
    schema,
    bearerToken,
  });
});
