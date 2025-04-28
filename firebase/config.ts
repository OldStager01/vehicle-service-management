import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDROYY2bgGds4vh-mtaEgtDFnBUg1qZktY",
  authDomain: "vehiclemanagementsystem-e0034.firebaseapp.com",
  projectId: "vehiclemanagementsystem-e0034",
  storageBucket: "vehiclemanagementsystem-e0034.firebasestorage.app",
  messagingSenderId: "1083818910124",
  appId: "1:1083818910124:web:90d13f3aa5d40b273a1a09",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
