/* 
  This is the post we see on the feed
*/
import Link from "next/link";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

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

      <div className={classes.postImgs}>
        <img src={postImg} />
      </div>

      <div className={classes.actions}>
        <AiFillHeart />
        <FaRegComment />
        <FiSend />
      </div>

      <span className={classes.likes}>{likeCnt} Likes</span>

      <div className={classes.description}>
        <span>{uploader.username}</span>
        <span>{description}</span>
      </div>
    </div>
  );
};

export default PostExcerpt;
