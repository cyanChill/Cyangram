import dbConnect from "../../../../../lib/dbConnect";
import User from "../../../../../models/User";
import Post from "../../../../../models/Post";
import Like from "../../../../../models/Like";
import Comment from "../../../../../models/Comment";

const handler = async (req, res) => {
  // Would use SEARCH method if supported (correct verb)
  if (req.method !== "POST") {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }
  const { identifier: username, fromDate, amount } = req.query;
  const { usedIds } = req.body;

  await dbConnect();

  /* See if the "username" identifier is an actual user */
  const currUser = await User.findOne({ username: username });
  if (!currUser) {
    res.status(404).json({ message: "User does not exist." });
    return;
  }

  /* Fetching Posts & order from newest to oldest */
  const userPosts = await Post.find({
    posterId: currUser._id,
    _id: { $nin: usedIds },
    date: { $lt: fromDate },
  })
    .sort({ date: "-1" })
    .limit(amount);
  const foundIds = userPosts.map((post) => post._id);
  /* If we found no posts, end early */
  if (userPosts.length === 0) {
    res.status(200).json({
      message: "Successfully found all posts.",
      newData: [],
      newIds: [],
    });
    return;
  }

  /* Fetch info such as like & comment count for each posts*/
  const informizePosts = async (post) => {
    try {
      const likes = await Like.find({ postId: post._id });
      const comments = await Comment.find({ postId: post._id });

      return Promise.resolve({
        ...post._doc,
        likes: likes.length,
        comments: comments.length,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  try {
    const postPromises = userPosts.map((post) => informizePosts(post));
    const postsData = await Promise.all(postPromises);

    res.status(200).json({
      message: "Successfully found post data.",
      newData: postsData,
      newIds: foundIds,
    });
  } catch (err) {
    res.status(500).json({
      message: "A problem has occurred while fetching data for posts.",
      err: err,
    });
  }
};

export default handler;
