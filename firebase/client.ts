// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDx7-Y1t9IrGxSHu81S3kFrFWAZ1XC-Tmo",
  authDomain: "prepwise-e7b44.firebaseapp.com",
  projectId: "prepwise-e7b44",
  storageBucket: "prepwise-e7b44.firebasestorage.app",
  messagingSenderId: "392049015292",
  appId: "1:392049015292:web:42786d87d059f40bf7da79",
  measurementId: "G-DRZ5JGCHJN"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);



