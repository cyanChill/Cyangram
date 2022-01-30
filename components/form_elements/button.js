import classes from "./button.module.css";

const Button = (props) => {
  const outline = props.outline ? classes.outline : null;
  const variant = props.variant ? classes[props.variant] : null;
  const pill = props.pill ? classes.pill : null;
  const btnClasses = `${classes.btn} ${variant} ${props.className} ${outline} ${pill}`;
  const btnStyles = props.style;

  return (
    <button onClick={props.onClick} className={btnClasses} style={btnStyles}>
      {props.children}
    </button>
  );
};

export default Button;
