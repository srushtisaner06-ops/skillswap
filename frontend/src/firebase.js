// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6Wyu29VsrmB-KuLutJUCADwgDKR29GlI",
  authDomain: "skillswap-2831f.firebaseapp.com",
  projectId: "skillswap-2831f",
  storageBucket: "skillswap-2831f.firebasestorage.app",
  messagingSenderId: "779706005440",
  appId: "1:779706005440:web:fdfde5562df2b92f713a25",
  measurementId: "G-25M1JSKVEE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);