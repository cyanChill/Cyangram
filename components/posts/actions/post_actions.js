import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { AiFillHeart, AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";

import classes from "./post_actions.module.css";

const PostActions = ({
  postId,
  isOwner,
  settings,
  redirectPost,
  liked,
  handleComment,
  handleLike,
  viewerId,
}) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(liked);

  const updateLike = async () => {
    let method = "POST";
    if (isLiked) {
      method = "DELETE";
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${postId}/like`,
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likerId: viewerId }),
      }
    );

    if (!res.ok) {
      console.log(
        `Something went wrong with ${
          method === "POST" ? "liking" : "unliking"
        } the post`
      );
      return;
    }

    /* 
      Add animation for when we change like icons
    */
    handleLike(method === "POST" ? "ADD" : "SUB");
    // After updating server-side, we update client-side
    setIsLiked((prevLike) => !prevLike);
  };

  const gotoPost = () => {
    if (router.asPath === "/") {
      router.push(`/p/${postId}`);
    }
  };

  const sendToClipboard = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASE_URL}/p/${postId}`
    );
    /* Display mini alert saying we've copied link to clipboard */
    console.log("Copied post link to clipboard");
  };

  const extras = settings ? (
    <OwnerSettings />
  ) : (
    <AiOutlineShareAlt className={classes.extra} onClick={sendToClipboard} />
  );

  return (
    <div className={classes.actions}>
      <div className={classes.mainActions}>
        <div onClick={updateLike}>
          {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
        </div>
        <FaRegComment onClick={redirectPost ? gotoPost : handleComment} />
      </div>

      {extras}
    </div>
  );
};

export default PostActions;

const OwnerSettings = () => {
  /* 
    "..." component which reveals dropdown with extra settings
    (ie: delete post)
  */
  return <div className={classes.settings}>...</div>;
};
