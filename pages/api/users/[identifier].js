import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import Post from "../../../models/Post";

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
      const promises = userPosts.map((post) => {
        return new Promise((resolve, reject) => {
          if (false) return reject();
          return setTimeout(
            () =>
              resolve({
                ...post._doc,
                likes: 100,
                comments: 10,
              }),
            1000
          );
        });
      });

      const userPostsWithInfo = await Promise.all(promises);

      res.status(200).json({
        message: "Successfully found user.",
        user: existingUser,
        posts: userPostsWithInfo,
      });
      break;
    default:
      res.status(400).json({ message: "Invalid Request" });
      break;
  }
};

export default handler;
