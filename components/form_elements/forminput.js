import React from "react";

import classes from "./forminput.module.css";

const FormInput = React.forwardRef((props, ref) => {
  const {
    type: inputType,
    className: additClasses,
    rows: numRows,
    noResize,
    noExternalPadding,
    errMsg,
    hasErr,
    ...rest
  } = props;

  let errorMessage;

  if (errMsg) {
    errorMessage = <p className={classes.error}>{errMsg}</p>;
  }

  const wrapperClass = `${classes.wrapper} ${
    noExternalPadding && classes.noExternPad
  }`;

  if (inputType === "textarea") {
    const rowCnt = numRows && !isNaN(numRows) && +numRows > 0 ? +numRows : 3;
    return (
      <div className={wrapperClass}>
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
    <div className={wrapperClass}>
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
