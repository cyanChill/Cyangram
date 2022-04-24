import classes from "./card.module.css";

const Card = (props) => {
  const {
    rounded,
    className: additClasses,
    shadow,
    style: additStyles,
  } = props;
  const cardClasses = `${classes.card} ${additClasses} ${
    rounded && classes.rounded
  } ${shadow && classes.shadow}`;

  return (
    <div className={cardClasses} style={additStyles}>
      {props.children}
    </div>
  );
};

export default Card;
