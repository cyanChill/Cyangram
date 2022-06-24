import { useState, useRef } from "react";

import global from "../../../global";
import { timeSince } from "../../../lib/conversions";
import Comment from "../../posts/comment/comment";
import PostActions from "../../posts/actions/postActions";
import BackHeader from "../../ui/backHeader/backHeader";
import FormInput from "../../formElements/formInput";
import CommentBody from "../../posts/comment/commentBody";
import Card from "../../ui/card/card";
import LoadImage from "../../ui/loadImage/loadImage";
import classes from "./post.module.css";

const Post = ({ postData, ownPost, hasLiked, viewerId }) => {
  const postId = postData._id;
  const [comments, setComments] = useState(postData.comments);

  const addComment = (comment) => {
    setComments((prev) => [...prev, comment]);
  };

  const removeComment = (id) => {
    setComments(comments.filter((comment) => comment._id !== id));
  };

  return (
    <div className={classes.wrapper}>
      {/* Where we put the back button & name of poster */}
      <BackHeader
        text={postData.posterInfo.username}
        linkPath={`/${postData.posterInfo.username}`}
      />

      <Card className={classes.cardClasses}>
        {/* Put the image into a container */}
        <div className={classes.imgContainer}>
          <LoadImage
            src={postData.image.url}
            alt={`Post by ${postData.posterInfo.username}`}
            className={classes.postImg}
            width="500"
            height="500"
            layout="responsive"
            priority
          />
        </div>

        {/* Wraps general content of post */}
        <div className={classes.generalContent}>
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

          <CommentsContainer
            id={postId}
            comments={comments}
            viewerId={viewerId}
            removeComment={removeComment}
          />

          <ActionSection
            id={postId}
            date={postData.date}
            likes={postData.likes.length}
            ownPost={ownPost}
            hasLiked={hasLiked}
            addComment={addComment}
          />
        </div>
      </Card>
    </div>
  );
};

export default Post;

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                   Comments Container Component
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
const CommentsContainer = ({ id, comments, viewerId, removeComment }) => {
  /* Div with scrollable containing comments */
  return (
    <div className={classes.commentContainer}>
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          postId={id}
          comment={comment}
          viewerId={viewerId}
          handleRemove={removeComment}
        />
      ))}
    </div>
  );
};

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                     Post Actions Component
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
const ActionSection = ({ id, date, likes, ownPost, hasLiked, addComment }) => {
  const commentRef = useRef(null);
  const [numLikes, setNumLikes] = useState(likes);
  const [commentField, setCommentField] = useState("");
  const [disableComment, setDisableComment] = useState(false);

  const focusCommentField = () => {
    commentRef.current.focus();
  };

  const handleLikes = (action) => {
    if (action === "ADD") {
      setNumLikes((prev) => prev + 1);
    } else if (action === "SUB") {
      setNumLikes((prev) => prev - 1);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentField.trim() && commentField.trim().length <= 200) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: "Invalid comment length (>0 & <=200).",
      });
      return;
    }

    setDisableComment(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${id}/comment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: commentField.trim() }),
      }
    );
    const data = await res.json();

    global.alerts.actions.addAlert({
      type: global.alerts.types[res.ok ? "success" : "error"],
      content: data.message,
    });

    // If we successfully created comment, update client-side
    if (res.ok) {
      addComment(data.comment);
      setCommentField("");
    }
    setDisableComment(false);
  };

  return (
    <div>
      {/* Like button, "comment, share" buttons, settings drop down */}
      <PostActions
        postId={id}
        settings
        likeBtnAction={handleLikes}
        commentBtnAction={focusCommentField}
        isOwner={ownPost}
        hasLiked={hasLiked}
      />

      <div className={classes.statistics}>
        <p className={classes.likeCount}>{numLikes} Likes</p>
        <p className={classes.postedSince}>{timeSince(date)}</p>
      </div>

      {/* Comment field */}
      <form onSubmit={handleCommentSubmit} className={classes.commentField}>
        <FormInput
          type="text"
          placeholder="Add a comment..."
          maxLength="200"
          required
          value={commentField}
          onChange={(e) => setCommentField(e.target.value.trimStart())}
          onBlur={() => setCommentField((prev) => prev.trimEnd())}
          noExternalPadding
          ref={commentRef}
        />

        {/* Disable the following if the textfield is empty */}
        <button
          className={classes.postBtn}
          disabled={
            (!commentField && commentField.length <= 200) || disableComment
          }
          onClick={handleCommentSubmit}
        >
          Post
        </button>
      </form>
    </div>
  );
};
