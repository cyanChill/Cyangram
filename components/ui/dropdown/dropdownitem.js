import classes from "./dropdownitem.module.css";

const DropDownItem = ({ children, className, noPad, active, ...rest }) => {
  return (
    <li
      {...rest}
      className={`${classes.ddItem} ${!noPad && classes.pad} ${
        active && classes.active
      } ${className}`}
    >
      {children}
    </li>
  );
};

export default DropDownItem;
