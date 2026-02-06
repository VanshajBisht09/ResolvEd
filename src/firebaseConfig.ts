// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcS7_F-pDAe-5aF_wgCBfhQv7RVGR7HUk",
  authDomain: "resolved-27a41.firebaseapp.com",
  projectId: "resolved-27a41",
  storageBucket: "resolved-27a41.firebasestorage.app",
  messagingSenderId: "245094410061",
  appId: "1:245094410061:web:cb3f8addd4d14ec05bf904",
  measurementId: "G-JX2JP1R3XH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);