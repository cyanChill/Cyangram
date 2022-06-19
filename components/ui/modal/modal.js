import Card from "../card/card";
import classes from "./modal.module.css";

const Modal = ({ active, children, modalBodyClasses }) => {
  if (!active) {
    return null;
  }

  return (
    <div className={classes.modal}>
      <div className={classes.modalBackdrop} />
      <Card className={`${classes.modalBody} ${modalBodyClasses}`}>
        {children}
      </Card>
    </div>
  );
};

export default Modal;
