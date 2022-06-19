import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineDelete } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BiDotsHorizontalRounded } from "react-icons/bi";

import global from "../../../global";
import Button from "../../form_elements/button";
import DropDownMenu from "../../ui/dropdown/dropdown";
import DropDownItem from "../../ui/dropdown/dropdownitem";
import SharePostBtn from "./sharepostbtn";
import Modal from "../../ui/modal/modal";

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
    const data = await res.json();

    if (!res.ok) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: data.message,
      });
      return;
    }

    /* TODO: Add animation for when we change like icons */
    likeBtnAction(method === "POST" ? "ADD" : "SUB");
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
          {isLiked ? (
            <AiFillHeart className={classes.liked} />
          ) : (
            <AiOutlineHeart className={classes.unliked} />
          )}
        </div>
        <FaRegComment onClick={redirectPost ? gotoPost : commentBtnAction} />
      </div>

      {extras}
    </div>
  );
};

export default PostActions;

const OwnerSettings = ({ postId, isOwner }) => {
  const router = useRouter();

  const [modalActive, setModalActive] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ddDisplayStatus, setddDisplayStatus] = useState(false);

  const handlePostDelete = async () => {
    setIsDeleting(true);
    const res = await fetch(`/api/post/${postId}`, { method: "DELETE" });
    const data = await res.json();

    global.alerts.actions.addAlert({
      type: global.alerts.types[res.ok ? "success" : "error"],
      content: data.message,
    });
    // If we deleted successfully, returned to home feed
    if (res.ok) {
      router.replace("/");
    }
  };

  return (
    <>
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
              onClick={() => setModalActive(true)}
            >
              <AiOutlineDelete />
              <span>Delete Post</span>
            </DropDownItem>
          )}
        </DropDownMenu>
      </div>

      {/* Delete confirmation modal */}
      <Modal active={modalActive}>
        <p className={classes.modalText}>Confirm Post Deletion?</p>
        <div className={classes.modalActions}>
          <Button
            className={classes.modalBtn}
            onClick={() => setModalActive(false)}
            disabled={isDeleting}
            outline
          >
            Cancel
          </Button>
          <Button
            className={classes.modalBtn}
            onClick={handlePostDelete}
            disabled={isDeleting}
            variant="error"
            outline
          >
            Ok
          </Button>
        </div>
      </Modal>
    </>
  );
};
