import NoPost from "../no_posts/nopost";
import classes from "./post_grid.module.css";
import PostPreview from "./post_preview";

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
