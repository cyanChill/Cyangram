/* Verify file object is an image */
export const isImage = (file) => {
  const fileType = file.type ?? file.mimetype;
  if (typeof fileType !== "string") return false;

  const fileCtgy = fileType.split("/")[0]; // Expect values such as "image/png"
  return fileCtgy === "image";
};

/* Verifies image is less than a specific size */
export const validImageSize = (imageSize, maxSizeMB) => {
  return imageSize < maxSizeMB * 1024 * 1024;
};

/* 
  testsArr will be an array of higher-order functions (functions that return
  other functions)
*/
export default function Validator(item, testsArr) {
  if (!Array.isArray(testsArr) || testsArr.length === 0) {
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

/*  -=-=- Validator functions -=-=- */
export const nameFriendly = (name) => {
  // - Only allows letters, numbers, space, periods (.), and underscores (_)
  // - Name can't be all spaces, periods (.) and underscores (_)
  const validRegex = /^[^\s\._][\w\. ]{6,28}[^\s\._]$/;
  const onlySpecialChars = /^[\s\._]{1,}$/;
  return validRegex.test(name) && !onlySpecialChars.test(name);
};

export const usernameFriendly = (username) => {
  // - Only allows letters, numbers, periods (.), and underscores (_)
  // - Username can't be all periods (.) and underscores (_)
  const validRegex = /^[\w\.]{8,30}$/;
  const onlySpecialChars = /^[\._]{1,}$/;
  return validRegex.test(username) && !onlySpecialChars.test(username);
};

export const required = (value) => {
  return !!value;
};

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
