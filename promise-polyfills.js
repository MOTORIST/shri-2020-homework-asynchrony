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
