/* A "[Profile-Pic] [Username] [Text]" element used in comments & descriptions */

import Image from "next/image";

import Username from "../../misc/links/usernameLink";
import TextBreaker from "../../ui/textbreaker/textbreaker";

import classes from "./commentbody.module.css";

const CommentBody = ({ picUrl, picAlt, username, textContent, noContent }) => {
  return (
    <div className={classes.wrapper}>
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
