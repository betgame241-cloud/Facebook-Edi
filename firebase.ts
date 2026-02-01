
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA0SwUVpQBLlNhHTAidiWniZ93lFfG8mI8",
  authDomain: "profilepro-ee03e.firebaseapp.com",
  projectId: "profilepro-ee03e",
  storageBucket: "profilepro-ee03e.firebasestorage.app",
  messagingSenderId: "404728422274",
  appId: "1:404728422274:web:938c91a84417aad9a4f99b"
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
