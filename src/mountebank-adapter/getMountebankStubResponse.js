import invokeMountebankCallback from './invokeMountebankCallback';
import isEmptyObject from '../utils/isEmptyObject';
import getDefaultResponse from './getDefaultResponse';

export default async ({
  operationType,
  pathKey,
  args,
  headers,
  topLevelOperation,
}) => {
  const stubResponse = await invokeMountebankCallback({
    operationType,
    pathKey,
    args,
    headers,
  });
  const {
    response,
    proxy,
  } = stubResponse || {};
  if (topLevelOperation && isEmptyObject(response) && !proxy) {
    return getDefaultResponse();
  }
  return {
    response,
    proxy,
  };
};
