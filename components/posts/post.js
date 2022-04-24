/* 
  The main Post component which displays comments, the post, etc.
    - Allows user to comment, like, etc (given they're logged in)

  Post Page (With Comments and Such):
    - Can probably reuse the "post_excerpt.js" component as the basis (as it has the likes & description stuff)
*/
const DUMMY_POST = {
  postId: "p1",
  uploader: {
    username: "michaelPhelps",
    profilePic: "https://randomuser.me/api/portraits/women/19.jpg",
  },
  postImg:
    "https://d279m997dpfwgl.cloudfront.net/wp/2020/05/pencil-standardized-test.jpg",
  /*
  postImgs: [
    "https://d279m997dpfwgl.cloudfront.net/wp/2020/05/pencil-standardized-test.jpg",
  ],
  */
  description: "This is a test post",
  likeCnt: 100,
  postDate: 1619583459,
};

const DUMMY_COMMENTS = [
  {
    commentId: "c1",
    poster: {
      id: "u1",
      username: "TestUser1sdfgggggggggggggggggggggggggggggggggg",
      image: "https://randomuser.me/api/portraits/men/19.jpg",
    },
    content: "This is a test comment for this post from Test User 1",
    commentDate: 1650050000, // April 15, 2022
  },
  {
    commentId: "c2",
    poster: {
      id: "u2",
      username: "JohnDoe",
      image: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    content: "Hello, this is John Doe",
    commentDate: 1636583459, // November 10, 2021
  },
  {
    commentId: "c3",
    poster: {
      id: "u3",
      username: "JaneAdams",
      image: "https://randomuser.me/api/portraits/women/19.jpg",
    },
    content: "Hi there, this is Jane!",
    commentDate: 1622853459, // June 4, 2021
  },
  {
    commentId: "c4",
    poster: {
      id: "u3",
      username: "BobDylan",
      image: "https://randomuser.me/api/portraits/men/60.jpg",
    },
    content: "Hi there, this is Jane!",
    commentDate: 1622853459, // June 4, 2021
  },
  {
    commentId: "c5",
    poster: {
      id: "u3",
      username: "WilliamWallace",
      image: "https://randomuser.me/api/portraits/men/91.jpg",
    },
    content: "Hi there, this is Jane!",
    commentDate: 1622853459, // June 4, 2021
  },
  {
    commentId: "c6",
    poster: {
      id: "u3",
      username: "JohnSmith",
      image: "https://randomuser.me/api/portraits/men/10.jpg",
    },
    content: "Hi there, this is Jane!",
    commentDate: 1622853459, // June 4, 2021
  },
];

import Comment from "./comment/comment";
import PostActions from "./actions/post_actions";
import Username from "../misc/links/usernameLink";

import { timeSince } from "../../lib/time";

import classes from "./post.module.css";
import BackHeader from "../ui/backheader/backHeader";

const PostPage = () => {
  const postedSince = timeSince(DUMMY_POST.postDate);

  return (
    <div>
      {/* Where we put the back button & name of poster */}
      <BackHeader
        text={DUMMY_POST.uploader.username}
        linkPath={`/${DUMMY_POST.uploader.username}`}
      />

      {/* Images (Gallary Component?) */}
      <img src={DUMMY_POST.postImg} className={classes.postImg} />

      {/* Post Description */}
      {DUMMY_POST.description.trim() && (
        <p className={classes.postDescription}>
          <Username username={DUMMY_POST.uploader.username} />
          {DUMMY_POST.description}
        </p>
      )}
      <hr />

      {/* Div with scrollable containing comments */}
      <div className={classes.commentContainer}>
        {DUMMY_COMMENTS.map((comment) => (
          <Comment key={comment.commentId} comment={comment} />
        ))}
      </div>

      {/* Like button, "comment, share" buttons, settings drop down */}
      <PostActions postId={DUMMY_POST.postId} settings />
      {/* Like Count - display list of people who liked in different window*/}
      <p className={classes.likeCount}>{DUMMY_POST.likeCnt} Likes</p>

      {/* Since since posted */}
      <p className={classes.postedSince}>{postedSince}</p>

      <hr />

      {/* Comment field */}
      <div className={classes.commentField}>
        <input type="text" placeholder="Add a comment..." />

        {/* Disable the following if the textfield is empty */}
        <span>Post</span>
      </div>
    </div>
  );
};

export default PostPage;

export const getServerSideProps = async (context) => {};
