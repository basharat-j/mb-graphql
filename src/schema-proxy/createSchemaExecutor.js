import { print } from 'graphql';
import fetch from 'node-fetch';

export default ({ endpoint }) => async ({
  document,
  variables,
}) => {
  const query = print(document);
  const fetchResult = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  return fetchResult.json();
};
