import { getSession, signIn, signOut } from "next-auth/react";

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
    res.status(400).json({ message: "Invalid Request" });
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "User Is Not Authenticated." });
    return;
  }

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
    res.status(422).json({ message: "Invalid Inputs" });
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

  const user = await User.findOne({ username: username }, "+password");
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return;
  }

  try {
    await User.updateOne(
      { _id: user._id },
      { $set: { name: newName, username: newUsername, bio: newBio } }
    );
  } catch (err) {
    // Possible errors include MongoDB storage is full
    res.status(500).json({ message: "Internal Server Error." });
    return;
  }

  res
    .status(200)
    .json({ message: "General Profile Settings Updated Successfully." });
};

export default handler;
