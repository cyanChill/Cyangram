import { AiOutlineShareAlt } from "react-icons/ai";

import global from "../../../global";
import classes from "./sharepostbtn.module.css";

const SharePostBtn = ({ postId, children }) => {
  const sendToClipboard = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASE_URL}/p/${postId}`
    );
    global.alerts.actions.addAlert({
      type: global.alerts.types.default,
      content: "Copied post link to clipboard.",
    });
  };

  return (
    <div onClick={sendToClipboard} className={classes.wrapper}>
      <AiOutlineShareAlt />
      {children}
    </div>
  );
};

export default SharePostBtn;
