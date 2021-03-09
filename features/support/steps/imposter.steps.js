import { Then, When } from '@cucumber/cucumber';
import fetch from 'node-fetch';
import expect from 'expect';

import world from '../world/world';

When('{} attempts to execute the following GraphQL query:', async (user, query) => {
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
  const jsonResponse = await response.json();
  world.response = jsonResponse;
});

Then('the query will be successful and the response will be:', (result) => {
  expect(JSON.parse(result))
    .toEqual(world.response);
});

const getValueFromJsonPath = (obj, jsonPathParts) => {
  if (jsonPathParts.length === 0) {
    return obj;
  }
  const firstPartOfPath = obj[jsonPathParts[0]];
  return getValueFromJsonPath(firstPartOfPath, jsonPathParts.slice(1));
};

Then('the query will be successful and the response will match:', (dataTable) => {
  const responseProperties = dataTable.rows();
  responseProperties.forEach((responseProperty) => {
    const propertyType = responseProperty[1] === 'Number'
      ? Number
      : String;
    const valueFromJsonPath = getValueFromJsonPath(world.response, responseProperty[0].split('.'));
    expect(valueFromJsonPath)
      .toEqual(expect.any(propertyType));
  });
});
