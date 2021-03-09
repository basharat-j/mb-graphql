import { Given } from '@cucumber/cucumber';
import fetch from 'node-fetch';

import world from '../world/world';

const createImposter = async ({
  port,
  schema,
  schemaEndpoint,
  schemaEndpointHeaders,
}) => {
  await fetch(`http://localhost:${world.mountebankPort}/imposters`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      port,
      protocol: 'graphql',
      schema,
      schemaEndpoint,
      schemaEndpointHeaders,
    }),
  });
  world.imposterPort = port;
};

Given('a GraphQL imposter exists on port {int} configured with the {string} schema endpoint', async (port, schemaEndpoint) => {
  await createImposter({
    port,
    schemaEndpoint,
  });
});

Given('a GraphQL imposter exists on port {int} configured with the {string} schema endpoint and the following schema endpoint headers:', async (port, schemaEndpoint, dataTable) => {
  const schemaEndpointHeaders = dataTable.rowsHash();
  await createImposter({
    port,
    schemaEndpoint,
    schemaEndpointHeaders,
  });
});

Given('a GraphQL imposter exists on port {int} with the following inline schema definition:', async (port, schema) => {
  await createImposter({
    port,
    schema,
  });
});

const replaceImposterStubs = async () => {
  const stub = {};
  if (world.predicates) {
    stub.predicates = world.predicates;
  }
  if (world.responses) {
    stub.responses = world.responses;
  }
  const stubs = stub.responses.length > 0
    ? [stub]
    : [];

  await fetch(`http://localhost:${world.mountebankPort}/imposters/${world.imposterPort}/stubs`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      {
        stubs,
      },
    ),
  });
};

Given('the imposter\'s single stub has the following predicates:', async (predicates) => {
  world.predicates = JSON.parse(predicates);
  await replaceImposterStubs();
});

Given('the imposter\'s single stub has the following responses:', async (responses) => {
  world.responses = JSON.parse(responses);
  await replaceImposterStubs();
});
