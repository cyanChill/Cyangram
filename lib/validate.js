export const usernameFriendly = (username) => {
  // Only allows letters, numbers, period (.), and underscore (_) [SO NO SPACES]
  const validRegex = /^[\w\.]{3,30}$/;
  const onlySpecialChars = /^[\._]{3,30}$/;

  return validRegex.test(username) && !onlySpecialChars.test(username);
};

export const required = (value) => {
  return !!value;
};

/* 
  testsArr will be an array of higher-order functions (functions that return
  other functions)
*/
export default function Validator(item, testsArr) {
  if (
    !Array.isArray(testsArr) ||
    (Array.isArray(testsArr) && testsArr.length === 0)
  ) {
    throw new Error("Invalid input");
  }

  let isValid = true;

  try {
    for (const testerFunc of testsArr) {
      isValid = isValid && testerFunc(item);
    }
  } catch (err) {
    console.log(err);
    return false;
  }

  return isValid;
}

/* 
  Validator functions
*/
export const minLength = (num) => {
  if (typeof num !== "number") throw new Error("Invalid input");

  return (item) => {
    if (typeof item !== "string") throw new Error("Invalid input");
    return item.length >= num;
  };
};

export const maxLength = (num) => {
  if (typeof num !== "number") throw new Error("Invalid input");

  return (item) => {
    if (typeof item !== "string") throw new Error("Invalid input");
    return item.length <= num;
  };
};
