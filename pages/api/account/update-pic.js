import { getSession } from "next-auth/react";
import formidable from "formidable";

import {
  appCheckVerification,
  deleteImage,
  uploadImage,
} from "../../../lib/firebaseAdminHelper";
import dbConnect from "../../../lib/dbConnect";
import { validImageSize } from "../../../lib/validate";
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

  try {
    await appCheckVerification(req);
  } catch (err) {
    res.status(401).json({ message: "User is unauthorized." });
    return;
  }

  await dbConnect();

  const userId = session.user.dbId;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return;
  }
  const prevImg = user.profilePic;

  const data = await new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject({ err });
      resolve({ err, fields, files });
    });
  });

  /* We can either only set or remove our profile picture */
  const action = data.fields.action;
  if (action !== "SET" && action !== "REMOVE") {
    res.status(400).json({ message: "Invalid action type." });
    return;
  }

  const imageInfo = data.files.uploadedImg;
  if (action === "SET" && !validImageSize(imageInfo.size, 5)) {
    res.status(406).json({ message: "File size is too large (Must be <5MB)." });
    return;
  }

  const defaultProfilePic = {
    url: `${process.env.NEXT_PUBLIC_DEFAULT_PROFILEPIC_URL}`,
    identifier: "default_profile_picture",
  };
  let img = { url: "", identifier: "" };

  try {
    if (action === "SET") {
      img = await uploadImage(user._id.toString(), imageInfo);
    }
    const newProfilePicObj = action === "SET" ? img : defaultProfilePic;

    await User.updateOne(
      { _id: user._id },
      { $set: { profilePic: newProfilePicObj } }
    );

    // Delete previous profile picture
    if (prevImg.identifier !== "default_profile_picture") {
      await deleteImage(user._id.toString(), prevImg.identifier);
    }

    res.status(200).json({
      message: "Profile Picture Successfully Updated.",
      newProfilePic: newProfilePicObj,
    });
  } catch (err) {
    // Delete uploaded profile picture if we fail
    if (action === "SET") {
      await deleteImage(user._id.toString(), img.identifier);
    }
    res.status(500).json({ message: "Internal Server Error.", errMsg: err });
  }
};

export default handler;

export const config = { api: { bodyParser: false } };
