// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 1. Import the Auth tool

const firebaseConfig = {
  apiKey: "AIzaSyDjSjLV0UWFvLw-ccrHvG9WMtnoiZlAeLw",
  authDomain: "bim-platform-proto-9c126.firebaseapp.com",
  projectId: "bim-platform-proto-9c126",
  storageBucket: "bim-platform-proto-9c126.firebasestorage.app",
  messagingSenderId: "833015185490",
  appId: "1:833015185490:web:6ab42f59b633390651df8b"
};

const app = initializeApp(firebaseConfig);

// 2. Initialize and Export Auth so the app can use it
export const auth = getAuth(app); 

export default app;