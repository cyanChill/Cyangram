import { signInWithCustomToken, signOut } from "firebase/auth";
import { getToken } from "firebase/app-check";

import { appCheck, auth } from "../firebase.config";

export const callApiWithAppCheck = async (route, method, headers, body) => {
  let appCheckTokenResponse;
  try {
    appCheckTokenResponse = await getToken(appCheck, /* forceRefresh= */ false);
  } catch (err) {
    return;
  }

  const apiResponse = await fetch(route, {
    method: method,
    headers: {
      "X-Firebase-AppCheck": appCheckTokenResponse.token,
      ...headers,
    },
    body: body,
  });

  return apiResponse;
};

export const loginInFirebase = async () => {
  // Fetch customtoken from backend
  const res = await fetch("/api/auth/customtoken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
