import { getSession } from "next-auth/react";

import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import Post from "../../../../models/Post";
import Like from "../../../../models/Like";

const handler = async (req, res) => {
  const method = req.method;
  const { postId } = req.query;

  if (method !== "POST" && method !== "DELETE") {
    return;
  }

  const session = await getSession({ req: req });
  const likerId = session.user.dbId;

  await dbConnect();

  const postExists = await Post.findById(postId);
  if (!postExists) {
    res.status(404).json({ message: "Post Not Found" });
    return;
  }

  const userExists = await User.findById(likerId);
  if (!userExists) {
    res.status(404).json({ message: "User Not Found" });
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
        await Like.create({
          likerId: likerId,
          postId: postId,
        });
        res.status(200).json({ message: "Successfully Liked Post" });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Internal Server Error.", errMsg: err });
      }
      return;
    case "DELETE":
      try {
        await Like.deleteMany({
          likerId: likerId,
          postId: postId,
        });
        res.status(200).json({ message: "Successfully Unliked Post" });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Internal Server Error.", errMsg: err });
      }
      return;
  }
};

export default handler;
