Promise._any = function (iterable) {
  const errors = [];

  if (!Array.isArray(iterable)) {
    throw new Error(`${iterable} - must be iterable`);
  }

  if (iterable.length === 0) {
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {
    iterable.forEach((v) => {
      Promise.resolve(v)
        .then((res) => resolve(res))
        .catch((err) => {
          if (errors.push(err) === iterable.length) {
            reject(errors);
          }
        });
    });
  });
};

Promise._anyV2FromAll = function (iterable) {
  if (!Array.isArray(iterable)) {
    throw new Error(`${iterable} - must be iterable`);
  }

  if (iterable.length === 0) return Promise.resolve([]);

  const reversPromises = iterable.map((v) => {
    return new Promise((resolve, reject) =>
      Promise.resolve(v).then(reject, resolve)
    );
  });

  return Promise.all(reversPromises).then(
    (errors) => Promise.reject(errors),
    (result) => Promise.resolve(result)
  );
};

Promise._allSettled = function (iterable) {
  const results = [];

  const isIterable = (obj) =>
    obj !== undefined &&
    obj !== null &&
    typeof obj[Symbol.iterator] === "function";

  if (!isIterable(iterable)) {
    throw new Error(`${typeof iterable} ${iterable} is not iterable`);
  }

  if (iterable.length === 0) {
    return Promise.resolve([]);
  }

  return new Promise((resolve) => {
    iterable.forEach((v) => {
      Promise.resolve(v)
        .then((res) => {
          const fulfilledObj = { status: "fulfilled", value: res };

          if (results.push(fulfilledObj) === iterable.length) {
            resolve(results);
          }
        })
        .catch((err) => {
          const rejectedObj = { status: "rejected", reason: err };

          if (results.push(rejectedObj) === iterable.length) {
            resolve(results);
          }
        });
    });
  });
};

Promise.prototype._finally = function (callback) {
  const callbackIsFunction = typeof callback === "function";

  return new Promise((resolve, reject) => {
    this.then((res) => {
      callbackIsFunction && callback();
      resolve(res);
    }).catch((err) => {
      callbackIsFunction && callback();
      reject(err);
    });
  });
};
