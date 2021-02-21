import { ApolloServer } from 'apollo-server';

import createImposterSchema from './createImposterSchema';
import logger from './logger';

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
  });
  const { url } = await server.listen({ port });
  logger(`info GraphQL server ready at ${url}`);
};
