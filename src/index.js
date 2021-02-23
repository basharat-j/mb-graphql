#!/usr/bin/env node

import 'regenerator-runtime/runtime';
import 'core-js/stable';

import startImposter from './startImposter';
import config from './config';
import logger from './logger';

startImposter({
  schema: config.schema,
  schemaEndpoint: config.schemaEndpoint,
  schemaEndpointHeaders: config.schemaEndpointHeaders,
  port: config.port,
})
  .catch((error) => {
    logger({
      message: 'Error starting imposter',
      config,
      error,
    });
  });
