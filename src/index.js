#!/usr/bin/env node

import 'regenerator-runtime/runtime';
import 'core-js/stable';

import startImposter from './startImposter';
import config from './config';

startImposter({
  schema: config.schema,
  schemaEndpoint: config.schemaEndpoint,
  schemaEndpointHeaders: config.schemaEndpointHeaders,
  port: config.port,
});
