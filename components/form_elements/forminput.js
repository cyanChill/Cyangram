import classes from "./forminput.module.css";

const FormInput = (props) => {
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
        className={`${classes.textarea} ${additClasses}`}
        rows={rowCnt}
        {...rest}
      />
    );
  }

  return (
    <input
      type={inputType}
      className={`${classes.input} ${additClasses}`}
      {...rest}
    />
  );
};

export default FormInput;
