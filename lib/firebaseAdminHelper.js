import { v4 as uuidv4 } from "uuid";

import { bucket } from "../firebaseAdmin.config";

/* Used to upload an image and return the download url w/ identifier */
export const uploadImage = async (uploaderId, imageData) => {
  if (!uploaderId || !imageData) return;
  const referenceId = uuidv4();
  const downloadToken = uuidv4();
  const destination = `${uploaderId}/${referenceId}`;
  const { filepath, mimetype } = imageData;

  // Upload local file to bucket
  await bucket.upload(filepath, {
    destination: destination,
    contentType: mimetype,
    metadata: { metadata: { firebaseStorageDownloadTokens: downloadToken } },
  });

  const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
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
