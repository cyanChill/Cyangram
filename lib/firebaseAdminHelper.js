import { v4 as uuidv4 } from "uuid";

import admin, { bucket } from "../firebaseAdmin.config";

export const appCheckVerification = async (req) => {
  const appCheckToken = req.headers["x-firebase-appcheck"];
  if (!appCheckToken) {
    throw new Error("Unauthorized");
  }

  try {
    // Continue if verifyToken() succeeds (no errors)
    const appCheckClaims = await admin.appCheck().verifyToken(appCheckToken);
  } catch (err) {
    throw new Error("Unauthorized");
  }
};

/* Verifies image is less than a specific size */
export const validImageSize = (imageData, maxSizeMB) => {
  return imageData.size < maxSizeMB * 1024 * 1024;
};

/* Used to upload an image and return the download url w/ identifier */
export const uploadImage = async (uploaderId, imageData) => {
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
    process.env.FIREBASE_STORAGE_BUCKET
  }/o/${encodeURIComponent(destination)}?alt=media&token=${downloadToken}`;

  return { identifier: referenceId, url: fileUrl };
};

/* Used to delete an image in firebase */
export const deleteImage = async (uploaderId, imageId) => {
  await bucket.file(`${uploaderId}/${imageId}`).delete();
};
