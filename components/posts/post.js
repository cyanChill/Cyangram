/* 
  The main Post component which displays comments, the post, etc.
    - Allows user to comment, like, etc (given they're logged in)

  Post Page (With Comments and Such):
    - Can probably reuse the "post_excerpt.js" component as the basis (as it has the likes & description stuff)
*/
import { useState } from "react";
import Image from "next/image";

import { timeSince } from "../../lib/time";
import Comment from "./comment/comment";
import PostActions from "./actions/post_actions";
import Username from "../misc/links/usernameLink";
import BackHeader from "../ui/backheader/backHeader";

import classes from "./post.module.css";

/* 
  TODO:
    - Style the commenting field
    - Have functioning commenting
*/

const PostPage = ({ postData, ownPost, hasLiked, viewerId }) => {
  const username = postData.posterInfo.username;
  const postedSince = timeSince(postData.date);

  const [numLikes, setNumLikes] = useState(postData.likes.length);

  const focusCommentField = () => {
    document.getElementById("commentField").focus();
  };

  const handleLikes = (action) => {
    if (action === "ADD") {
      setNumLikes((prev) => prev + 1);
    } else if (action === "SUB") {
      setNumLikes((prev) => prev - 1);
    }
  };

  return (
    <div>
      {/* Where we put the back button & name of poster */}
      <BackHeader text={username} linkPath={`/${username}`} />

      {/* Images (Gallary Component?) */}
      <Image
        src={postData.image.url}
        alt={`Post by ${username}`}
        className={classes.postImg}
        width="500"
        height="500"
        layout="responsive"
        priority
      />

      {/* Post Description */}
      {!!postData.description.trim() && (
        <p className={classes.postDescription}>
          <Username username={username} />
          {postData.description}
        </p>
      )}
      <hr />

      {/* Div with scrollable containing comments */}
      <div className={classes.commentContainer}>
        {postData.comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>

      {/* Like button, "comment, share" buttons, settings drop down */}
      <PostActions
        postId={postData._id}
        settings
        handleComment={focusCommentField}
        handleLike={handleLikes}
        liked={hasLiked}
        viewerId={viewerId}
      />
      {/* Like Count - display list of people who liked in different window*/}
      <p className={classes.likeCount}>{numLikes} Likes</p>

      {/* Since since posted */}
      <p className={classes.postedSince}>{postedSince}</p>

      <hr />

      {/* Comment field */}
      <div className={classes.commentField}>
        <input id="commentField" type="text" placeholder="Add a comment..." />

        {/* Disable the following if the textfield is empty */}
        <span>Post</span>
      </div>
    </div>
  );
};

export default PostPage;
