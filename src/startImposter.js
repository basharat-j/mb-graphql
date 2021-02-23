import { ApolloServer } from 'apollo-server';

import createImposterSchema from './createImposterSchema';
import logger from './logger';
import createContext from './createContext';

export default async ({
  schema,
  schemaEndpoint,
  schemaEndpointHeaders,
  port,
}) => {
  const imposterSchema = await createImposterSchema({
    schema,
    schemaEndpoint,
    schemaEndpointHeaders,
  });
  const server = new ApolloServer({
    schema: imposterSchema,
    mocks: true,
    mockEntireSchema: false,
    context: createContext,
    debug: false,
  });
  const { url } = await server.listen({ port });
  logger({
    message: `GraphQL server ready at ${url}`,
  });
};
