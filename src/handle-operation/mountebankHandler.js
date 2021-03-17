import isEmptyObject from '../utils/isEmptyObject';
import getOperationTypeAndName from './getOperationTypeAndName';
import getMountebankStubResponse from '../mountebank-adapter/getMountebankStubResponse';
import getProxiedResponse from '../schema-proxy/getProxiedResponse';

export default async (resolve, root, args, context, info) => {
  const topLevelOperation = !info.path.prev;
  if (!topLevelOperation || (root && !isEmptyObject(root))) {
    return undefined;
  }

  const {
    operationType,
    operationName,
  } = getOperationTypeAndName(info.path);

  const {
    response,
    proxy,
  } = await getMountebankStubResponse({
    operationType,
    operationName,
    args,
    headers: context.headers,
  });
  if (proxy) {
    const { to } = proxy;
    const proxiedResponse = await getProxiedResponse({
      endpoint: to,
      operationType,
      args,
      context,
      info,
    });
    return proxiedResponse;
  }
  if (response) {
    const {
      error,
      data,
    } = response;
    if (error) {
      throw new Error(error);
    }
    if (data !== undefined) {
      return data;
    }
  }
  return undefined;
};
