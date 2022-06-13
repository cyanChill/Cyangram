import { ref, deleteObject } from "firebase/storage";
import { signInWithCustomToken, signOut } from "firebase/auth";

import { auth, storage } from "../firebase.config";

export const deleteImg = async (userId, imgIdentifier) => {
  const imgRef = ref(storage, `${userId}/${imgIdentifier}`);
  deleteObject(imgRef)
    .then(() => {
      console.log("Image Delete Successfully!");
    })
    .catch((err) => {
      console.log(`An Error Has Occurred Deleting the Image: ${err}`);
    });
};

/* TODO: Make function to verify before uploading that the file is < 5mb and throw an error before attempting to upload to firebase */

export const loginInFirebase = async () => {
  const res = await fetch("/api/auth/customtoken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to obtain firebase custom token.");
  }
  const data = await res.json();

  try {
    const userCredential = await signInWithCustomToken(auth, data.customToken);
    console.log(userCredential.user);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const logoutFirebase = async () => {
  try {
    await signOut(auth);
    console.log("Sign-out successful.");
  } catch (err) {
    console.log(err);
  }
};
