const {
  AsyncArray,
  add,
  subtract,
  multiply,
  divide,
  mod,
  less,
  equal,
  lessOrEqual,
  sqrt,
} = Homework;

const promisify = (fn) => (...args) =>
  new Promise((resolve) => {
    args.push((result) => resolve(result));
    fn(...args);
  });

const modPromisify = promisify(mod);
const addPromisify = promisify(add);
const lessPromisify = promisify(less);
const equalPromisify = promisify(equal);
const dividePromisify = promisify(divide);
const subtractPromisify = promisify(subtract);
const multiplyPromisify = promisify(multiply);
const sqrtPromisify = promisify(sqrt);

const promisifyAsyncArrayObj = (asyncArrayObj) => {
  const obj = Object.create(asyncArrayObj);

  Object.getOwnPropertyNames(asyncArrayObj).reduce((acc, methodName) => {
    acc[methodName] = promisify(asyncArrayObj[methodName]);
    return acc;
  }, obj);

  obj[Symbol.asyncIterator] = function () {
    return {
      currentIndex: 0,
      asyncArray: this,
      len: null,
      async next() {
        this.len = this.len || (await this.asyncArray.length());

        if (await equalPromisify(this.currentIndex, this.len)) {
          return { done: true };
        }

        const value = await this.asyncArray.get(this.currentIndex);
        this.currentIndex = await addPromisify(this.currentIndex, 1);

        return { done: false, value };
      },
    };
  };

  return obj;
};

/**
 * Task 1 (with out async iterator)
 * @param {AsyncArray} array
 * @callback cb
 */
async function maxFromArray(array, cb) {
  let max = 0;
  const promisifyArray = promisifyAsyncArrayObj(array);
  const len = await promisifyArray.length();
  let i = 0;

  while (await lessPromisify(i, len)) {
    const val = await promisifyArray.get(i);
    i = await addPromisify(i, 1);
    const isMax = await lessPromisify(max, val);
    if (isMax) max = val;
  }

  cb(max);

  return Promise.resolve(max);
}

/**
 * Task 1 (with async iterator)
 * @param {AsyncArray} array
 * @callback cb
 */
async function maxFromArray2(array, cb) {
  let max = 0;
  const promisifyArray = promisifyAsyncArrayObj(array);

  for await (let v of promisifyArray) {
    const isMax = await lessPromisify(max, v);
    if (isMax) max = v;
  }

  cb(max);
}

/**
 * Task 2
 * @param {AsyncArray} array
 * @callback cb
 */
async function average(array, cb) {
  let sum = 0;
  const promisifyArray = promisifyAsyncArrayObj(array);
  const len = await promisifyArray.length();
  let i = 0;

  while (await lessPromisify(i, len)) {
    const val = await promisifyArray.get(i);
    sum = await addPromisify(sum, val);
    i = await addPromisify(i, 1);
  }

  const result = await dividePromisify(sum, len);

  cb(result);
}

/**
 * Task 3
 * @param {...AsyncArray} v1, v2, v3, ...
 * @callback callback
 */
async function sumVectors(...args) {
  const result = promisifyAsyncArrayObj(new AsyncArray());
  const callback = args[await subtractPromisify(args.length, 1)];

  const hasCallback =
    callback && (await equalPromisify(typeof callback, "function"));

  const vectorsData = hasCallback ? args.slice(0, -1) : args;

  const vectorsDataPromisify = vectorsData.map((v) =>
    promisifyAsyncArrayObj(v)
  );

  const vectorSize = await vectorsDataPromisify[0].length();

  let i = 0;
  while (await lessPromisify(i, vectorSize)) {
    let sumCoordinates = 0;

    for (let vectorData of vectorsDataPromisify) {
      const val = await vectorData.get(i);
      sumCoordinates = await addPromisify(sumCoordinates, val);
    }

    await result.push(sumCoordinates);
    i = await addPromisify(i, 1);
  }

  callback(result);
}

/**
 * Task 4
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @callback cb
 */
async function areaTriangle(x1, y1, x2, y2, x3, y3, cb) {
  // const s = ((x2 - x1)(y3 - y1) - (x3 - x1)(y2 - y1)) / 2;

  const [res1, res2, res3, res4] = await Promise.all([
    subtractPromisify(x2, x1),
    subtractPromisify(y3, y1),
    subtractPromisify(x3, x1),
    subtractPromisify(y2, y1),
  ]);

  const [res5, res6] = await Promise.all([
    multiplyPromisify(res1, res2),
    multiplyPromisify(res3, res4),
  ]);

  const res7 = await subtractPromisify(res5, res6);
  const res8 = await dividePromisify(res7, 2);

  if (await lessPromisify(res8, 0)) {
    cb(await multiplyPromisify(res8, -1));
    return;
  }

  cb(res8);
}

/**
 * Task 5
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @callback cb - (result1?: Number, result2?: Number) => void
 */
async function quadraticEquation(a, b, c, cb) {
  // D = b**2 – 4ac
  const res0 = await multiplyPromisify(4, a);

  const [res1, res2] = await Promise.all([
    multiplyPromisify(b, b),
    multiplyPromisify(res0, c),
  ]);

  const d = await subtractPromisify(res1, res2);

  if (await lessPromisify(d, 0)) {
    // undefined
    cb();
    return;
  }

  const [rBm1, r2a] = await Promise.all([
    multiplyPromisify(-1, b),
    multiplyPromisify(2, a),
  ]);

  if (await equalPromisify(d, 0)) {
    // x = -1 * b / 2*a
    const r3 = await dividePromisify(rBm1, r2a);
    cb(r3);
    return;
  }

  // x1 = (-1b + Math.sqrt(d)) / 2a
  // x2 = (-1b - Math.sqrt(d)) / 2a
  const dSqrt = await sqrtPromisify(d);
  const sum = await addPromisify(rBm1, dSqrt);
  const x1 = await dividePromisify(sum, r2a);
  const sub = await subtractPromisify(rBm1, dSqrt);
  const x2 = await dividePromisify(sub, r2a);

  cb(x1, x2);
}

