// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcMpC6ngwkrVXHZSUrsu-Aujv1nTviXdM",
  authDomain: "miniproject-e38a4.firebaseapp.com",
  projectId: "miniproject-e38a4",
  storageBucket: "miniproject-e38a4.appspot.com",
  messagingSenderId: "5799086820",
  appId: "1:5799086820:web:1c39b44a3106e4a6cc3af1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
