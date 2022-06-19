const DEFAULT_TIMEOUT = 300;

/* Will trigger function after user stops inputting */
export const debounce = (func, timeout = DEFAULT_TIMEOUT) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

/* Will trigger function after 1st input */
export const debounce_leading = (func, timeout = DEFAULT_TIMEOUT) => {
  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
};
