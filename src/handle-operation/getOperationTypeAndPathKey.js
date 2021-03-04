import getPathElements from './getPathElements';

export default (path) => {
  const pathElements = getPathElements(path);
  const operationType = pathElements[0].typename;
  const pathKey = pathElements
    .filter(({ typename }) => !!typename)
    .map(({ key }) => key)
    .join('.');
  return {
    operationType,
    pathKey,
  };
};
