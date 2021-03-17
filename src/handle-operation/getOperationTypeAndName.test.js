import getOperationTypeAndName from './getOperationTypeAndName';

describe('getOperationTypeAndName', () => {
  it('should get operation type and name with path having no previous path', () => {
    const path = {
      typename: 'MyType',
      key: 'myKey',
    };
    const expected = {
      operationType: 'MyType',
      operationName: 'myKey',
    };

    const result = getOperationTypeAndName(path);
    expect(result)
      .toEqual(expected);
  });
});
