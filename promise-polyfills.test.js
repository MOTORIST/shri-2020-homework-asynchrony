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

describe("Promise _allSettled", () => {
  it("should return all results", () => {
    const expected = [
      { status: "fulfilled", value: 1 },
      { status: "rejected", reason: new Error(2) },
      { status: "fulfilled", value: 3 },
    ];

    const iterable = expected.map((v) =>
      v.status === "fulfilled"
        ? Promise.resolve(v.value)
        : Promise.reject(v.reason)
    );

    const result = Promise._allSettled(iterable);

    return expect(result).resolves.toEqual(expect.arrayContaining(expected));
  });

  it("should throw error, if argument is not iterable", () => {
    const result = () => Promise._allSettled({ id: 1 });

    expect(result).toThrowError(/iterable/);
  });

  it("should return empty array, if argument empty array", () => {
    const result = Promise._allSettled([]);

    return expect(result).resolves.toEqual([]);
  });

  it("should work with primitive values", () => {
    const values = [1, "2", false];
    const expected = values.map((value) => ({ status: "fulfilled", value }));

    const result = Promise._allSettled(values);

    return expect(result).resolves.toEqual(expected);
  });
});

describe("Promise _finally", () => {
  it("should call, if promise resolved", async () => {
    const callback = jest.fn();

    await Promise.resolve(1)._finally(callback);

    expect(callback.mock.calls.length).toBe(1);
  });

  it("should call, if promise rejected", async () => {
    const callback = jest.fn();

    try {
      await Promise.reject(new Error())._finally(callback);
    } catch (err) {}

    expect(callback.mock.calls.length).toBe(1);
  });
});
