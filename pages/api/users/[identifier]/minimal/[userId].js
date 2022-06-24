import dbConnect from "../../../../../lib/dbConnect";
import User from "../../../../../models/User";

const handler = async (req, res) => {
  const { userId } = req.query;
  if (req.method !== "GET" || !userId.trim()) {
    res.status(400).json({ message: "Invalid Request/Input." });
    return;
  }

  await dbConnect();
  try {
    // See if username exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      res.status(404).json({ message: "User does not exist." });
      return;
    }
    res.status(200).json({
      message: "Successfully found user data.",
      user: existingUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "A problem has occurred while fetching minimal user data.",
      err: err,
    });
  }
};

export default handler;
