import classes from "./label.module.css";

const Label = (props) => {
  const { className: additClasses } = props;
  const labelClasses = `${classes.label} ${additClasses}`;

  return <label className={labelClasses}>{props.children}</label>;
};

export default Label;
