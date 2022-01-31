export const isEmail = (email) => {
  if (typeof email !== "string") throw new Error("Invalid input");

  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  return email.length !== 0 && emailRegex.test(email);
};

export const usernameFriendly = (username) => {
  const validRegex = /^[\w\.]{1,30}$/;
  const onlySpecialChars = /^[\._]{1,30}$/;

  return validRegex.test(username) && !onlySpecialChars.test(username);
};

export const required = (value) => {
  return !!value;
};

export default function Validator(item, testsArr) {
  if (
    !Array.isArray(testsArr) ||
    (Array.isArray(testsArr) && testsArr.length === 0)
  ) {
    throw new Error("Invalid input");
  }

  let isValid = true;

  try {
    for (const tester of testsArr) {
      isValid = isValid && tester(item);
    }
  } catch (err) {
    console.log(err);
    return false;
  }

  return isValid;
}

/* 
  testsArr will be an array of higher-order functions (functions that return
  other functions)
*/

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
