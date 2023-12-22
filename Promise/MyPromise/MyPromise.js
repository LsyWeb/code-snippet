const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  #status = PENDING;
  #result = undefined;
  #handlers = [];

  constructor(executor) {
    const resolve = (data) => {
      this.#changeStatus(FULFILLED, data);
    };
    const reject = (error) => {
      this.#changeStatus(REJECTED, error);
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  /**
   * 修改状态
   */
  #changeStatus(status, result) {
    if (this.#status !== PENDING) return;
    this.#status = status;
    this.#result = result;
    this.#run();
  }

  /**
   * 微任务
   */
  #runMicroTask(callback) {
    if (typeof callback !== "function") return;
    if (process && typeof process.nextTick === "function") {
      return process.nextTick(callback);
    } else if (typeof MutationObserver === "function") {
      const observer = new MutationObserver(callback);
      const textNode = document.createTextNode("1");
      observer.observe(textNode, {
        characterData: true,
      });
      textNode.data = "2";
      return;
    }
    setTimeout(() => {
      callback();
    }, 0);
  }

  /**
   * 判断是否是Promise（PromiseA+规范）
   */
  #isPromiseLike(value) {
    return value && typeof value.then === "function";
  }

  /**
   * 执行一个回调
   */
  #runOne(callback, resolve, reject) {
    this.#runMicroTask(() => {
      if (typeof callback === "function") {
        try {
          const data = callback(this.#result);
          if (this.#isPromiseLike(data)) {
            data.then(resolve, reject);
            return;
          } else {
            resolve(data);
          }
        } catch (error) {
          reject(this.#result);
        }
      } else {
        if (this.#status === FULFILLED) {
          resolve(this.#result);
        } else {
          reject(this.#result);
        }
      }
    });
  }

  /**
   * 执行回调队列
   */
  #run() {
    if (this.#status === PENDING) return;
    while (this.#handlers.length) {
      const { onFulfilled, onRejected, resolve, reject } =
        this.#handlers.shift();
      if (this.#status === FULFILLED) {
        this.#runOne(onFulfilled, resolve, reject);
      } else if (this.#status === REJECTED) {
        this.#runOne(onRejected, resolve, reject);
      }
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#handlers.push({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
      this.#run();
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally();
        return value;
      },
      (error) => {
        onFinally();
        throw error;
      },
    );
  }
}

MyPromise.resolve = function (value) {
  return new MyPromise((resolve) => {
    resolve(value);
  });
};

MyPromise.reject = function (error) {
  return new MyPromise((resolve, reject) => {
    reject(error);
  });
};

MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    const results = [];
    let count = 0;
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];
      promise.then(
        (value) => {
          results[i] = value;
          count++;
          if (count === promises.length) {
            resolve(results);
          }
        },
        (error) => {
          reject(error);
        },
      );
    }
  });
};

MyPromise.allSettled = function (promises) {
  return new MyPromise((resolve) => {
    const results = [];
    let count = 0;
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];
      promise.then(
        (value) => {
          results[i] = {
            status: FULFILLED,
            value,
          };
          count++;
          if (count === promises.length) {
            resolve(results);
          }
        },
        (error) => {
          results[i] = {
            status: REJECTED,
            error,
          };
          count++;
          if (count === promises.length) {
            resolve(results);
          }
        },
      );
    }
  });
};

MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];
      promise.then(
        (value) => {
          resolve(value);
        },
        (error) => {
          reject(error);
        },
      );
    }
  });
};

// test
const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(123);
  }, 2000);
});

const p2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject(456);
  }, 1000);
})

p1.then((value) => {
  console.log(value);
  return MyPromise.resolve(789);
}).then((res) => {
  console.log(res);
});

p2.catch((error) => {
  console.log(error,'error');
});
 

MyPromise.all([p1, p2]).then((value) => {
  console.log(value);
})

MyPromise.allSettled([p1, p2]).then((value) => {
  console.log(value);
});

MyPromise.race([p1, p2]).then((value) => {
  console.log(value);
});