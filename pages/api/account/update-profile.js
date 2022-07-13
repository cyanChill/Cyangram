import { getSession } from "next-auth/react";
import Filter from "bad-words";

import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import Validator, {
  required,
  nameFriendly,
  usernameFriendly,
} from "../../../lib/validate";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: "User is not authenticated." });
    return;
  }

  if (req.method !== "PATCH") {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  const userId = session.user.dbId;
  const username = session.user.username;
  const newName = req.body.newName.trim();
  const newUsername = req.body.newUsername.trim();
  const newBio = req.body.newBio.trim();

  const validNameStruc = Validator(newName, [required, nameFriendly]);
  const validUsernameStruc = Validator(newUsername, [
    required,
    usernameFriendly,
  ]);

  if (!validNameStruc || !validUsernameStruc || newBio.length > 200) {
    res.status(422).json({ message: "Invalid inputs." });
    return;
  }

  const filter = new Filter();
  if (filter.isProfane(newName) || filter.isProfane(newUsername)) {
    res
      .status(406)
      .json({ message: "Name or username contains profane words." });
    return;
  }

  await dbConnect();

  /* 
    If we're changing the username, we validate the username to see if it's
    already used (will never throw an error)
  */
  if (username.toLowerCase() !== newUsername.toLowerCase()) {
    const existingUser = await User.findOne({
      username_lower: newUsername.toLowerCase(),
    });
    if (existingUser) {
      res.status(409).json({ message: "Username already exists." });
      return;
    }
  }

  try {
    await User.findByIdAndUpdate(userId, {
      $set: {
        name: newName,
        username: newUsername,
        username_lower: newUsername.toLowerCase(),
        bio: newBio ? filter.clean(newBio) : "",
      },
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
