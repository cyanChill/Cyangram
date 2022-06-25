import { getSession } from "next-auth/react";

import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import Validator, { required, minLength } from "../../../lib/validate";
import { hashPassword, verifyPassword } from "../../../lib/backendHelpers";

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
  const oldPassword = req.body.oldPassword.trim();
  const newPassword = req.body.newPassword.trim();
  const confirmedNewPassword = req.body.confirmedNewPassword.trim();

  const validPassword = Validator(newPassword, [required, minLength(6)]);
  if (!validPassword || newPassword !== confirmedNewPassword) {
    res.status(422).json({ message: "Invalid inputs." });
    return;
  }

  await dbConnect();

  const user = await User.findById(userId, "password");
  const isValid = await verifyPassword(oldPassword, user.password);
  if (!isValid) {
    res.status(403).json({ message: "Invalid old password." });
    return;
  }

  const newHashedPassword = await hashPassword(newPassword);
  try {
    await User.findByIdAndUpdate(userId, {
      $set: { password: newHashedPassword },
    });
    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to update password.", err: err });
  }
};

export default handler;
