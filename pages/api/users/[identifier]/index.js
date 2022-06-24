import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import Post from "../../../../models/Post";
import Follower from "../../../../models/Follower";

const handler = async (req, res) => {
  const { identifier } = req.query;
  if (req.method !== "GET" || !identifier.trim()) {
    res.status(400).json({ message: "Invalid Request/Input." });
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
  const userPosts = await Post.find({ posterId: existingUser._id }, "_id");
  try {
    // - Get the # of people this user is following
    // - Get the # of people that is following the user
    const [followerList, followingList] = await Promise.all([
      Follower.find({ followingId: existingUser._id }),
      Follower.find({ followerId: existingUser._id }),
    ]);

    res.status(200).json({
      message: "Successfully found user data.",
      user: existingUser,
      postCnt: userPosts.length,
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
