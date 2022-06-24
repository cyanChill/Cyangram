import { getSession } from "next-auth/react";

import dbConnect from "../../../../lib/dbConnect";
import Post from "../../../../models/Post";
import Like from "../../../../models/Like";

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
  const likerId = session.user.dbId;

  await dbConnect();

  const { postId } = req.query;
  const postExists = await Post.findById(postId);
  if (!postExists) {
    res.status(404).json({ message: "Post not found." });
    return;
  }

  switch (method) {
    case "POST":
      const likeExists = await Like.findOne({
        likerId: likerId,
        postId: postId,
      });
      if (likeExists) return;

      try {
        await Like.create({ likerId: likerId, postId: postId });
        res.status(200).json({ message: "Successfully liked post." });
      } catch (err) {
        res.status(500).json({ message: "Internal Server Error.", err: err });
      }
      return;

    case "DELETE":
      try {
        await Like.deleteMany({ likerId: likerId, postId: postId });
        res.status(200).json({ message: "Successfully unliked post." });
      } catch (err) {
        res.status(500).json({ message: "Internal Server Error.", err: err });
      }
      return;
  }
};

export default handler;
