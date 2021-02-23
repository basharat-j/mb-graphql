import fetch from 'node-fetch';

import createMountebankCallbackBody from './createMountebankCallbackBody';
import config from './config';
import logger from './logger';

export default async ({
  operationType,
  pathKey,
  args,
  headers,
  mountebankCallbackURL = config.mountebankCallbackURL,
}) => {
  const mountebankCallbackBody = createMountebankCallbackBody({
    operationType,
    pathKey,
    args,
    headers,
  });
  const mountebankResult = await fetch(mountebankCallbackURL, {
    method: 'post',
    body: JSON.stringify(mountebankCallbackBody),
    headers: { 'Content-Type': 'application/json' },
  });
  const mountebankResponse = await mountebankResult.json();
  return mountebankResponse.response || {};
};
