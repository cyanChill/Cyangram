import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getStorage } from "firebase/storage";

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

// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
const appCheck = initializeAppCheck(app, {
  /* Seems like below didn't work because of ENV*/
  // provider: new ReCaptchaV3Provider(`${process.env.FB_RECAPTCHA_SITE_KEY}`),
  provider: new ReCaptchaV3Provider("6LebTTwgAAAAADjMOZuYE8XSt9yJ1xktzIgiYtbN"),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});

// Get a reference to the storage service, which is used to create references in your storage bucket
export const storage = getStorage(app);
