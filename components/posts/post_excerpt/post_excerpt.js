/* 
  This is the post we see on the feed
*/
import { useState } from "react";
import Image from "next/image";

import Username from "../../misc/links/usernameLink";
import PostActions from "../actions/post_actions";
import CommentBody from "../comment/commentBody";

import classes from "./post_excerpt.module.css";

const PostExcerpt = ({ post }) => {
  const { image, description, likeCnt, _id: postId, hasLiked } = post;
  const { profilePic, username, name } = post.userInfo;

  const [numLikes, setNumLikes] = useState(likeCnt);

  if (!post) {
    return null;
  }

  const handleLikes = (action) => {
    if (action === "ADD") {
      setNumLikes((prev) => prev + 1);
    } else if (action === "SUB") {
      setNumLikes((prev) => prev - 1);
    }
  };

  return (
    <div className={classes.post}>
      <CommentBody
        picUrl={profilePic.url}
        picAlt={`${username}'s profile picture`}
        username={username}
        noContent
      />

      <Image
        src={image.url}
        alt={`${username}'s post`}
        width="500"
        height="500"
        layout="responsive"
        className={classes.postImg}
        priority
      />

      <PostActions
        postId={postId}
        likeBtnAction={handleLikes}
        hasLiked={hasLiked}
        redirectPost
      />

      <span className={classes.likes}>{numLikes} Likes</span>

      <div className={classes.description}>
        <Username username={username} />
        <span>{description}</span>
      </div>
    </div>
  );
};

export default PostExcerpt;
