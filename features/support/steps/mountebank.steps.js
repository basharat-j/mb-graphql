import { Given, Then } from '@cucumber/cucumber';
import fetch from 'node-fetch';
import expect from 'expect';

import world from '../world/world';

const createImposter = async ({
  port,
  schema,
  schemaEndpoint,
  schemaEndpointHeaders,
  recordRequests,
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
      recordRequests,
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

Given('a GraphQL imposter exists on port {int} configured with the {string} schema endpoint with request recording enabled', async (port, schemaEndpoint) => {
  await createImposter({
    port,
    schemaEndpoint,
    recordRequests: true,
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

Then('the following requests will be saved for the imposter:', async (dataTable) => {
  const dataRows = dataTable.rows();
  const result = await fetch(`http://localhost:${world.mountebankPort}/imposters/${world.imposterPort}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const imposterResponse = await result.json();
  const { requests } = imposterResponse;
  expect(requests.length)
    .toBe(dataRows.length);
  dataRows.forEach((dataRow, index) => {
    const operationType = dataRow[0].toLowerCase();
    const operationName = dataRow[1];
    const args = dataRow[2];
    const headers = dataRow[3];
    if (operationName) {
      expect(requests[index][operationType])
        .toEqual(operationName);
    }
    if (args) {
      expect(requests[index].args)
        .toEqual(JSON.parse(args));
    }
    if (headers) {
      const headerObject = JSON.parse(headers);
      const headerKeys = Object.keys(headerObject);
      headerKeys.forEach((headerKey) => {
        expect(requests[index].headers[headerKey])
          .toEqual(headerObject[headerKey]);
      });
    }
  });
});
