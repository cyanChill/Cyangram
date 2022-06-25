import { getSession } from "next-auth/react";

import { deleteImage } from "../../../../lib/firebaseAdminHelper";
import dbConnect from "../../../../lib/dbConnect";
import Post from "../../../../models/Post";
import Like from "../../../../models/Like";
import Comment from "../../../../models/Comment";

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

  const { postId } = req.query;
  const postInfo = await Post.findById(postId);
  if (!postInfo) {
    res.status(404).json({ message: "Post does not exist." });
    return;
  }

  if (
    !postInfo.posterId.equals(session.user.dbId) &&
    session.user.dbId !== process.env.ADMIN_ID
  ) {
    res.status(401).json({ message: "User does not own post." });
    return;
  }

  /* Deleting post comments & likes */
  await Like.deleteMany({ postId: postId });
  await Comment.deleteMany({ postId: postId });

  try {
    await Post.findByIdAndDelete(postId);
    // Delete the post image from firebase
    await deleteImage(postInfo.posterId.toString(), postInfo.image.identifier);
    res.status(200).json({ message: "Successfully deleted post." });
  } catch (err) {
    res.status(500).json({
      message: "A problem has occurred while deleting post.",
      err: err,
    });
  }
};

export default handler;
