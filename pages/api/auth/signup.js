import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

import Validator, {
  isEmail,
  required,
  usernameFriendly,
  minLength,
} from "../../../lib/validate";
import { hashPassword } from "../../../lib/hash";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email, username, password } = req.body;

    // Validate email, username, password structures
    const validEmailStruc = Validator(email, [isEmail, required]);
    const validUsernameStruc = Validator(username, [
      required,
      usernameFriendly,
    ]);
    const validPassword = Validator(password, [required, minLength(6)]);

    if (!validEmailStruc || !validUsernameStruc || !validPassword) {
      res.status(422).json({ message: "Invalid inputs." });
      return;
    }

    await dbConnect();

    // Validate email & username to see if they already exist
    const existingUser = await User.find({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser.length > 0) {
      res.status(409).json({ message: "Username or email already exists." });
      return;
    }

    // Add user to the database
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Successfully signed up user.",
      user: { username, email, id: newUser._id.toString() },
    });
  }
};

export default handler;
