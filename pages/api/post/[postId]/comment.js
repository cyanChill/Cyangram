import { getSession } from "next-auth/react";

import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import Post from "../../../../models/Post";
import Comment from "../../../../models/Comment";

const handler = async (req, res) => {
  const method = req.method;
  const { postId } = req.query;

  if (method !== "POST" && method !== "DELETE") {
    return;
  }

  const session = await getSession({ req: req });
  const commenterId = session.user.dbId;

  await dbConnect();

  const postExists = await Post.findById(postId);
  if (!postExists) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  const userExists = await User.findById(commenterId);
  if (!userExists) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  switch (method) {
    case "POST":
      const commentContent = req.body.comment;

      try {
        const commentEntry = {
          postId: postId,
          commenterId: commenterId,
          content: commentContent,
          date: Date.now(),
        };

        const result = await Comment.create(commentEntry);
        const commenterInfo = await User.findById(commenterId);

        res.status(200).json({
          message: "Successfully commented on post",
          comment: { ...result._doc, commenterInfo },
        });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Internal Server Error.", errMsg: err });
      }
      return;
    case "DELETE":
      const commentId = req.body.commentId;

      /* Verify Deleter of Comment in Fact Made Comment */
      const commentInfo = await Comment.findById(commentId);

      if (!commentInfo) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }

      if (commentInfo.commenterId != commenterId) {
        res
          .status(401)
          .json({ message: "You cannot delete a comment you have not made." });
        return;
      }

      try {
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Successfully deleted comment" });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Internal Server Error.", errMsg: err });
      }
      return;
  }
};

export default handler;
