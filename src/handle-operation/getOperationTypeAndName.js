import getPathElements from './getPathElements';

export default (path) => {
  const pathElements = getPathElements(path);
  const operationType = pathElements[0].typename;
  return {
    operationType,
    operationName: pathElements[0].key,
  };
};
