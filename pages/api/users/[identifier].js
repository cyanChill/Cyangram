import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

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
      const existingUser = await User.findOne(
        {
          $or: [{ email: identifier }, { username: identifier }],
        },
        "-email"
      );

      if (!existingUser) {
        res.status(404).json({ message: "User does not exist." });
        return;
      }

      /* 
        Depending whether the user is a follower or not, allow them to see
        who they're following or not (if private)
      */

      res.status(200).json({
        message: "Successfully found user.",
        user: existingUser,
      });
      break;
    default:
      res.status(400).json({ message: "Invalid Request" });
      break;
  }
};

export default handler;
