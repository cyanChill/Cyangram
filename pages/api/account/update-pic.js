import { getSession } from "next-auth/react";
import formidable from "formidable";

import {
  appCheckVerification,
  deleteImage,
  uploadImage,
} from "../../../lib/firebaseAdminHelper";
import dbConnect from "../../../lib/dbConnect";
import { isImage, validImageSize } from "../../../lib/validate";
import User from "../../../models/User";

const handler = async (req, res) => {
  if (req.method !== "PATCH") {
    res.status(400).json({ message: "Invalid Request." });
    return;
  }

  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ message: "User is not authenticated." });
    return;
  }
  const userId = session.user.dbId;

  try {
    await appCheckVerification(req);
  } catch (err) {
    res.status(401).json({ message: "User is unauthorized." });
    return;
  }

  await dbConnect();
  /* Get data from formData */
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
  if (action === "SET") {
    if (!isImage(imageInfo)) {
      res.status(406).json({ message: "Input must be an image" });
      return;
    }
    if (!validImageSize(imageInfo.size, 5)) {
      res.status(406).json({
        message: "File size is too large (Must be <5MB).",
      });
      return;
    }
  }

  let img = { url: "", identifier: "" };
  const DefaultProfilePic = {
    url: process.env.NEXT_PUBLIC_DEFAULT_PROFILEPIC_URL,
    identifier: process.env.NEXT_PUBLIC_DEFAULT_PROFILEPIC_IDENTIFIER,
  };
  try {
    if (action === "SET") {
      img = await uploadImage(userId, imageInfo);
    }
    const newProfilePicObj = action === "SET" ? img : DefaultProfilePic;
    // By default, it returns the previous entry
    const prevEntry = await User.findByIdAndUpdate(userId, {
      $set: { profilePic: newProfilePicObj },
    });
    // Delete previous profile picture
    if (prevEntry.profilePic.identifier !== "default_profile_picture") {
      await deleteImage(userId, prevEntry.profilePic.identifier);
    }

    res.status(200).json({
      message: "Updated profile picture successfully.",
      newProfilePic: newProfilePicObj,
    });
  } catch (err) {
    // Delete uploaded profile picture if we fail
    if (action === "SET") {
      await deleteImage(userId, img.identifier);
    }
    res
      .status(500)
      .json({ message: "Failed to update profile picture.", err: err });
  }
};

export default handler;

export const config = { api: { bodyParser: false } };
