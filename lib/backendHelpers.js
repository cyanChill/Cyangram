/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                    Password-Related Functions                 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
import { hash, compare } from "bcrypt";

export const hashPassword = async (password) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

export const verifyPassword = async (password, hashedPassword) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                    Database-Related Functions                 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
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
    const user = await User.findById(post.posterId);
    const likes = await Like.find({ postId: post._id }, "likerId -_id");
    return Promise.resolve({
      ...post._doc,
      userInfo: user._doc,
      likeCnt: likes.length,
      hasLiked: likes.some((like) => like.likerId.equals(viewerId)),
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getUserPostsAndPopulize = async (
  getPostsFromUserIds,
  viewerId,
  foundPostIds,
  fromDate,
  fetchAmount
) => {
  try {
    const foundPosts = await Post.find({
      _id: { $nin: foundPostIds },
      posterId: { $in: getPostsFromUserIds },
      date: { $lt: fromDate },
    })
      .sort({ date: "-1" })
      .limit(fetchAmount);

    const usedPostIds = foundPosts.map((post) => post._id);

    const informizedPostsPromises = foundPosts.map((post) =>
      informizePosts(post, viewerId)
    );

    // Catch block will catch if the Promise.all rejects
    const informizedPosts = await Promise.all(informizedPostsPromises);
    return {
      results: informizedPosts,
      usedPostIds: usedPostIds,
    };
  } catch (err) {
    return { error: err };
  }
};
