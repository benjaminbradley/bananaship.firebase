import { initializeApp } from "firebase/app";
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
export const db = getDatabase(app);
export const auth = getAuth();
export default app;
