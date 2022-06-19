import { useState, useEffect } from "react";

import global from "../../global";
import { timeSince } from "../../lib/time";
import Comment from "./comment/comment";
import PostActions from "./actions/post_actions";
import BackHeader from "../ui/backheader/backHeader";
import FormInput from "../form_elements/forminput";
import CommentBody from "./comment/commentbody";
import Card from "../ui/card/card";
import LoadImage from "../ui/loadimage/loadimage";

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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: commentField.trim(),
        }),
      }
    );
    const data = await res.json();

    global.alerts.actions.addAlert({
      type: global.alerts.types[res.ok ? "success" : "error"],
      content: data.message,
    });

    // If we successfully created comment, update client-side
    if (res.ok) {
      setComments((prev) => [...prev, data.comment]);
      setCommentField("");
    }
  };

  return (
    <div className={classes.wrapper}>
      {/* Where we put the back button & name of poster */}
      <BackHeader text={username} linkPath={`/${username}`} />

      <Card className={classes.cardClasses}>
        {/* Put the image into a container */}
        <div className={classes.imgContainer}>
          <LoadImage
            src={postData.image.url}
            alt={`Post by ${username}`}
            className={classes.postImg}
            width="500"
            height="500"
            layout="responsive"
            priority
          />
        </div>

        {/* Wraps general content of post */}
        <div className={classes.generalContent}>
          <div className={classes.nonActions}>
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
          </div>

          <div className={classes.action}>
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
            <form
              onSubmit={handleCommentSubmit}
              className={classes.commentField}
            >
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
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostPage;
