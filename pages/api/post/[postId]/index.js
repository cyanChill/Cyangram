/* 
  Expect either a GET, and DELETE request [maybe patch but only to
  edit description]
*/

import { getSession } from "next-auth/react";

import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import Post from "../../../../models/Post";
import Like from "../../../../models/Like";
import Comment from "../../../../models/Comment";

const handler = async (req, res) => {
  const method = req.method;
  const { postId } = req.query;

  await dbConnect();

  const postInfo = await Post.findById(postId);
  if (!postInfo) {
    res.status(404).json({ message: "Post does not exist." });
    return;
  }

  /* TODO: Minimize data fetched? */
  switch (method) {
    case "GET":
      /* Get info on the poster */
      const posterInfo = await User.findById(postInfo.posterId);

      const postLikes = await Like.find({ postId: postInfo._id });
      const postComments = await Comment.find({ postId: postInfo._id });

      /* Fetch remaining info for comments (commenter data) */
      const informizeComments = async (comment) => {
        let commenterInfo;
        try {
          commenterInfo = await User.findById(comment.commenterId);
        } catch (err) {
          return Promise.reject(err);
        }

        return Promise.resolve({
          ...comment._doc,
          commenterInfo,
        });
      };

      const promises = postComments.map((comment) =>
        informizeComments(comment)
      );

      return Promise.all(promises)
        .then((commentsData) => {
          const finalizedPostData = {
            ...postInfo._doc,
            posterInfo,
            likes: postLikes,
            comments: commentsData,
          };

          res.status(200).json({
            message: "Successfully obtained post data.",
            post: finalizedPostData,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message:
              "A problem has occurred while fetching commenter data for comment",
            errMsg: err,
          });
        });
    case "DELETE":
      const session = await getSession({ req: req });
      if (!session) {
        res.status(401).json({ message: "User is not authenticated" });
        return;
      }

      if (session.user.dbId != postInfo.posterId) {
        res.status(401).json({ message: "User does not own post." });
        return;
      }

      /* Deleting post comments & likes */
      await Like.deleteMany({ postId: postId });
      await Comment.deleteMany({ postId: postId });

      try {
        await Post.findByIdAndDelete(postId);
        res.status(200).json({
          message: "Successfully deleted post.",
          postOwnerId: session.user.dbId,
          postImgId: postInfo.image.identifier,
        });
      } catch (err) {
        res.status(500).json({
          message: "A problem has occurred while deleting post",
          errMsg: err,
        });
      }
  }
};

export default handler;
