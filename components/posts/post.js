/* 
  The main Post component which displays comments, the post, etc.
    - Allows user to comment, like, etc (given they're logged in)

  Post Page (With Comments and Such):
    - Can probably reuse the "post_excerpt.js" component as the basis (as it has the likes & description stuff)
*/
import { useState, useEffect } from "react";
import Image from "next/image";

import global from "../../global";
import { timeSince } from "../../lib/time";
import Comment from "./comment/comment";
import PostActions from "./actions/post_actions";
import BackHeader from "../ui/backheader/backHeader";
import FormInput from "../form_elements/forminput";
import CommentBody from "./comment/commentBody";

import classes from "./post.module.css";

const PostPage = ({ postData, ownPost, hasLiked, viewerId }) => {
  const postId = postData._id;
  const username = postData.posterInfo.username;

  const [commentField, setCommentField] = useState("");

  const [numLikes, setNumLikes] = useState(postData.likes.length);
  const [comments, setComments] = useState(postData.comments);
  const [postedSince, setPostedSince] = useState("");

  useEffect(() => {
    const date = postData.date;
    setPostedSince(timeSince(date));
  }, []);

  const focusCommentField = () => {
    document.getElementById("commentField").focus();
  };

  const removeComment = (id) => {
    setComments(comments.filter((comment) => comment._id !== id));
  };

  const handleLikes = (action) => {
    if (action === "ADD") {
      setNumLikes((prev) => prev + 1);
    } else if (action === "SUB") {
      setNumLikes((prev) => prev - 1);
    }
  };

  const handleCommentSubmit = async () => {
    if (commentField.trim().length === 0) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: "Cannot submit empty comment.",
      });
      return;
    }

    /* TODO: Safeguard the contents we're submitting (check it's not malicious/need censoring) */

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${postId}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: commentField.trim(),
        }),
      }
    );
    const data = await res.json();

    if (!res.ok) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: "An error has occurred when submitting your comment.",
      });
      return;
    }

    global.alerts.actions.addAlert({
      type: global.alerts.types.success,
      content: "Successfully added comment to post.",
    });
    setComments((prev) => [...prev, data.comment]);
    setCommentField("");
  };

  return (
    <div className={classes.wrapper}>
      {/* Where we put the back button & name of poster */}
      <BackHeader text={username} linkPath={`/${username}`} />

      <div>
        <Image
          src={postData.image.url}
          alt={`Post by ${username}`}
          className={classes.postImg}
          width="500"
          height="500"
          layout="responsive"
          priority
        />
      </div>

      {/* Post Description */}
      {!!postData.description.trim() && (
        <div className={classes.descriptionWrapper}>
          <CommentBody
            picUrl={postData.posterInfo.profilePic.url}
            picAlt={`${postData.posterInfo.username} profile picture`}
            username={postData.posterInfo.username}
            textContent={postData.description}
          />
        </div>
      )}

      {/* Div with scrollable containing comments */}
      <div className={classes.commentContainer}>
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            postId={postId}
            comment={comment}
            viewerId={viewerId}
            handleRemove={removeComment}
          />
        ))}
      </div>

      {/* Like button, "comment, share" buttons, settings drop down */}
      <PostActions
        postId={postId}
        settings
        likeBtnAction={handleLikes}
        commentBtnAction={focusCommentField}
        isOwner={ownPost}
        hasLiked={hasLiked}
      />

      <div className={classes.statistics}>
        <p className={classes.likeCount}>{numLikes} Likes</p>
        <p className={classes.postedSince}>{postedSince}</p>
      </div>

      {/* Comment field */}
      <div className={classes.commentField}>
        <FormInput
          id="commentField"
          name="commentField"
          type="text"
          placeholder="Add a comment..."
          required
          value={commentField}
          onChange={(e) => setCommentField(e.target.value)}
          noExternalPadding
        />

        {/* Disable the following if the textfield is empty */}
        <span
          variant="clear"
          className={classes.postBtn}
          disabled={!commentField}
          onClick={handleCommentSubmit}
        >
          Post
        </span>
      </div>
    </div>
  );
};

export default PostPage;
