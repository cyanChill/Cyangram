import dbConnect from "./dbConnect";
import User from "../models/User";
import Post from "../models/Post";
import Like from "../models/Like";
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
    `${getFollower ? "followerId" : "followingId"} -_id`
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

/*
  Get all the posts & popularize with basic data (like count) of a user
  - Returns a promise
*/
const informizePosts = async (post, viewerId) => {
  try {
    const likes = await Like.find({ postId: post._id }, "likerId -_id");
    return Promise.resolve({
      ...post._doc,
      likeCnt: likes.length,
      hasLiked: likes.some((like) => like.likerId.equals(viewerId)),
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getUserPostsAndPopulize = async (userId, viewerId) => {
  try {
    // const threeDaysAgo = Date.now() - 259200000;
    const userInfo = await User.findById(userId, "username name profilePic");
    const userPosts = await Post.find({
      posterId: userId,
      // date: { $lte: threeDaysAgo },
    }).sort({ date: "-1" });

    const informizedPostsPromises = userPosts.map((post) =>
      informizePosts(post, viewerId)
    );
    // Catch block will catch if the Promise.all rejects
    const informizedPosts = await Promise.all(informizedPostsPromises);
    return informizedPosts.map((post) => ({ ...post, userInfo }));
  } catch (err) {
    return Promise.reject(err);
  }
};
