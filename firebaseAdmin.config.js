import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

import serviceAccount from "./ServiceAccountKey.json";

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
  console.log("Initialized firebase-admin.");
} catch (error) {
  /* We skip the "already exists" message which is not an actual error when we're hot-reloading. */
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

export default admin;

/* Used for getting custom token to sign-in to firebase */
export const auth = getAuth(admin.apps[0]);
/* Used to access & modify data in cloud storage in firebase */
export const bucket = getStorage().bucket();
