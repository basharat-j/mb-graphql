import { Then, When } from '@cucumber/cucumber';
import fetch from 'node-fetch';
import expect from 'expect';

import logger from '../logger';
import world from '../world/world';

const performGraphQLQuery = async (query) => {
  logger(`GraphQL Query:\n${query}`);
  const body = JSON.stringify({
    query,
  });
  const response = await fetch(`http://localhost:${world.imposterPort}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  const graphQLResponse = await response.json();
  logger(`GraphQL Response:\n${JSON.stringify(graphQLResponse, null, 2)}`);
  return graphQLResponse;
};

When('{} attempts to execute the following GraphQL query:', async (user, query) => {
  world.response = await performGraphQLQuery(query);
});

When('{} attempts to execute the following GraphQL operations:', async (user, operations) => {
  const operationArr = operations.split(/# Operation \d/);
  await Promise.all(operationArr.slice(1)
    .map((operation) => performGraphQLQuery(operation)));
});

Then('the query will be successful and the response will be:', (result) => {
  expect(JSON.parse(result))
    .toEqual(world.response);
});

const getValueFromJsonPath = (obj, jsonPathParts) => {
  if (jsonPathParts.length === 0) {
    return obj;
  }
  const firstPartOfPath = (obj || {})[jsonPathParts[0]];
  return getValueFromJsonPath(firstPartOfPath, jsonPathParts.slice(1));
};

Then('the query will be successful and the response will match:', (dataTable) => {
  const responseProperties = dataTable.rows();
  responseProperties.forEach((responseProperty) => {
    const PropertyConstructor = responseProperty[1] === 'Int'
      ? Number
      : String;
    const valueFromJsonPath = getValueFromJsonPath(world.response, responseProperty[0].split('.'));
    expect(valueFromJsonPath)
      .toEqual(expect.any(PropertyConstructor));
    if (responseProperty[2]) {
      if (PropertyConstructor === Number) {
        expect(valueFromJsonPath)
          .toEqual(parseInt(responseProperty[2], 10));
      } else {
        expect(valueFromJsonPath)
          .toEqual(responseProperty[2]);
      }
    }
  });
});
