import { getSession } from "next-auth/react";

import { bucket } from "../../../firebaseAdmin.config";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import Post from "../../../models/Post";
import Comment from "../../../models/Comment";
import Follower from "../../../models/Follower";
import Like from "../../../models/Like";
import Message from "../../../models/Message";

const handler = async (req, res) => {
  // Verify User is the admin
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: "User is not authenticated." });
    return;
  }
  if (session.user.dbId !== process.env.ADMIN_ID) {
    res.status(401).json({ message: "User is not an admin." });
  }

  const { type } = req.query;
  const { id } = req.body;
  const invalidQueries = (type !== "user" && type !== "comment") || !id.trim();
  if (req.method !== "DELETE" || invalidQueries) {
    res.status(400).json({ message: "Invalid Request/Input." });
    return;
  }

  await dbConnect();
  try {
    switch (type) {
      case "user":
        /* Verify User Exists */
        const user = await User.findById(id);
        if (!user) throw new Error("User doesn't exist");

        /* Get all of user's posts */
        const ourPosts = await Post.find({ posterId: user._id });
        const deletePostData = async (postId) => {
          try {
            /* Delete all likes & comments for the post and the post itself*/
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
        const postDeletionPromises = ourPosts.map((post) => {
          deletePostData(post._id);
        });

        await Promise.all([
          ...postDeletionPromises,
          Follower.deleteMany({
            $or: [{ followerId: user._id }, { followingId: user._id }],
          }),
          Message.deleteMany({
            $or: [{ recieverId: user._id }, { senderId: user._id }],
          }),
          Like.deleteMany({ likerId: user._id }),
          Comment.deleteMany({ commenterId: user._id }),
          bucket.deleteFiles({ prefix: `${user._id}/` }),
          User.findByIdAndDelete(user._id),
        ]);

        break;

      case "comment":
        const commentInfo = await Comment.findById(id);
        if (!commentInfo) {
          res.status(404).json({ message: "Comment not found." });
          return;
        }
        await Comment.findByIdAndDelete(id);

        break;
    }

    res.status(200).json({ message: `Successfully deleted ${type}.` });
  } catch (err) {
    res.status(500).json({ message: `Failed to delete ${type}.`, err: err });
  }
};

export default handler;
