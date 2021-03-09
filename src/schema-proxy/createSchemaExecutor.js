import { print } from 'graphql';
import fetch from 'node-fetch';

export default ({ endpoint }) => async ({
  document,
  variables,
  context,
}) => {
  const query = print(document);
  const {
    host,
    ...headers
  } = context.headers || {};
  const fetchResult = await fetch(endpoint, {
    method: 'post',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  return fetchResult.json();
};
