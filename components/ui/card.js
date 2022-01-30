import classes from "./card.module.css";

const Card = (props) => {
  const rounded = props.rounded ? classes.rounded : null;
  const cardClasses = `${classes.card} ${props.className} ${rounded}`;
  const cardStyles = props.style;

  return (
    <div className={cardClasses} style={cardStyles}>
      {props.children}
    </div>
  );
};

export default Card;
