import { getSession } from "next-auth/react";

import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import Validator, {
  required,
  usernameFriendly,
  minLength,
  maxLength,
} from "../../../lib/validate";

const handler = async (req, res) => {
  if (req.method !== "PATCH") {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ message: "User is not authenticated." });
    return;
  }

  const userId = session.user.dbId;
  const username = session.user.username;
  const newName = req.body.newName;
  const newUsername = req.body.newUsername;
  const newBio = req.body.newBio;

  const validNameStruc = Validator(newName, [minLength(3), maxLength(30)]);
  const validUsernameStruc = Validator(newUsername, [
    required,
    usernameFriendly,
  ]);

  if (!validNameStruc || !validUsernameStruc) {
    res.status(422).json({ message: "Invalid inputs." });
    return;
  }

  await dbConnect();

  /* 
    If we're changing the username, we validate the username to see if it's
    already used (will never throw an error)
  */
  if (username !== newUsername) {
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      res.status(409).json({ message: "Username already exists." });
      return;
    }
  }

  try {
    await User.findByIdAndUpdate(userId, {
      $set: { name: newName, username: newUsername, bio: newBio },
    });
    res
      .status(200)
      .json({ message: "Successfully updated general profile settings." });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update general profile settings.",
      err: err,
    });
  }
};

export default handler;
