import { getSession } from "next-auth/react";

import dbConnect from "../../../../lib/dbConnect";
import Follower from "../../../../models/Follower";
import User from "../../../../models/User";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  await dbConnect();

  const followingInfo = await User.findOne({ username: req.query.identifier });
  if (!followingInfo) {
    res.status(404).json({ message: "User does not exist." });
    return;
  }

  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ message: "User is not authenticated" });
    return;
  }
  const followerId = session.user.dbId;

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
      errMsg: err,
    });
  }
};

export default handler;
