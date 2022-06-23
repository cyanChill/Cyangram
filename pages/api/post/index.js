import { getSession } from "next-auth/react";
import formidable from "formidable";
import Filter from "bad-words";

import {
  appCheckVerification,
  deleteImage,
  uploadImage,
} from "../../../lib/firebaseAdminHelper";
import dbConnect from "../../../lib/dbConnect";
import { isImage, validImageSize } from "../../../lib/validate";
import Post from "../../../models/Post";

const handler = async (req, res) => {
  if (req.method !== "POST") {
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

  const description = data.fields.description.trim();
  const imageInfo = data.files.uploadedImg;
  if (description.length > 200 || !isImage(imageInfo)) {
    res.status(406).json({ message: "Invalid inputs." });
    return;
  }

  if (!validImageSize(imageInfo.size, 5)) {
    res.status(406).json({ message: "File size is too large (Must be <5MB)." });
    return;
  }

  let img = { url: "", identifier: "" };
  try {
    const filter = new Filter();
    // Upload Image to Firebase
    img = await uploadImage(userId, imageInfo);
    const postEntry = {
      posterId: userId,
      description: description ? filter.clean(description) : "",
      image: img,
      date: Date.now(),
    };

    const createdPost = await Post.create(postEntry);
    res
      .status(200)
      .json({ message: "Successfully created post.", postId: createdPost._id });
  } catch (err) {
    // Also delete image we've just uploaded
    await deleteImage(userId, img.identifier);
    res.status(500).json({ message: "Failed to create post.", err: err });
  }
};

export default handler;

export const config = { api: { bodyParser: false } };
