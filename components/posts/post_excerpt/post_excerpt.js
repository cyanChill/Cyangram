/*  This is the post we see on the feed */
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import Username from "../../misc/links/usernameLink";
import PostActions from "../actions/post_actions";
import CommentBody from "../comment/commentbody";
import Card from "../../ui/card/card";

import classes from "./post_excerpt.module.css";

const PostExcerpt = ({ post }) => {
  const router = useRouter();
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
    <Card className={classes.wrapper}>
      <CommentBody
        picUrl={profilePic.url}
        picAlt={`${username}'s profile picture`}
        username={username}
        noContent
        className={classes.padding}
      />

      <Image
        src={image.url}
        alt={`${username}'s post`}
        width="500"
        height="500"
        layout="responsive"
        className={classes.postImg}
        priority
        onClick={() => router.push(`/p/${postId}`)}
      />

      <div className={classes.padding}>
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
    </Card>
  );
};

export default PostExcerpt;
