import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

import Validator, {
  required,
  usernameFriendly,
  minLength,
} from "../../../lib/validate";
import { hashPassword } from "../../../lib/hash";

const handler = async (req, res) => {
  if (req.method !== "POST") return;

  const { username, password } = req.body;

  // Validate username & password structures
  const validUsernameStruc = Validator(username, [required, usernameFriendly]);
  const validPassword = Validator(password, [required, minLength(6)]);

  if (!validUsernameStruc || !validPassword) {
    res.status(422).json({ message: "Invalid inputs." });
    return;
  }

  await dbConnect();

  // Validate username to see if they already exist (will never throw an error)
  const existingUser = await User.findOne({ username: username });
  if (existingUser) {
    res.status(409).json({ message: "Username already exists." });
    return;
  }

  // Add user to the database
  const hashedPassword = await hashPassword(password);
  let newUser;

  try {
    newUser = await User.create({
      username: username,
      name: username,
      password: hashedPassword,
      bio: "",
      profilePic: {
        url: `${process.env.NEXT_PUBLIC_DEFAULT_PROFILEPIC_URL}`,
        identifier: "default_profile_picture",
      },
    });

    res.status(201).json({
      message: "Successfully signed up user.",
      user: { username, name: username, id: newUser._id.toString() },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error.", errMsg: err });
  }
};

export default handler;
