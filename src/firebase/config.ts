import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLw5SAhwZGJocg4kVBYBwOcnMdedNDiP4",
  authDomain: "summarist-app-3f19a.firebaseapp.com",
  projectId: "summarist-app-3f19a",
  storageBucket: "summarist-app-3f19a.firebasestorage.app",
  messagingSenderId: "278169831244",
  appId: "1:278169831244:web:a90fe739ce04d4d5bcf1e9",
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);