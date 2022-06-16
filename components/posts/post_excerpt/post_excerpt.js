/* 
  This is the post we see on the feed
*/
import Link from "next/link";
import Image from "next/image";

import Username from "../../misc/links/usernameLink";
import PostActions from "../actions/post_actions";
import CommentBody from "../comment/commentBody";

import classes from "./post_excerpt.module.css";

const PostExcerpt = ({ post }) => {
  const { image, description, likeCnt, _id: postId } = post;
  const { profilePic, username, name } = post.userInfo;

  if (!post) {
    return null;
  }

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
      />

      <PostActions postId={postId} redirectPost />

      <span className={classes.likes}>{likeCnt} Likes</span>

      <div className={classes.description}>
        <Username username={username} />
        <span>{description}</span>
      </div>
    </div>
  );
};

export default PostExcerpt;
