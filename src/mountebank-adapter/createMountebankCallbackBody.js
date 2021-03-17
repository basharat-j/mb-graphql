export default ({
  operationType,
  operationName,
  args,
  headers,
}) => ({
  request: {
    [`${operationType.toLowerCase()}`]: operationName,
    args,
    headers,
  },
});
