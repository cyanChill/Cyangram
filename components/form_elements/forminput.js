import React from "react";

import classes from "./forminput.module.css";

const FormInput = React.forwardRef((props, ref) => {
  const {
    type: inputType,
    className: additClasses,
    rows: numRows,
    ...rest
  } = props;

  if (inputType === "textarea") {
    const rowCnt = numRows && !isNaN(numRows) && +numRows > 0 ? +numRows : 3;
    return (
      <textarea
        ref={ref}
        className={`${classes.textarea} ${additClasses}`}
        rows={rowCnt}
        {...rest}
      />
    );
  }

  return (
    <input
      ref={ref}
      type={inputType}
      className={`${classes.input} ${additClasses}`}
      {...rest}
    />
  );
});

// Deal with eslint error
FormInput.displayName = "FormInput";

export default FormInput;
