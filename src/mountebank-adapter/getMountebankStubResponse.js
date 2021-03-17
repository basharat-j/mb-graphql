import invokeMountebankCallback from './invokeMountebankCallback';
import isEmptyObject from '../utils/isEmptyObject';
import getDefaultResponse from './getDefaultResponse';

export default async ({
  operationType,
  operationName,
  args,
  headers,
}) => {
  const stubResponse = await invokeMountebankCallback({
    operationType,
    operationName,
    args,
    headers,
  });
  const {
    response,
    proxy,
  } = stubResponse || {};
  if (isEmptyObject(response) && !proxy) {
    return getDefaultResponse();
  }
  return {
    response,
    proxy,
  };
};
