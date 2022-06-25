import { getSession } from "next-auth/react";

import dbConnect from "../../../../../lib/dbConnect";
import Follower from "../../../../../models/Follower";
import User from "../../../../../models/User";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: "User is not authenticated." });
    return;
  }

  const { identifier } = req.query;
  if (req.method !== "POST" || !identifier.trim()) {
    res.status(400).json({ message: "Invalid Request/Input." });
    return;
  }

  await dbConnect();

  const followerId = session.user.dbId;
  const followingInfo = await User.findOne({ username: identifier });
  if (!followingInfo) {
    res.status(404).json({ message: "User does not exist." });
    return;
  }

  try {
    const followStruc = {
      followingId: followingInfo._id,
      followerId: followerId,
    };
    const isFollowing = await Follower.findOne(followStruc);

    if (!isFollowing) {
      // Follow the user
      await Follower.create(followStruc);
      res
        .status(200)
        .json({ message: "Successfully followed user.", follow: true });
    } else {
      // Unfollow the user
      await Follower.deleteOne(followStruc);
      res
        .status(200)
        .json({ message: "Successfully unfollowed user.", follow: false });
    }
  } catch (err) {
    res.status(500).json({
      message: "A problem has occurred with following/unfollowing the user.",
      err: err,
    });
  }
};

export default handler;
