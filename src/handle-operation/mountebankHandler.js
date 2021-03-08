import isEmptyObject from '../utils/isEmptyObject';
import getOperationTypeAndPathKey from './getOperationTypeAndPathKey';
import getProxiedResponse from '../schema-proxy/getProxiedResponse';
import getMountebankStubResponse from '../mountebank-adapter/getMountebankStubResponse';

export default async (resolve, root, args, context, info) => {
  if (root && !isEmptyObject(root)) {
    return undefined;
  }
  const {
    operationType,
    pathKey,
  } = getOperationTypeAndPathKey(info.path);

  const topLevelOperation = !info.path.prev;
  const {
    response,
    proxy,
  } = await getMountebankStubResponse({
    operationType,
    pathKey,
    args,
    headers: context.headers,
    topLevelOperation,
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
