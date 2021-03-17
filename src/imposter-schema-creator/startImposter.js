import { ApolloServer } from 'apollo-server';

import createContext from './createContext';
import createImposterSchema from './createImposterSchema';
import logger from '../utils/logger';
import randomString from '../mock-generator/randomString';

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
    mocks: { String: () => randomString() },
    mockEntireSchema: false,
    context: createContext,
    debug: false,
  });
  const { url } = await server.listen({ port });
  logger({
    message: `GraphQL server ready at ${url}`,
  });
};
