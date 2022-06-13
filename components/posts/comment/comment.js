/* 
  This is the comments box (displays the comments) on the actual post page
  (ie: on the ".../p/<postId>" route)
    - I guess take a list of comments and display them
    - Need a different look for when in "phone" vs "window"
      - With "window", have a border, maybe some curviness?

  OR this can be the singular comment and we just iterate in the "post.js"
  file
*/
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";

import global from "../../../global";
import CommentBody from "./commentBody";
import DropDownMenu from "../../ui/dropdown/dropdown";
import DropDownItem from "../../ui/dropdown/dropdownitem";

import classes from "./comment.module.css";

const Comment = ({ postId, comment, viewerId, handleRemove }) => {
  const {
    _id: commentId,
    commenterInfo: { username, profilePic },
    content,
  } = comment;

  if (!comment || !content) {
    return null;
  }

  const handleCommentDelete = async () => {
    const res = await fetch(`/api/post/${postId}/comment`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId: commentId }),
    });

    if (!res.ok) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: "Failed to delete comment.",
      });
    } else {
      handleRemove(commentId);
      global.alerts.actions.addAlert({
        type: global.alerts.types.success,
        content: "Successfully deleted comment.",
      });
    }
  };

  return (
    <div className={classes.comment}>
      <CommentBody
        picUrl={profilePic.url}
        picAlt={`${username}'s profile picture`}
        username={username}
        textContent={content}
      />

      <div className={classes.commentSettings}>
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
    <div onClick={() => setddDisplayStatus((prev) => !prev)}>
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
