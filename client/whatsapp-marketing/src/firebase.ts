// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBAS_URL,
  authDomain: "first-client-c1d28.firebaseapp.com",
  projectId: "first-client-c1d28",
  storageBucket: "first-client-c1d28.firebasestorage.app",
  messagingSenderId: "918719609610",
  appId: "1:918719609610:web:7565cd62fd8ecd468e98f3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
