// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCk4bEzDn5TNnXtU-YzEAUUN0Tmtf2-D_o",
  authDomain: "watch-124dc.firebaseapp.com",
  projectId: "watch-124dc",
  storageBucket: "watch-124dc.firebasestorage.app",
  messagingSenderId: "480409913849",
  appId: "1:480409913849:web:8656c444fdacf264825528",
  measurementId: "G-NYYGDY4K76"
};

const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore
const db = getFirestore(app);

// ✅ Export Firestore instance
export { db };
