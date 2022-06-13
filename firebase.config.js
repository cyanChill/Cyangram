import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOngpTCxU6BPe8VkEma-mKgTVtU6qbpyk",
  authDomain: "next-instagram-4d6f7.firebaseapp.com",
  projectId: "next-instagram-4d6f7",
  storageBucket: "next-instagram-4d6f7.appspot.com",
  messagingSenderId: "636664925460",
  appId: "1:636664925460:web:461a17021f5baca7a60601",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/* Used for logging users in & out w/ custom tokens */
export const auth = getAuth(app);

// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(
    process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY
  ),
  /* Optional argument. If true, the SDK automatically refreshes App Check tokens as needed. */
  isTokenAutoRefreshEnabled: true,
});
