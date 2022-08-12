import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUGpyNL9-Di5GpOgqOriJhfWMEc7lHimA",
  authDomain: "banana-ship.firebaseapp.com",
  projectId: "banana-ship",
  storageBucket: "banana-ship.appspot.com",
  messagingSenderId: "286178684557",
  appId: "1:286178684557:web:06cc093506644de7ce3cc4"
};

const app = initializeApp(firebaseConfig);
// Uncomment this to get a debug token in the browser's javascript console.
//window.self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
// Debug tokens must be added at https://console.firebase.google.com/u/0/project/banana-ship/appcheck/apps
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LejDXAhAAAAAD2UiVril9HnB8Vx5waXYTTnodqX'),
  isTokenAutoRefreshEnabled: true
});
export const db = getDatabase(app);
export const auth = getAuth();
export default app;
