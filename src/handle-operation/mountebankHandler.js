import invokeMountebankCallback from '../mountebank-adapter/invokeMountebankCallback';
import isEmptyObject from '../utils/isEmptyObject';
import getOperationTypeAndPathKey from './getOperationTypeAndPathKey';

export default async (resolve, root, args, context, info) => {
  if (root && !isEmptyObject(root)) {
    return undefined;
  }
  const {
    operationType,
    pathKey,
  } = getOperationTypeAndPathKey(info.path);

  const {
    data,
    error,
  } = await invokeMountebankCallback({
    operationType,
    pathKey,
    args,
    headers: context.headers,
  });
  if (error) {
    throw new Error(error);
  }
  if (data !== undefined) {
    return data;
  }
  return undefined;
};
