import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDjSjLV0UWFvLw-ccrHvG9WMtnoiZlAeLw",
  authDomain: "bim-platform-proto-9c126.firebaseapp.com",
  projectId: "bim-platform-proto-9c126",
  storageBucket: "bim-platform-proto-9c126.firebasestorage.app",
  messagingSenderId: "833015185490",
  appId: "1:833015185490:web:6ab42f59b633390651df8b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// This connects to your specific "bim-db" database where the rules are public
export const db = getFirestore(app, "bim-db");
export const storage = getStorage(app);