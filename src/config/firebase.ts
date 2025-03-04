// src/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBsR4ur6g0dzFeHPCtnl9HEUj579h5DUw",
  authDomain: "pereza-9a61a.firebaseapp.com",
  projectId: "pereza-9a61a",
  storageBucket: "pereza-9a61a.firebasestorage.app",
  messagingSenderId: "257748438860",
  appId: "1:257748438860:web:3b53c9d59b5df3ac0a89e9",
  measurementId: "G-YS9X48WQZG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
