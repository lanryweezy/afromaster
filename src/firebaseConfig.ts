import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDY5J_7N5pa2EtSG223JuSOD8ajOpSNVEw",
  authDomain: "afromaster-ed786.firebaseapp.com",
  projectId: "afromaster-ed786",
  storageBucket: "afromaster-ed786.firebasestorage.app",
  messagingSenderId: "608115208990",
  appId: "1:608115208990:web:cef55385b2f0d49f85cf0f",
  measurementId: "G-D8RBEX1F9C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
