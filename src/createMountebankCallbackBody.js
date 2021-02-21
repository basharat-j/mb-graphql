export default ({
  operationType,
  pathKey,
  args,
}) => ({
  request: {
    [`${operationType.toLowerCase()}`]: pathKey,
    args,
  },
});
