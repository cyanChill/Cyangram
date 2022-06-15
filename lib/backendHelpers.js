import dbConnect from "./dbConnect";
import User from "../models/User";
import Follower from "../models/Follower";

/*
  We'll get "type" ("followers" [default] or "following") for user "ofPersonUsername"
  - Returns a promise
*/
export const getFollowList = async (ofPersonUsername, type) => {
  const getFollower = type === "following" ? false : true;

  await dbConnect();

  const user = await User.findOne({ username: ofPersonUsername });
  if (!user) {
    throw new Error("User does not exist.");
  }

  const followList = await Follower.find(
    { [getFollower ? "followingId" : "followerId"]: user._id },
    getFollower ? "followerId" : "followingId"
  );
  const getFollowListInfo = async (user) => {
    try {
      const userInfo = await User.findById(
        user[getFollower ? "followerId" : "followingId"],
        "profilePic username _id name"
      );
      if (!userInfo) {
        throw new Error("User does not exist.");
      }
      return Promise.resolve({ ...userInfo._doc });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  return followList.map((user) => getFollowListInfo(user));
};
