export default ({
  operationType,
  pathKey,
  args,
  headers,
}) => ({
  request: {
    [`${operationType.toLowerCase()}`]: pathKey,
    args,
    headers,
  },
});
