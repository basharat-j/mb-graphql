import { Given, Then } from '@cucumber/cucumber';
import { ApolloServer, AuthenticationError } from 'apollo-server';
import expect from 'expect';

import http from 'http';
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
      if (req && req.body && req.body.query && req.body.query.indexOf('IntrospectionQuery') === -1) {
        world.requests[port] = (world.requests[port] || 0) + 1;
      }
    },
  });

  world.servers[port] = server;
  await server.listen({ port });
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

Given('a GraphQL server exists at {string} which returns the following result for the {string} query:', async (endpoint, queryName, result) => {
  const url = new URL(endpoint);
  const port = url.port
    ? parseInt(url.port, 10)
    : 80;
  const server = http.createServer((request, response) => {
    const requestBodyChunks = [];
    request.on('data', (chunk) => {
      requestBodyChunks.push(chunk);
    });
    request.on('end', () => {
      const requestBody = requestBodyChunks.join('');
      const { query } = JSON.parse(requestBody);
      if (request.method === 'POST' && query.indexOf(queryName) > -1) {
        response.writeHead(200);
        response.end(result);
      } else {
        response.writeHead(400);
      }
    });
  });
  world.servers[port] = server;
  await server.listen(port, url.hostname);
});

Then('the GraphQL server at {string} will have not received any requests', (endpoint) => {
  const url = new URL(endpoint);
  const { port } = url;
  expect(world.requests[port])
    .toBeFalsy();
});
