import classes from "./button.module.css";

const Button = (props) => {
  const {
    outline,
    variant,
    pill,
    className: additClasses,
    style: additStyles,
    disabled,
  } = props;
  const btnClasses = `${classes.btn} ${
    variant && classes[variant]
  } ${additClasses} ${outline && classes.outline} ${pill && classes.pill}`;

  return (
    <button
      onClick={props.onClick}
      className={btnClasses}
      style={additStyles}
      disabled={disabled ? true : false}
    >
      {props.children}
    </button>
  );
};

export default Button;
