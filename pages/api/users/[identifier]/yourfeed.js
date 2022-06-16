import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import Follower from "../../../../models/Follower";
import Post from "../../../../models/Post";
import Like from "../../../../models/Like";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(400).json({ message: "Invalid Request" });
    return;
  }

  const { identifier } = req.query;
  if (!identifier.trim()) {
    res.status(400).json({ message: "Invalid Request" });
    return;
  }

  await dbConnect();

  const user = await User.findOne({ username: identifier });
  if (!user) {
    res.status(404).json({ message: "User does not exist." });
    return;
  }

  /* Fetching people that's the user is following */
  const following = await Follower.find(
    { followerId: user._id },
    "followingId -_id"
  );
  // console.log("-=-=- Following -=-=-");
  // console.log(following);

  const informizePosts = async (post) => {
    try {
      const likes = await Like.find({ postId: post._id });
      return Promise.resolve({
        ...post._doc,
        likeCnt: likes.length,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const getFollowingPosts = async (userId) => {
    try {
      const threeDaysAgo = Date.now() - 259200000;
      const userInfo = await User.findById(userId, "username name profilePic");
      const userPosts = await Post.find({
        posterId: userId,
        //date: { $lte: threeDaysAgo },
      }).sort({ date: "-1" });

      const informizedPostsPromises = userPosts.map((post) =>
        informizePosts(post)
      );
      const informizedPosts = await Promise.all(informizedPostsPromises);
      return informizedPosts.map((post) => ({ ...post, userInfo }));
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const followingPosts = following.map((user) =>
    getFollowingPosts(user.followingId)
  );

  try {
    const resolvedPromises = await Promise.all(followingPosts);
    // console.log("-=-=- Retrieved Posts -=-=-");
    // console.log(resolvedPromises);

    /* Merge Posts found & sort by date */
    const mergedAndSorted = [].concat
      .apply([], resolvedPromises)
      .sort((a, b) => b.date - a.date);
    // console.log("-=-=- MergedAndSorted -=-=-");
    // console.log(mergedAndSorted);
    res.status(200).json({
      message: "Successfully obtained feed posts.",
      feedPosts: mergedAndSorted,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get feed posts.", errMsg: err });
  }
};

export default handler;
