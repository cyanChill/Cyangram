import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import Post from "../../../../models/Post";
import Like from "../../../../models/Like";
import Comment from "../../../../models/Comment";
import Follower from "../../../../models/Follower";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  const { identifier } = req.query;
  if (!identifier.trim()) {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  await dbConnect();

  // See if username exists
  const existingUser = await User.findOne({ username: identifier });
  if (!existingUser) {
    res.status(404).json({ message: "User does not exist." });
    return;
  }

  /* Fetching Posts & order from newest to oldest */
  const userPosts = await Post.find({ posterId: existingUser._id }).sort({
    date: "-1",
  });
  /* Fetch info such as comments count for each posts*/
  const informizePosts = async (post) => {
    try {
      const likes = await Like.find({ postId: post._id });
      const comments = await Comment.find({ postId: post._id });

      return Promise.resolve({
        ...post._doc,
        likes: likes.length,
        comments: comments.length,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  try {
    const postPromises = userPosts.map((post) => informizePosts(post));
    const postsData = await Promise.all(postPromises);
    /* 
      - Get the # of people this user is following
      - Get the # of people that is following the user
    */
    const [followerList, followingList] = await Promise.all([
      Follower.find({ followingId: existingUser._id }),
      Follower.find({ followerId: existingUser._id }),
    ]);

    res.status(200).json({
      message: "Successfully found user data.",
      user: existingUser,
      posts: postsData,
      followerList: followerList,
      followerCnt: followerList.length,
      followingCnt: followingList.length,
    });
  } catch (err) {
    res.status(500).json({
      message:
        "A problem has occurred while fetching like & comment data for posts.",
      err: err,
    });
  }
};

export default handler;
