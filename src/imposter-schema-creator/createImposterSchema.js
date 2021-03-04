import { applyMiddleware } from 'graphql-middleware';

import mountebankHandler from '../handle-operation/mountebankHandler';
import loadSchema from './loadSchema';

export default async ({
  schema,
  schemaEndpoint,
  schemaEndpointHeaders = {},
}) => {
  const imposterSchema = await loadSchema({
    schema,
    schemaEndpoint,
    schemaEndpointHeaders,
  });

  return applyMiddleware(imposterSchema, mountebankHandler);
};
