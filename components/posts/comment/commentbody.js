import UsernameLink from "../../misc/links/usernameLink";
import TextBreaker from "../../ui/textBreaker/textBreaker";
import LoadImage from "../../ui/loadImage/loadImage";
import classes from "./commentBody.module.css";

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
        <LoadImage
          src={picUrl}
          alt={picAlt}
          width="500"
          height="500"
          layout="responsive"
          className={classes.rounded}
        />
      </div>

      <TextBreaker className={classes.content}>
        <UsernameLink className={classes.bold} username={username} />{" "}
        {!noContent && (
          <span className={classes.textContent}>{textContent}</span>
        )}
      </TextBreaker>
    </div>
  );
};

export default CommentBody;
