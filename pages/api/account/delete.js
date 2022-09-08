import { getSession } from "next-auth/react";

import { bucket } from "../../../firebaseAdmin.config";
import dbConnect from "../../../lib/dbConnect";
import Comment from "../../../models/Comment";
import Follower from "../../../models/Follower";
import Like from "../../../models/Like";
import Post from "../../../models/Post";
import User from "../../../models/User";
import Message from "../../../models/Message";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: "User is not authenticated." });
    return;
  }

  if (req.method !== "DELETE") {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  await dbConnect();

  const userId = session.user.dbId;
  /* Get all of our posts */
  const ourPosts = await Post.find({ posterId: userId });

  const deletePostData = async (postId) => {
    try {
      /* Delete all likes & comments for the post and the post itself */
      await Promise.all([
        Like.deleteMany({ postId: postId }),
        Comment.deleteMany({ postId: postId }),
        Post.findByIdAndDelete(postId),
      ]);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const postDeletionPromises = ourPosts.map((post) => deletePostData(post._id));
  try {
    /* 
      - Delete all post data (their comments & likes & post itself)
      - Removing all follows of people we're following and all followers
      - Remove all of our likes & comments
      - Remove all messages related to use
      - Delete the folder containing all of our images for this user
      - Delete user's firebase account
      - Delete our user data
    */
    await Promise.all([
      ...postDeletionPromises,
      Follower.deleteMany({
        $or: [{ followerId: userId }, { followingId: userId }],
      }),
      Message.deleteMany({
        $or: [{ recieverId: userId }, { senderId: userId }],
      }),
      Like.deleteMany({ likerId: userId }),
      Comment.deleteMany({ commenterId: userId }),
      bucket.deleteFiles({ prefix: `${userId}/` }),
      User.findByIdAndDelete(userId),
    ]);

    res.status(200).json({ message: "User successfully deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user data.", err: err });
    return;
  }
};

export default handler;
