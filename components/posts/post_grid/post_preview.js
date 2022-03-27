import { useRouter } from "next/router";
import Image from "next/image";

import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import classes from "./post_preview.module.css";

const PostPreview = ({ postInfo }) => {
  const router = useRouter();

  return (
    <div
      className={classes.post}
      onClick={() => router.push(`p/${postInfo.postId}`)}
    >
      <div className={classes.overlay}>
        <div>
          <AiFillHeart />
          <span>{postInfo.likeCnt}</span>
        </div>
        <div>
          <FaComment className={classes.iconflip} />
          <span>{postInfo.commentCnt}</span>
        </div>
      </div>
      <Image
        src={postInfo.coverImg}
        alt=""
        height={500}
        width={500}
        layout="responsive"
      />
    </div>
  );
};

export default PostPreview;
