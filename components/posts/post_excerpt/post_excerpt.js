/* 
  This is the post we see on the feed
*/
import Link from "next/link";
import Username from "../../misc/links/usernameLink";
import PostActions from "../actions/post_actions";

import classes from "./post_excerpt.module.css";

const PostExcerpt = ({ post }) => {
  const { postId, uploader, postImg, description, likeCnt } = post;

  if (!post) {
    return null;
  }

  return (
    <div className={classes.post}>
      <header>
        <img src={uploader.profilePic} alt={uploader.username} />
        <Link href={`/${uploader.username}`}>{uploader.username}</Link>
      </header>

      <img src={postImg} className={classes.postImg} />

      <PostActions postId={postId} />

      <span className={classes.likes}>{likeCnt} Likes</span>

      <div className={classes.description}>
        <Username username={uploader.username} />
        <span>{description}</span>
      </div>
    </div>
  );
};

export default PostExcerpt;
