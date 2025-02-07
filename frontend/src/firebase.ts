import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDPvsTvEV5Q_x24R9FTvk2PC32rrQ_bBHQ",
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
export const db = getDatabase(app);
