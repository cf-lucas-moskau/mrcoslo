import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

// Log environment variable status
console.log("Environment Variables Status:", {
  apiKeyExists: !!process.env.REACT_APP_GOOGLE_API_KEY,
  nodeEnv: process.env.NODE_ENV,
});

if (!process.env.REACT_APP_GOOGLE_API_KEY) {
  throw new Error(
    "REACT_APP_GOOGLE_API_KEY is not defined in environment variables. Make sure you have a .env file with this variable."
  );
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  authDomain: "mrc-olso.firebaseapp.com",
  databaseURL:
    "https://mrc-olso-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mrc-olso",
  storageBucket: "mrc-olso.firebasestorage.app",
  messagingSenderId: "816386613163",
  appId: "1:816386613163:web:21452effa1faa51a783cee",
  measurementId: "G-9MRHDQ0RWE",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Set persistence to local storage (survives browser restarts)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export const db = getDatabase(app);
