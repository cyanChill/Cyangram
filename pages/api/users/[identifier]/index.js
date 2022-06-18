import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import Post from "../../../../models/Post";
import Like from "../../../../models/Like";
import Comment from "../../../../models/Comment";
import Follower from "../../../../models/Follower";

const handler = async (req, res) => {
  const method = req.method;

  switch (method) {
    case "GET":
      const { identifier } = req.query;
      if (!identifier.trim()) {
        res.status(400).json({ message: "Invalid Request." });
        return;
      }

      await dbConnect();

      // See if username exists
      const existingUser = await User.findOne({ username: identifier });
      if (!existingUser) {
        res.status(404).json({ message: "User does not exist." });
        return;
      }

      /* Fetching number of people user is following */
      const following = await Follower.find({ followerId: existingUser._id });
      /* Fetching number of people following user */
      const followers = await Follower.find(
        { followingId: existingUser._id },
        "followerId -_id"
      );
      /* Fetching Posts & order from newest to oldest*/
      const userPosts = await Post.find({ posterId: existingUser._id }).sort({
        date: "-1",
      });

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

      const promises = userPosts.map((post) => informizePosts(post));

      return Promise.all(promises)
        .then((postsData) => {
          res.status(200).json({
            message: "Successfully found user data.",
            user: existingUser,
            posts: postsData,
            followerList: followers,
            followerCnt: followers.length,
            followingCnt: following.length,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message:
              "A problem has occurred while fetching like & comment data for posts.",
            err: err,
          });
        });
  }
};

export default handler;
