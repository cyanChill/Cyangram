import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";

import global from "../../../global";
import CommentBody from "./commentbody";
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
    const data = await res.json();

    global.alerts.actions.addAlert({
      type: global.alerts.types[res.ok ? "success" : "error"],
      content: data.message,
    });

    // If we successfully removed comment server-side, do it client-side
    if (res.ok) {
      handleRemove(commentId);
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
