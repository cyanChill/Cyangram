import { useRouter } from "next/router";
import { AiOutlineCamera, AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";

import LoadImage from "../../ui/loadImage/loadImage";
import classes from "./postGrid.module.css";

const PostGrid = ({ posts }) => {
  if (posts.length == 0) {
    return <NoPost />;
  }
  return (
    <div className={classes.container}>
      {posts.map((post) => (
        <PostPreview key={post._id} postInfo={post} />
      ))}
    </div>
  );
};

export default PostGrid;

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                       No Post Component
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
const NoPost = () => {
  return (
    <div className={classes.nopost}>
      <div className={classes.noposticon}>
        <AiOutlineCamera />
      </div>
      <p>No Posts Yet</p>
    </div>
  );
};

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                    Post Preview Component
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
const PostPreview = ({ postInfo }) => {
  const router = useRouter();

  return (
    <div
      className={classes.post}
      onClick={() => router.push(`p/${postInfo._id}`)}
    >
      <div className={classes.overlay}>
        <div>
          <AiFillHeart />
          <span>{postInfo.likes}</span>
        </div>
        <div>
          <FaComment className={classes.iconflip} />
          <span>{postInfo.comments}</span>
        </div>
      </div>
      <LoadImage
        src={postInfo.image.url}
        alt=""
        height={500}
        width={500}
        layout="responsive"
        priority
        className={classes.previewImg}
      />
    </div>
  );
};
