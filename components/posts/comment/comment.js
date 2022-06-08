/* 
  This is the comments box (displays the comments) on the actual post page
  (ie: on the ".../p/<postId>" route)
    - I guess take a list of comments and display them
    - Need a different look for when in "phone" vs "window"
      - With "window", have a border, maybe some curviness?

  OR this can be the singular comment and we just iterate in the "post.js"
  file
*/
import { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";

import Username from "../../misc/links/usernameLink";
import { timeSince } from "../../../lib/time";
import DropDownMenu from "../../ui/dropdown/dropdown";
import DropDownItem from "../../ui/dropdown/dropdownitem";

import classes from "./comment.module.css";

const Comment = ({ postId, comment, viewerId, handleRemove }) => {
  const {
    _id: commentId,
    commenterInfo: { username, profilePic },
    content,
  } = comment;

  const [postSince, setPostSince] = useState("");

  useEffect(() => {
    const date = comment.date;
    setPostSince(timeSince(date));
  }, []);

  if (!comment || !content) {
    return null;
  }

  const handleCommentDelete = async () => {
    const res = await fetch(`/api/post/${postId}/comment`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId: commentId }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Failed to delete comment");
      console.log(data.errMsg);
    } else {
      handleRemove(commentId);
      console.log("Deleted comment");
      /* TODO: Add alert saying comment was deleted */
    }
  };

  return (
    <div className={classes.comment}>
      <div className={classes.commentContent}>
        <div className={classes.profileImgContainer}>
          <Image
            src={profilePic.url}
            alt={`${username}'s Profile Picture`}
            width="500"
            height="500"
            layout="responsive"
            className={classes.rounded}
          />
        </div>

        <p className={classes.content}>
          <Username className={classes.posterName} username={username} />{" "}
          <span className={classes.commentText}>{content}</span>
        </p>
      </div>

      <div className={classes.details}>
        <div className={classes.timeSince}>{postSince}</div>

        {/* Dropdown menu for delete option if we made this comment */}
        {viewerId === comment.commenterId && (
          <CommentSettings handleCommentDelete={handleCommentDelete} />
        )}
      </div>
    </div>
  );
};

export default Comment;

const CommentSettings = ({ handleCommentDelete }) => {
  const [ddDisplayStatus, setddDisplayStatus] = useState(false);

  return (
    <div
      className={classes.ddContainer}
      onClick={() => setddDisplayStatus((prev) => !prev)}
    >
      <BiDotsVerticalRounded className={classes.ddTrigger} />
      <DropDownMenu
        arrowPosition="right"
        openFromDirection="bottom"
        display={ddDisplayStatus}
      >
        <DropDownItem
          className={classes.deleteBtn}
          onClick={handleCommentDelete}
        >
          <AiOutlineDelete />
          <span>Delete Comment</span>
        </DropDownItem>
      </DropDownMenu>
    </div>
  );
};
