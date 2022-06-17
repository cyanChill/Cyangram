import Image from "next/image";

import Username from "../../misc/links/usernameLink";
import TextBreaker from "../../ui/textbreaker/textbreaker";

import classes from "./commentbody.module.css";

const CommentBody = ({
  picUrl,
  picAlt,
  username,
  textContent,
  noContent,
  className,
}) => {
  return (
    <div className={`${classes.wrapper} ${className}`}>
      <div className={classes.imgContainer}>
        <Image
          src={picUrl}
          alt={picAlt}
          width="500"
          height="500"
          layout="responsive"
          className={classes.rounded}
        />
      </div>

      <TextBreaker className={classes.content}>
        <Username className={classes.bold} username={username} />{" "}
        {!noContent && (
          <span className={classes.textContent}>{textContent}</span>
        )}
      </TextBreaker>
    </div>
  );
};

export default CommentBody;
