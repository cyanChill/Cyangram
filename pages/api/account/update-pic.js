import { getSession } from "next-auth/react";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

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

  const userId = session.user.dbId;
  const action = req.body.action;
  const img = req.body.imgInfo;

  /* We can either only set or remove our profile picture */
  if (action !== "SET" && action !== "REMOVE") {
    res.status(400).json({ message: "Invalid action type." });
    return;
  }

  await dbConnect();

  const user = await User.findOne({ _id: userId });
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return;
  }

  const defaultProfilePic = {
    url: `${process.env.NEXT_PUBLIC_DEFAULT_PROFILEPIC_URL}`,
    identifier: "default_profile_picture",
  };

  const newProfilePicObj = action === "SET" ? img : defaultProfilePic;

  try {
    await User.updateOne(
      { _id: user._id },
      { $set: { profilePic: newProfilePicObj } }
    );
  } catch (err) {
    /* Possible errors include MongoDB storage is full */
    res.status(500).json({ message: "Internal Server Error." });
    return;
  }

  res.status(200).json({ message: "Profile Picture Successfully Updated." });
};

export default handler;
