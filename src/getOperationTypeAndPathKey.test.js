import getOperationTypeAndPathKey from './getOperationTypeAndPathKey';

describe('getOperationTypeAndPathKey', () => {
  it('should get operation type and path key with path having no previous path', () => {
    const path = {
      typename: 'MyType',
      key: 'myKey',
    };
    const expected = {
      operationType: 'MyType',
      pathKey: 'myKey',
    };

    const result = getOperationTypeAndPathKey(path);
    expect(result).toEqual(expected);
  });

  it('should get operation type and path key with path having single previous path', () => {
    const path = {
      typename: 'MyType',
      key: 'myKey',
      prev: {
        typename: 'MyParentType',
        key: 'myParentKey',
      },
    };
    const expected = {
      operationType: 'MyParentType',
      pathKey: 'myParentKey.myKey',
    };

    const result = getOperationTypeAndPathKey(path);
    expect(result).toEqual(expected);
  });

  it('should get operation type and path key with path having multiple previous paths', () => {
    const path = {
      typename: 'MyType',
      key: 'myKey',
      prev: {
        typename: 'MyParentType',
        key: 'myParentKey',
        prev: {
          typename: 'MyGrantParentType',
          key: 'myGrandParentKey',
        },
      },
    };
    const expected = {
      operationType: 'MyGrantParentType',
      pathKey: 'myGrandParentKey.myParentKey.myKey',
    };

    const result = getOperationTypeAndPathKey(path);
    expect(result).toEqual(expected);
  });

  it('should get operation type and path key with path having previous path with no type name', () => {
    const path = {
      typename: 'MyType',
      key: 'myKey',
      prev: {
        key: 'myParentKey',
        prev: {
          typename: 'MyGrantParentType',
          key: 'myGrandParentKey',
        },
      },
    };
    const expected = {
      operationType: 'MyGrantParentType',
      pathKey: 'myGrandParentKey.myKey',
    };

    const result = getOperationTypeAndPathKey(path);
    expect(result).toEqual(expected);
  });
});
