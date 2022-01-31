import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const { identifier } = req.query;

    if (!identifier.trim()) {
      return;
    }

    await dbConnect();

    // See if username exists
    const existingUser = await User.find({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (existingUser.length === 0) {
      res.status(404).json({ message: "User does not exist." });
      return;
    }

    res.status(200).json({
      message: "Successfully found user.",
      user: existingUser,
    });
  }
};

export default handler;
