import fetch from 'node-fetch';

import createMountebankCallbackBody from './createMountebankCallbackBody';
import config from '../utils/config';

export default async ({
  operationType,
  operationName,
  args,
  headers,
  mountebankCallbackURL = config.mountebankCallbackURL,
}) => {
  const mountebankCallbackBody = createMountebankCallbackBody({
    operationType,
    operationName,
    args,
    headers,
  });
  const mountebankResult = await fetch(mountebankCallbackURL, {
    method: 'post',
    body: JSON.stringify(mountebankCallbackBody),
    headers: { 'Content-Type': 'application/json' },
  });
  return mountebankResult.json();
};
