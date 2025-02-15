import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBuUm54NojmZuwOGJd4qqebxrgiO2hQAPc",
  authDomain: "alter-task-manager.firebaseapp.com",
  projectId: "alter-task-manager",
  storageBucket: "alter-task-manager.firebasestorage.app",
  messagingSenderId: "711653939373",
  appId: "1:711653939373:web:abcbf0f02c31fb83ec8e24",
  measurementId: "G-VPZ8DVBDQJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);