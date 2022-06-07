import { getSession } from "next-auth/react";

import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import Post from "../../../models/Post";

const handler = async (req, res) => {
  if (req.method !== "POST") return;

  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ message: "User Is Not Authenticated." });
    return;
  }

  const userId = session.user.dbId;
  const description = req.body.description;
  const img = req.body.imgInfo;

  await dbConnect();

  const user = await User.findOne({ _id: userId });
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return;
  }

  const postEntry = {
    posterId: user._id,
    description: description,
    image: img,
    date: Date.now(),
  };

  try {
    await Post.create(postEntry);
    res.status(200).json({ message: "Post Created Successfully." });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error.", errMsg: err });
  }
};

export default handler;
