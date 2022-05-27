import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { AiFillHeart, AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

import classes from "./post_actions.module.css";

const PostActions = ({ postId, isOwner, settings, liked }) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(liked);

  const updateLike = async () => {
    /* 
      Send API request to API route to update like for this post 
        - We do this by adding/removing an item from say a "Likes" collection
        which has entries which contain postId & likeUserId
    */

    /* 
      Add animation for when we change like icons
    */

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
      `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`
    );

    /* 
      Display mini alert saying we've copied link to clipboard
    */
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
        <FaRegComment onClick={gotoPost} />
        <FiSend onClick={gotoPost} />
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
