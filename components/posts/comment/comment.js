/* 
  This is the comments box (displays the comments) on the actual post page
  (ie: on the ".../p/<postId>" route)
    - I guess take a list of comments and display them
    - Need a different look for when in "phone" vs "window"
      - With "window", have a border, maybe some curviness?

  OR this can be the singular comment and we just iterate in the "post.js"
  file
*/
import Image from "next/image";

import Username from "../../misc/links/usernameLink";

import { timeSince } from "../../../lib/time";
import classes from "./comment.module.css";

const Comment = ({ comment }) => {
  const {
    commenterInfo: { username, profilePic },
    content,
    date, // In Epoch Time
    ownComment,
  } = comment;

  if (!comment || !content) {
    return null;
  }

  const postSince = timeSince(date);

  return (
    <div className={classes.comment}>
      <div className={classes.commentContent}>
        <Image
          src={profilePic.url}
          alt={`${username}'s Profile Picture`}
          width="500"
          height="500"
          layout="responsive"
          priority
          className={classes.profileImg}
        />

        <p className={classes.content}>
          <Username className={classes.posterName} username={username} />{" "}
          <span>{content}</span>
        </p>
      </div>

      <div className={classes.details}>
        <div className={classes.timeSince}>{postSince}</div>

        {/* Dropdown menu for delete option if we made this comment */}
        {ownComment && <div className={classes.settings}>...</div>}
      </div>
    </div>
  );
};

export default Comment;
