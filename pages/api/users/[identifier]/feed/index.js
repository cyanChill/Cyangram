import { getUserPostsAndPopulize } from "../../../../../lib/backendHelpers";
import dbConnect from "../../../../../lib/dbConnect";
import User from "../../../../../models/User";
import Follower from "../../../../../models/Follower";

const handler = async (req, res) => {
  // Would use SEARCH method if supported (correct verb)
  const { identifier: username, type, fromDate, amount } = req.query;
  if (req.method !== "POST" || (type !== "discover" && type !== "follow")) {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }
  const { usedIds } = req.body;

  await dbConnect();

  /* See if the "username" identifier is an actual user */
  const user = await User.findOne({ username: username });
  if (!user) {
    res.status(404).json({ message: "User does not exist." });
    return;
  }
  /* Fetching people that's the user is following */
  const following = await Follower.find(
    { followerId: user._id },
    "followingId -_id"
  );
  const followIds = following.map((user) => user.followingId);
  /* To ignore ourselves in the search for not following */
  if (type === "discover") followIds.push(user._id);

  /* Get the ids of all users that doesn't include the ids we're following */
  const notFollowUsers = await User.find({ _id: { $nin: followIds } }, "_id");
  const notFollowIds = notFollowUsers.map((user) => user._id);

  const useUserIds = type === "follow" ? followIds : notFollowIds;
  if (useUserIds.length === 0) {
    res.status(200).json({
      message: "Successfully found all feed posts.",
      newData: [],
      newIds: [],
    });
    return;
  }

  try {
    const { results, usedPostIds, error } = await getUserPostsAndPopulize(
      useUserIds,
      user._id,
      usedIds,
      fromDate,
      amount
    );

    if (error) throw new Error(error);

    res.status(200).json({
      message: "Successfully found post data.",
      newData: results,
      newIds: usedPostIds,
    });
  } catch (err) {
    res.status(500).json({
      message: "A problem has occurred while fetching feed posts.",
      err: err,
    });
  }
};

export default handler;
