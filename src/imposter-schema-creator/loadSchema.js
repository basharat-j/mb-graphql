import { UrlLoader } from '@graphql-tools/url-loader';
import { loadSchema } from '@graphql-tools/load';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { printSchema } from 'graphql/utilities';
import setCurrentSchema from '../schema-cache/setCurrentSchema';

export default async ({
  schema,
  schemaEndpoint,
  schemaEndpointHeaders,
}) => {
  const schemaToLoad = schema || schemaEndpoint;
  const schemaOptions = schema
    ? undefined
    : {
      loaders: [new UrlLoader()],
      headers: schemaEndpointHeaders,
    };
  try {
    const loadedSchema = await loadSchema(schemaToLoad, schemaOptions);
    const nonExecutableSchema = makeExecutableSchema({
      typeDefs: printSchema(loadedSchema),
    });
    setCurrentSchema({ schema: nonExecutableSchema });
    return nonExecutableSchema;
  } catch (error) {
    throw new Error(`Could not load schema: ${schemaToLoad}\n${error.message}`);
  }
};
