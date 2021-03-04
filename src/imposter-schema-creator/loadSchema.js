import { loadSchema } from '@graphql-tools/load';
import { UrlLoader } from '@graphql-tools/url-loader';

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
    return loadedSchema;
  } catch (error) {
    throw new Error(`Could not load schema: ${schemaToLoad}\n${error.message}`);
  }
};
