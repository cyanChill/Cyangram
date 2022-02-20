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
  const method = req.method;

  switch (method) {
    case "POST":
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

      // Validate email & username to see if they already exist (will never throw an error)
      const existingUser = await User.findOne({
        $or: [{ email: email }, { username: username }],
      });

      if (existingUser) {
        res.status(409).json({ message: "Username or email already exists." });
        return;
      }

      // Add user to the database
      const hashedPassword = await hashPassword(password);
      let newUser;

      try {
        newUser = await User.create({
          username,
          email,
          password: hashedPassword,
        });
      } catch (err) {
        /* Possible errors include MongoDB storage is full */
        res.status(500).json({ message: "Internal Server Error." });
        return;
      }

      res.status(201).json({
        message: "Successfully signed up user.",
        user: { username, email, id: newUser._id.toString() },
      });
      break;

    default:
      res.status(400).json({ message: "Invalid Request" });
      break;
  }
};

export default handler;
