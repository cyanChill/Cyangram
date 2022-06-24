import classes from "./textBreaker.module.css";

const TextBreaker = ({ children, className, ...rest }) => {
  return (
    <p {...rest} className={`${classes.textBreaker} ${className}`}>
      {children}
    </p>
  );
};

export default TextBreaker;
