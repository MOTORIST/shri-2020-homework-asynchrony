require("./promise-polyfills");

describe("Promise _any", () => {
  it("should throw error, if argument is not iterable", () => {
    const result = () => Promise._any(123);

    expect(result).toThrowError(/iterable/);
  });

  it("should return empty array, if argument empty array", () => {
    const result = Promise._any([]);

    return expect(result).resolves.toEqual([]);
  });

  it("should return first resolved promise, if it is", () => {
    const iterable = [
      Promise.reject(new Error()),
      Promise.resolve(1),
      Promise.resolve(2),
    ];

    const result = Promise._any(iterable);

    return expect(result).resolves.toBe(1);
  });

  it("should return array errors, if all promises rejected", () => {
    const errors = [new Error(1), new Error(2), new Error(3)];
    const iterable = errors.map((e) => Promise.reject(e));

    const result = Promise._any(iterable);

    return expect(result).rejects.toEqual(errors);
  });

  it("should work with primitive values", () => {
    const result = Promise._any([1, 2, 3]);

    return expect(result).resolves.toBe(1);
  });
});

describe("Promise _anyV2FromAll", () => {
  it("should throw error, if argument is not iterable", () => {
    const result = () => Promise._anyV2FromAll(123);

    expect(result).toThrowError(/iterable/);
  });

  it("should return empty array, if argument empty array", () => {
    const result = Promise._anyV2FromAll([]);

    return expect(result).resolves.toEqual([]);
  });

  it("should return first resolved promise, if it is", () => {
    const iterable = [
      Promise.reject(new Error()),
      Promise.resolve(1),
      Promise.resolve(2),
    ];

    const result = Promise._anyV2FromAll(iterable);

    return expect(result).resolves.toBe(1);
  });

  it("should return array errors, if all promises rejected", () => {
    const errors = [new Error(1), new Error(2), new Error(3)];
    const iterable = errors.map((e) => Promise.reject(e));

    const result = Promise._anyV2FromAll(iterable);

    return expect(result).rejects.toEqual(errors);
  });

  it("should work with primitive values", () => {
    const result = Promise._anyV2FromAll([1, 2, 3]);

    return expect(result).resolves.toBe(1);
  });
});
