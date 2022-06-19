import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY
        ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/gm, "\n")
        : undefined,
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
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