/**
 * Task 6
 * @param {AsyncArray} array
 * @callback cb
 */
async function sumOddNumbers(array, cb) {
  let sum = 0;
  const arrPromisify = promisifyAsyncArrayObj(array);
  const len = await arrPromisify.length();

  let i = 0;
  while (await lessPromisify(i, len)) {
    const value = await arrPromisify.get(i);
    const isOdd = !(await equalPromisify(await modPromisify(value, 2), 0));
    if (isOdd) sum = await addPromisify(sum, value);
    i = await addPromisify(i, 1);
  }

  cb(sum);
}

/**
 * Task 7
 * @param {AsyncArray} arr
 * @callback cb
 */
async function sumEvenIndexElements(arr, cb) {
  let sum = 0;
  const arrPromisify = promisifyAsyncArrayObj(arr);
  const len = await arrPromisify.length();

  let i = 0;
  while (await lessPromisify(i, len)) {
    const isEven = await equalPromisify(await modPromisify(i, 2), 0);

    if (isEven) {
      const value = await arrPromisify.get(i);
      sum = await addPromisify(sum, value);
    }

    i = await addPromisify(i, 1);
  }

  cb(sum);
}

/**
 * Task 8
 * @param {AsyncArray} array
 * @param {Function} fn
 * @callback cb
 */
async function map(array, fn, cb) {
  const result = new AsyncArray();
  const arrPromisify = promisifyAsyncArrayObj(array);
  const len = await arrPromisify.length();

  let i = 0;
  while (await lessPromisify(i, len)) {
    const value = await arrPromisify.get(i);
    await new Promise((resolve) => result.push(fn(value, i, array), resolve));
    i = await addPromisify(i, 1);
  }

  cb(result);
}

/**
 * Task 9
 * @param {AsyncArray} array
 * @param {Function} fn
 * @param {any} initialValue
 * @callback cb
 */
async function reduce(array, fn, initialValue, cb) {
  let acc = initialValue;
  const arrPromisify = promisifyAsyncArrayObj(array);
  const len = await arrPromisify.length();

  let i = 0;
  while (await lessPromisify(i, len)) {
    const value = await arrPromisify.get(i);
    acc = fn(acc, value, i, array);
    i = await addPromisify(i, 1);
  }

  cb(acc);
}

/**
 * Task 10
 * @param {AsyncArray} array
 * @param {Function} fn
 * @callback cb
 */
async function filter(array, fn, cb) {
  const result = new AsyncArray();
  const arrPromisify = promisifyAsyncArrayObj(array);
  const len = await arrPromisify.length();

  let i = 0;
  while (await lessPromisify(i, len)) {
    const value = await arrPromisify.get(i);

    await new Promise((resolve) => {
      if (fn(value, i, array)) {
        result.push(value, resolve);
      } else {
        resolve();
      }
    });

    i = await addPromisify(i, 1);
  }

  cb(result);
}

/**
 * Helper. Display function result
 * @param {String} taskName
 * @param {Function} fn
 */

function displayResult(taskName, fn) {
  return function (...args) {
    const callback = (...res) => {
      console.log(`----- Task ${taskName} -----`);
      console.log("arguments:");
      args
        .slice(0, -1)
        .forEach((v) => (v instanceof AsyncArray ? v.print() : console.log(v)));

      console.log("result:");

      if (res.length > 1) {
        res.forEach((v) =>
          v instanceof AsyncArray ? c.print() : console.log(v)
        );
      } else {
        res[0] instanceof AsyncArray ? res[0].print() : console.log(res[0]);
      }
      console.log("");
    };

    args.push(callback);

    fn.apply(this, args);
  };
}

/**
 *
 * @param {any} val
 */
function isIterable(val) {
  return (
    val !== undefined &&
    val !== null &&
    typeof val[Symbol.iterable] === "function"
  );
}

displayResult(
  "01 (with out async iterator)",
  maxFromArray
)(new AsyncArray([2, 10, 4, 5, 8, 1]));

displayResult(
  "01 (with async iterator)",
  maxFromArray2
)(new AsyncArray([2, 10, 4, 5, 8, 1]));

displayResult("02", average)(new AsyncArray([2, 10, 4, 5, 8, 1]));

displayResult("03", sumVectors)(
  new AsyncArray([1, 10, 16]),
  new AsyncArray([3, 4, 8]),
  new AsyncArray([2, 2, 2]),
  new AsyncArray([4, 4, 4])
);

displayResult("04", areaTriangle)(-1, -3, 3, 4, 5, -5);

displayResult("05 (two results)", quadraticEquation)(-1, 12, -35);
displayResult("05 (one result)", quadraticEquation)(16, -40, 25);
displayResult("05 (not results)", quadraticEquation)(-16, 1, -25);

displayResult("06", sumOddNumbers)(new AsyncArray([1, 2, 3, 4, 5]));

displayResult("07", sumEvenIndexElements)(new AsyncArray([1, 2, 3]));

displayResult("08", map)(new AsyncArray([1, 2, 3]), (v) => v + 2);

displayResult("09", reduce)(
  new AsyncArray(["b", "c", "d"]),
  (acc, v) => acc + v,
  "a"
);

displayResult("10", filter)(
  new AsyncArray([1, 2, 3, 4, 5, 6]),
  (v) => v % 2 === 0
);
