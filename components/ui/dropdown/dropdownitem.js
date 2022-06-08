import classes from "./dropdownitem.module.css";

const DropDownItem = ({ children, className, active, ...rest }) => {
  return (
    <li
      {...rest}
      className={`${classes.ddItem} ${active && classes.active} ${className}`}
    >
      {children}
    </li>
  );
};

export default DropDownItem;
