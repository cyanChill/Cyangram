import { getUserPostsAndPopulize } from "../../../../lib/backendHelpers";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import Follower from "../../../../models/Follower";

const handler = async (req, res) => {
  const { identifier } = req.query;
  if (req.method !== "GET" || !identifier.trim()) {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  await dbConnect();

  const user = await User.findOne({ username: identifier });
  if (!user) {
    res.status(404).json({ message: "User does not exist." });
    return;
  }

  /* Fetching people that we're following */
  const following = await Follower.find(
    { followerId: user._id },
    "followingId -_id"
  );
  const followingIds = following.map((user) => user.followingId);
  followingIds.push(user._id); // To ignore ourselves in the search for not following

  /* Get the ids of all users that doesn't include the ids we're following */
  const notFollowingUsers = await User.find(
    { _id: { $nin: followingIds } },
    "_id"
  );

  const notFollowingPostsPromises = notFollowingUsers.map((notFollowUser) =>
    getUserPostsAndPopulize(notFollowUser._id, user._id)
  );

  try {
    const resolvedPromises = await Promise.all(notFollowingPostsPromises);
    /* Merge Posts found & sort by date */
    const mergedAndSorted = [].concat
      .apply([], resolvedPromises)
      .sort((a, b) => b.date - a.date);

    res.status(200).json({
      message: "Successfully obtained feed posts.",
      feedPosts: mergedAndSorted,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get feed posts.", err: err });
  }
};

export default handler;
