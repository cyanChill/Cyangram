import { getSession } from "next-auth/react";

import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import Validator, { required, minLength } from "../../../lib/validate";
import { hashPassword, verifyPassword } from "../../../lib/hash";

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
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmedNewPassword = req.body.confirmedNewPassword;

  const validPassword = Validator(newPassword, [required, minLength(6)]);

  if (!validPassword || newPassword !== confirmedNewPassword) {
    res.status(422).json({ message: "Invalid Inputs" });
    return;
  }

  await dbConnect();

  const user = await User.findOne({ username: username }, "+password");
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return;
  }

  const isValid = await verifyPassword(oldPassword, user.password);
  if (!isValid) {
    res.status(403).json({ message: "Invalid Old Password." });
    return;
  }

  const newHashedPassword = await hashPassword(newPassword);
  try {
    await User.updateOne(
      { username: username },
      { $set: { password: newHashedPassword } }
    );
  } catch (err) {
    /* Possible errors include MongoDB storage is full */
    res.status(500).json({ message: "Internal Server Error." });
    return;
  }

  res.status(200).json({ message: "Password Updated Successfully." });
};

export default handler;
