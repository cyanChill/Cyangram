import { useState } from "react";
import { useRouter } from "next/router";

import UsernameLink from "../../misc/links/usernameLink";
import PostActions from "../actions/postActions";
import CommentBody from "../comment/commentBody";
import Card from "../../ui/card/card";
import LoadImage from "../../ui/loadImage/loadImage";
import classes from "./postExcerpt.module.css";

/*  This is the post we see on the feed */
const PostExcerpt = ({ post }) => {
  const router = useRouter();
  const { image, description, likeCnt, _id: postId, hasLiked } = post;
  const { profilePic, username } = post.userInfo;

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

      <LoadImage
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
          {description && (
            <>
              <UsernameLink username={username} />
              <span>{description}</span>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PostExcerpt;
