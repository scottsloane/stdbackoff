const Backoff = (() => {
  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const asyncLinearBackoff = (fn, maxAttempts = 5, ms = 1000) => {
    return new Promise(async (resolve, reject) => {
      try {
        let retries = 0;
        while (retries < maxAttempts) {
          try {
            const result = await fn();
            resolve(result);
            break;
          } catch (error) {
            retries++;
            await sleep(ms);
          }
        }
        reject(new Error("Max retries exceeded"));
      } catch (error) {
        reject(error);
      }
    });
  };

  const linearBackoff = (fn, maxAttempts = 5, ms = 1000) => {
    return new Promise((resolve, reject) => {
      try {
        let retries = 0;
        while (retries < maxAttempts) {
          try {
            const result = fn();
            resolve(result);
            break;
          } catch (error) {
            retries++;
            sleep(ms);
          }
        }
        reject(new Error("Max retries exceeded"));
      } catch (error) {
        reject(error);
      }
    });
  };

  const asyncExponentialBackoff = (func, maxAttempts = 5, ms = 1000) => {
    return new Promise(async (resolve, reject) => {
      let attempts = 0;
      while (attempts < maxAttempts) {
        try {
          attempts++;
          let result = await func();
          resolve(result);
          return;
        } catch (err) {
          console.error(err);
          await wait(ms * attempts);
        }
      }
      reject("Max attempts reached");
    });
  };

  const exponentialBackoff = (func, maxAttempts = 5, ms = 1000) => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      while (attempts < maxAttempts) {
        try {
          attempts++;
          let result = func();
          resolve(result);
          return;
        } catch (err) {
          console.error(err);
          wait(ms * attempts);
        }
      }
      reject("Max attempts reached");
    });
  };

  return {
    asyncLinearBackoff,
    linearBackoff,
    asyncExponentialBackoff,
    exponentialBackoff,
  };
})();
