import { hash, compare } from "bcrypt";

import dbConnect from "./dbConnect";
import User from "../models/User";
import Post from "../models/Post";
import Like from "../models/Like";
import Comment from "../models/Comment";
import Follower from "../models/Follower";
import Message from "../models/Message";

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                    Password-Related Functions                 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
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

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
            Getting User Infomation For Profile Page                 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
export const getUserInfo = async (username) => {
  if (!username.trim()) throw new Error("Invalid input.");

  await dbConnect();
  const existingUser = await User.findOne({ username });
  if (!existingUser) throw new Error("User does not exist.");

  /* Fetching Posts & order from newest to oldest */
  const userPosts = await Post.find({ posterId: existingUser._id }, "_id");
  // - Get the # of people this user is following
  // - Get the # of people that is following the user
  const [followerList, followingList] = await Promise.all([
    Follower.find({ followingId: existingUser._id }),
    Follower.find({ followerId: existingUser._id }),
  ]);

  return {
    user: JSON.parse(JSON.stringify(existingUser)),
    postCnt: userPosts.length,
    followerList: JSON.parse(JSON.stringify(followerList)),
    followerCnt: followerList.length,
    followingCnt: followingList.length,
  };
};

export const getMinimalUserInfo = async (userId) => {
  if (!userId.trim()) throw new Error("Invalid input.");

  await dbConnect();
  const existingUser = await User.findById(userId);
  if (!existingUser) throw new Error("User does not exist.");

  return { user: JSON.parse(JSON.stringify(existingUser)) };
};

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
         Getting List of Users We Had a Conversation With                 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
const fixedGroupParams = {
  recieverId: { $first: "$recieverId" },
  senderId: { $first: "$senderId" },
  messageContent: { $first: "$messageContent" },
  date: { $first: "$date" },
};

export const getConversationList = async (userId) => {
  if (!userId.trim()) throw new Error("Invalid input.");

  await dbConnect();
  const existingUser = await User.findById(userId);
  if (!existingUser) throw new Error("User does not exist.");

  /* Get the latest message per id */
  const [results1, results2] = await Promise.all([
    // Order by latest message we received from another user
    Message.aggregate([
      { $match: { recieverId: existingUser._id } },
      { $sort: { recieverId: 1, senderId: 1, date: -1 } },
      { $group: { _id: "$senderId", ...fixedGroupParams } },
    ]),
    // Order by latest message we sent to user
    Message.aggregate([
      { $match: { senderId: existingUser._id } },
      { $sort: { recieverId: 1, senderId: 1, date: -1 } },
      { $group: { _id: "$recieverId", ...fixedGroupParams } },
    ]),
  ]);

  const aggregatedUsersIds = [
    ...new Set(
      [...results1, ...results2]
        .sort((a, b) => b.date - a.date)
        .map((user) => user._id.toString())
    ),
  ];

  const getUser = async (userId) => {
    try {
      const conversationUser = await User.findById(userId);
      return Promise.resolve(conversationUser._doc);
    } catch (err) {
      return Promise.reject();
    }
  };

  // To preserve order of users
  const promises = aggregatedUsersIds.map((userId) => getUser(userId));
  const conversationUsers = await Promise.all(promises);

  return { users: JSON.parse(JSON.stringify(conversationUsers)) };
};

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                 Get Information about a Post                 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
export const getPostInfo = async (postId) => {
  if (!postId.trim()) throw new Error("Invalid input.");

  await dbConnect();
  const postInfo = await Post.findById(postId);
  if (!postInfo) throw new Error("Post does not exist.");

  /* Get info on the person who created the post */
  const posterInfo = await User.findById(postInfo.posterId);
  /* Get info on the post (likes & comments */
  const postLikes = await Like.find({ postId: postInfo._id });
  const postComments = await Comment.find({ postId: postInfo._id });

  /* Fetch remaining info for comments (commenter data) */
  const informizeComments = async (comment) => {
    try {
      const commenterInfo = await User.findById(comment.commenterId);
      return Promise.resolve({
        ...comment._doc,
        commenterInfo,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const promises = postComments.map((comment) => informizeComments(comment));
  const commentsData = await Promise.all(promises);

  return {
    post: JSON.parse(
      JSON.stringify({
        ...postInfo._doc,
        posterInfo,
        likes: postLikes,
        comments: commentsData,
      })
    ),
  };
};
