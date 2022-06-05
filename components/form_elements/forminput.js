import React from "react";

import classes from "./forminput.module.css";

const FormInput = React.forwardRef((props, ref) => {
  const {
    type: inputType,
    className: additClasses,
    rows: numRows,
    noResize,
    errMsg,
    hasErr,
    ...rest
  } = props;

  let errorMessage;

  if (errMsg) {
    errorMessage = <p className={classes.error}>{errMsg}</p>;
  }

  if (inputType === "textarea") {
    const rowCnt = numRows && !isNaN(numRows) && +numRows > 0 ? +numRows : 3;
    return (
      <div className={classes.wrapper}>
        <textarea
          ref={ref}
          className={`${classes.textarea} ${additClasses} ${
            noResize && classes.noResize
          }`}
          rows={rowCnt}
          {...rest}
        />
        {hasErr && errorMessage}
      </div>
    );
  }

  return (
    <div className={classes.wrapper}>
      <input
        ref={ref}
        type={inputType}
        className={`${classes.input} ${additClasses}`}
        {...rest}
      />
      {hasErr && errorMessage}
    </div>
  );
});

// Deal with eslint error
FormInput.displayName = "FormInput";

export default FormInput;
