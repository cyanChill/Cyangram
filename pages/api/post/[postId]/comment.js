import { getSession } from "next-auth/react";
import Filter from "bad-words";

import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import Post from "../../../../models/Post";
import Comment from "../../../../models/Comment";

const handler = async (req, res) => {
  const method = req.method;
  if (method !== "POST" && method !== "DELETE") {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ message: "User is not authenticated." });
    return;
  }
  const commenterId = session.user.dbId;

  await dbConnect();

  const { postId } = req.query;
  const postExists = await Post.findById(postId);
  if (!postExists) {
    res.status(404).json({ message: "Post not found." });
    return;
  }

  switch (method) {
    case "POST":
      const commentContent = req.body.comment.trim();
      if (commentContent.length > 200) {
        res.status(422).json({
          message: "Comment is too long (Must be <=200 characters).",
        });
        return;
      } else if (commentContent.length === 0) {
        res.status(422).json({ message: "Comment cannot be empty." });
        return;
      }

      const filter = new Filter();
      try {
        const commentEntry = {
          postId: postId,
          commenterId: commenterId,
          content: filter.clean(commentContent),
          date: Date.now(),
        };

        const result = await Comment.create(commentEntry);
        const commenterInfo = await User.findById(commenterId);

        res.status(200).json({
          message: "Successfully commented on post.",
          comment: { ...result._doc, commenterInfo },
        });
      } catch (err) {
        res.status(500).json({ message: "Internal Server Error.", err: err });
      }
      return;
    case "DELETE":
      const commentId = req.body.commentId;

      /* Verify Deleter of Comment in Fact Made Comment */
      const commentInfo = await Comment.findById(commentId);
      if (!commentInfo) {
        res.status(404).json({ message: "Comment not found" });
        return;
      } else if (commentInfo.commenterId != commenterId) {
        res
          .status(401)
          .json({ message: "You cannot delete a comment you have not made." });
        return;
      }

      try {
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Successfully deleted comment." });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Failed to delete comment.", err: err });
      }
      return;
  }
};

export default handler;
