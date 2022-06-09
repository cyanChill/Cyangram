import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineDelete } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BiDotsHorizontalRounded } from "react-icons/bi";

import global from "../../../global";
import { deleteImg } from "../../../lib/firebaseHelpers";
import DropDownMenu from "../../ui/dropdown/dropdown";
import DropDownItem from "../../ui/dropdown/dropdownitem";
import SharePostBtn from "./sharepostbtn";

import classes from "./post_actions.module.css";

const PostActions = ({
  postId,
  isOwner,
  settings,
  redirectPost,
  likeBtnAction,
  commentBtnAction,
  hasLiked,
}) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(hasLiked);

  const updateLike = async () => {
    let method = "POST";
    if (isLiked) {
      method = "DELETE";
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${postId}/like`,
      { method: method }
    );

    if (!res.ok) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: `Something went wrong with ${
          method === "POST" ? "liking" : "unliking"
        } the post.`,
      });
      return;
    }

    /* 
      Add animation for when we change like icons
    */
    likeBtnAction(method === "POST" ? "ADD" : "SUB");
    // After updating server-side, we update client-side
    setIsLiked((prevLike) => !prevLike);
  };

  const gotoPost = () => {
    if (router.asPath === "/") {
      router.push(`/p/${postId}`);
    }
  };

  const extras = settings ? (
    <OwnerSettings postId={postId} isOwner={isOwner} />
  ) : (
    <SharePostBtn postId={postId} />
  );

  return (
    <div className={classes.actions}>
      <div className={classes.mainActions}>
        <div onClick={updateLike}>
          {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
        </div>
        <FaRegComment onClick={redirectPost ? gotoPost : commentBtnAction} />
      </div>

      {extras}
    </div>
  );
};

export default PostActions;

/* TODO: Add modal for deletion confirmation */
const OwnerSettings = ({ postId, isOwner }) => {
  const router = useRouter();

  const [ddDisplayStatus, setddDisplayStatus] = useState(false);

  const handlePostDelete = async () => {
    const res = await fetch(`/api/post/${postId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: `Failed to delete post (${data.errMsg})`,
      });
    } else {
      deleteImg(data.postOwnerId, data.postImgId);
      global.alerts.actions.addAlert({
        type: global.alerts.types.success,
        content: "Deleted post.",
      });
      router.replace("/");
    }
  };

  return (
    <div onClick={() => setddDisplayStatus((prev) => !prev)}>
      <BiDotsHorizontalRounded className={classes.ddTrigger} />
      <DropDownMenu
        arrowPosition="right"
        openFromDirection="bottom"
        display={ddDisplayStatus}
      >
        <DropDownItem>
          <SharePostBtn postId={postId}>Share</SharePostBtn>
        </DropDownItem>
        {isOwner && (
          <DropDownItem
            className={classes.deleteBtn}
            onClick={handlePostDelete}
          >
            <AiOutlineDelete />
            <span>Delete Post</span>
          </DropDownItem>
        )}
      </DropDownMenu>
    </div>
  );
};
