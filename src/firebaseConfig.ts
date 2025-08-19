import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
<<<<<<< HEAD
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID as string,
=======
  apiKey: "AIzaSyDY5J_7N5pa2EtSG223JuSOD8ajOpSNVEw",
  authDomain: "afromaster-ed786.firebaseapp.com",
  projectId: "afromaster-ed786",
  storageBucket: "afromaster-ed786.firebasestorage.app",
  messagingSenderId: "608115208990",
  appId: "1:608115208990:web:cef55385b2f0d49f85cf0f",
  measurementId: "G-D8RBEX1F9C"
>>>>>>> main
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
