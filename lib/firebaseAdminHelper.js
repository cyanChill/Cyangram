import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

import { bucket } from "../firebaseAdmin.config";

/* Used to upload an image and return the download url w/ identifier */
export const uploadImage = async (uploaderId, imageData) => {
  if (!uploaderId || !imageData) return;
  const referenceId = uuidv4();
  const downloadToken = uuidv4();
  const destination = `${uploaderId}/${referenceId}`;
  const { filepath } = imageData;

  const convertedFileBuffer = await sharp(filepath).webp().toBuffer();

  // Uploading a file buffer to Firebase has a different process
  const newFile = bucket.file(destination);
  await newFile.save(convertedFileBuffer); // Upload image
  // Update metadata for obtainable download URL
  await newFile.setMetadata({
    contentType: "image/webp",
    metadata: { firebaseStorageDownloadTokens: downloadToken },
  });

  const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
    process.env.FIREBASE_ADMIN_STORAGE_BUCKET
  }/o/${encodeURIComponent(destination)}?alt=media&token=${downloadToken}`;

  return { identifier: referenceId, url: fileUrl };
};

/* Used to delete an image in firebase */
export const deleteImage = async (uploaderId, imageId) => {
  if (!uploaderId || !imageId) return;
  try {
    await bucket.file(`${uploaderId}/${imageId}`).delete();
  } catch (err) {
    console.log(err);
  }
};
