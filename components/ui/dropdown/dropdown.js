import classes from "./dropdown.module.css";

const DropDownMenu = ({
  className,
  children,
  openFromDirection,
  arrowPosition,
  display,
}) => {
  /* openFromDirection = "top" or "bottom" (Default) */
  /* arrowPosition = "left" or "middle" (Default) or "right" */

  const openFromClass =
    openFromDirection === "top" ? classes.openTop : undefined;
  const arrowPositionClass =
    arrowPosition === "left"
      ? classes.arrowLeft
      : arrowPosition === "right"
      ? classes.arrowRight
      : undefined;

  return (
    <div
      className={`ddWrapper ${classes.ddWrapper} ${openFromClass} ${
        display && classes.visible
      } ${className}`}
    >
      <span className={classes.arrow} />
      <ul className={`${classes.ddMenu} ${arrowPositionClass}`}>{children}</ul>
    </div>
  );
};

export default DropDownMenu;
