import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJ84XSjYv1g9-SITX5-Vaw_DMRtzymunw",
  authDomain: "partner-issue-board.firebaseapp.com",
  projectId: "partner-issue-board",
  storageBucket: "partner-issue-board.firebasestorage.app",
  messagingSenderId: "597227994454",
  appId: "1:597227994454:web:43786ec3fa1814f37e2af7",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);