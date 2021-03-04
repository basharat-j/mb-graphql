import getPathElements from './getPathElements';

describe('getPathElements', () => {
  it('should get path elements with path having no previous path', () => {
    const path = {
      typename: 'MyType',
      key: 'myKey',
    };
    const expected = [
      {
        typename: 'MyType',
        key: 'myKey',
      },
    ];

    const result = getPathElements(path);
    expect(result)
      .toEqual(expected);
  });

  it('should get path elements with path having single previous path', () => {
    const path = {
      typename: 'MyType',
      key: 'myKey',
      prev: {
        typename: 'MyParentType',
        key: 'myParentKey',
      },
    };
    const expected = [
      {
        typename: 'MyParentType',
        key: 'myParentKey',
      },
      {
        typename: 'MyType',
        key: 'myKey',
      },
    ];

    const result = getPathElements(path);
    expect(result)
      .toEqual(expected);
  });

  it('should get path elements with path having multiple previous path with no type', () => {
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
    const expected = [
      {
        typename: 'MyGrantParentType',
        key: 'myGrandParentKey',
      },
      {
        key: 'myParentKey',
      },
      {
        typename: 'MyType',
        key: 'myKey',
      },
    ];

    const result = getPathElements(path);
    expect(result)
      .toEqual(expected);
  });
});
