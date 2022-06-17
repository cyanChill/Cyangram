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
import Post from "../../../models/Post";

const handler = async (req, res) => {
  if (req.method !== "POST") return;

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

  const data = await new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject({ err });
      resolve({ err, fields, files });
    });
  });

  const description = data.fields.description;
  const imageInfo = data.files.uploadedImg;

  if (!validImageSize(imageInfo.size, 5)) {
    res.status(406).json({ message: "File size is too large (Must be <5MB)." });
    return;
  }
  let img = { url: "", identifier: "" };

  try {
    // Upload Image to Firebase
    img = await uploadImage(user._id.toString(), imageInfo);
    const postEntry = {
      posterId: user._id,
      description: description,
      image: img,
      date: Date.now(),
    };

    const createdPost = await Post.create(postEntry);
    res
      .status(200)
      .json({ message: "Post Created Successfully.", postId: createdPost._id });
  } catch (err) {
    // Also delete image we've just uploaded
    await deleteImage(user._id.toString(), img.identifier);
    res.status(500).json({ message: "Internal Server Error.", errMsg: err });
  }
};

export default handler;

export const config = { api: { bodyParser: false } };
