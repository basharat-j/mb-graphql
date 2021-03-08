#!/usr/bin/env node

import startImposter from './imposter-schema-creator/startImposter';
import logger from './utils/logger';
import config from './utils/config';

startImposter({
  schema: config.schema,
  schemaEndpoint: config.schemaEndpoint,
  schemaEndpointHeaders: config.schemaEndpointHeaders,
  port: config.port,
})
  .catch((error) => {
    logger({
      level: 'error',
      message: 'Error starting imposter',
      error,
    });
    process.exit(1);
  });
