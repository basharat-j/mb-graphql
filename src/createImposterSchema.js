import { loadSchema } from '@graphql-tools/load';
import { UrlLoader } from '@graphql-tools/url-loader';
import { applyMiddleware } from 'graphql-middleware';

import mountebankHandler from './mountebankHandler';

export default async ({
  schema,
  schemaEndpoint,
  schemaEndpointHeaders = {},
}) => {
  const imposterSchema = !schemaEndpoint
    ? await loadSchema(schema)
    : await loadSchema(schemaEndpoint, {
      loaders: [new UrlLoader()],
      headers: schemaEndpointHeaders,
    });

  return applyMiddleware(imposterSchema, mountebankHandler);
};
