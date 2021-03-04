import isEmptyObject from './isEmptyObject';

describe('isEmptyObject', () => {
  it('should be true if object has no properties', () => {
    const result = isEmptyObject({});

    expect(result)
      .toBeTruthy();
  });

  it('should be false if object has properties undefined', () => {
    const result = isEmptyObject({ abc: 123 });

    expect(result)
      .toBeFalsy();
  });

  it('should be false if object is undefined', () => {
    const result = isEmptyObject(undefined);

    expect(result)
      .toBeFalsy();
  });

  it('should be false if object is null', () => {
    const result = isEmptyObject(null);

    expect(result)
      .toBeFalsy();
  });

  it('should be false if object is number', () => {
    const result = isEmptyObject(123);

    expect(result)
      .toBeFalsy();
  });

  it('should be false if object is string', () => {
    const result = isEmptyObject('abc');

    expect(result)
      .toBeFalsy();
  });

  it('should be false if object is array', () => {
    const result = isEmptyObject([123, 'abc']);

    expect(result)
      .toBeFalsy();
  });
});
