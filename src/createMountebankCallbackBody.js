export default ({ operationType, pathKey, args }) => ({
  request: {
    [`${operationType}`]: pathKey,
    args,
  },
});
