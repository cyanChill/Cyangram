import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

import Validator, {
  required,
  usernameFriendly,
  minLength,
} from "../../../lib/validate";
import { hashPassword } from "../../../lib/hash";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  const { username, password } = req.body;
  // Validate username & password structures
  if (
    !Validator(username, [required, usernameFriendly]) ||
    !Validator(password, [required, minLength(6)])
  ) {
    res.status(422).json({ message: "Invalid inputs." });
    return;
  }

  await dbConnect();
  // Validate username to see if they already exist
  const existingUser = await User.findOne({ username: username });
  if (existingUser) {
    res.status(409).json({ message: "Username already exists." });
    return;
  }

  /* Adding  user to the database */
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      username: username,
      name: username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Successfully signed up user.",
      user: { username, name: username, id: newUser._id.toString() },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to sign up user.", err: err });
  }
};

export default handler;
