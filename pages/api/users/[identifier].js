import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import Post from "../../../models/Post";
import Like from "../../../models/Like";
import Comment from "../../../models/Comment";

const handler = async (req, res) => {
  const method = req.method;

  switch (method) {
    case "GET":
      const { identifier } = req.query;

      if (!identifier.trim()) {
        res.status(400).json({ message: "Invalid Request" });
        return;
      }

      await dbConnect();

      // See if username exists
      const existingUser = await User.findOne({
        username: identifier,
      });

      if (!existingUser) {
        res.status(404).json({ message: "User does not exist." });
        return;
      }

      /* 
        TODO: Basically, get and return data on (need to add the logic for):
          - Followers
          - Following
          - Posts ✔️
      */

      /* Fetching Posts */
      const userPosts = await Post.find({ posterId: existingUser._id });

      /* Fetch info such as comments & likes counts for each posts*/
      const informizePosts = async (post) => {
        let likes, comments;
        try {
          likes = await Like.find({ postId: post._id });
          comments = await Comment.find({ postId: post._id });
        } catch (err) {
          return Promise.reject(err);
        }

        return Promise.resolve({
          ...post._doc,
          likes: likes.length,
          comments: comments.length,
        });
      };

      /* Sorts posts from date of creation (newests to oldest) */
      const promises = userPosts
        .sort((a, b) => b.date - a.date)
        .map((post) => informizePosts(post));

      return Promise.all(promises)
        .then((postsData) => {
          res.status(200).json({
            message: "Successfully found user.",
            user: existingUser,
            posts: postsData,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message:
              "A problem has occurred while fetching like & comment data for posts",
            errMsg: err,
          });
        });
    default:
      res.status(400).json({ message: "Invalid Request" });
      return;
  }
};

export default handler;
