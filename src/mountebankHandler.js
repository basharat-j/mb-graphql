import invokeMountebankCallback from './invokeMountebankCallback';
import isEmptyObject from './isEmptyObject';
import getOperationTypeAndPathKey from './getOperationTypeAndPathKey';

export default async (resolve, root, args, context, info) => {
  if (root && !isEmptyObject(root)) {
    return undefined;
  }
  const { operationType, pathKey } = getOperationTypeAndPathKey(info.path);

  const mountebankResponse = await invokeMountebankCallback({
    operationType,
    pathKey,
    args,
  });

  const resolvedResult = isEmptyObject(mountebankResponse)
    ? undefined
    : mountebankResponse;
  return resolvedResult;
};
