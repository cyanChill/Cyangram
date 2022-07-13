import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

const handler = async (req, res) => {
  const { identifier } = req.query;
  const username = decodeURIComponent(identifier);
  if (req.method !== "GET" || !username.trim()) {
    res.status(400).json({ message: "Invalid Request/Input." });
    return;
  }

  await dbConnect();
  try {
    // See if username exists
    const existingUser = await User.findOne(
      { username_lower: username.toLowerCase() },
      "_id"
    );
    if (!existingUser) {
      res
        .status(200)
        .json({ message: "This usename is avaliable.", used: false });
    } else {
      res.status(200).json({
        message: "This username has already been used.",
        used: true,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "A problem has occurred while fetching user.",
      err: err,
    });
  }
};

export default handler;
