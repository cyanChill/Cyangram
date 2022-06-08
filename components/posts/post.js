/* 
  The main Post component which displays comments, the post, etc.
    - Allows user to comment, like, etc (given they're logged in)

  Post Page (With Comments and Such):
    - Can probably reuse the "post_excerpt.js" component as the basis (as it has the likes & description stuff)
*/
import { useState, useEffect } from "react";
import Image from "next/image";

import { timeSince } from "../../lib/time";
import Comment from "./comment/comment";
import PostActions from "./actions/post_actions";
import Username from "../misc/links/usernameLink";
import BackHeader from "../ui/backheader/backHeader";
import Button from "../form_elements/button";
import FormInput from "../form_elements/forminput";

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
      console.log("Cannot submit empty comment.");
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
      console.log(`An error has occurred: ${data.nessage}`);
      return;
    }

    console.log("Successfully added comment to post");
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
        <div className={classes.postDescription}>
          <div className={classes.profilePicContainer}>
            <Image
              src={postData.posterInfo.profilePic.url}
              alt={`${postData.posterInfo.username} profile pic`}
              height="500"
              width="500"
              layout="responsive"
              className={classes.rounded}
            />
          </div>
          <Username username={username} className={classes.usernameLink} />
          <p>{postData.description}</p>
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
        <Button
          variant="clear"
          className={classes.postBtn}
          disabled={!commentField}
          onClick={handleCommentSubmit}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default PostPage;
