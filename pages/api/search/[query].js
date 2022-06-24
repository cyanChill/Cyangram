import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

const handler = async (req, res) => {
  const { query } = req.query;
  if (req.method !== "GET" || query.trim().length <= 3) {
    res.status(400).json({ message: "Invalid Request/Input." });
    return;
  }
  const decodedQueryRegex = new RegExp(`.*${decodeURIComponent(query)}.*`);

  await dbConnect();
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: decodedQueryRegex, $options: "i" } },
        { name: { $regex: decodedQueryRegex, $options: "i" } },
      ],
    });
    if (users.length === 0) {
      res
        .status(200)
        .json({ message: "No users matching query found.", users: [] });
    } else {
      res
        .status(200)
        .json({ message: "Found users matching query found.", users: users });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users from query.", err: err });
  }
};

export default handler;
