import { AiOutlineCamera } from "react-icons/ai";

import classes from "./nopost.module.css";

const NoPost = () => {
  return (
    <div className={classes.nopost}>
      <div className={classes.noposticon}>
        <AiOutlineCamera />
      </div>
      <p>No Posts Yet</p>
    </div>
  );
};

export default NoPost;
