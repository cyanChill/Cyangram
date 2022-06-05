import classes from "./inputGroup.module.css";

const InputGroup = (props) => {
  const inputGroupClasses = `${classes.inputGroup} ${
    props.ignoreAlign && classes.ignoreAlign
  } ${props.className}`;

  return <div className={inputGroupClasses}>{props.children}</div>;
};

export default InputGroup;
