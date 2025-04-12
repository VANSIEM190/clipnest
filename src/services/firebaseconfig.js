// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB032WWfe3lusZy4rVESNSW5dtyyn2ppG0",
  authDomain: "reseau-social-6197b.firebaseapp.com",
  projectId: "reseau-social-6197b",
  storageBucket: "reseau-social-6197b.firebasestorage.app",
  messagingSenderId: "325065449154",
  appId: "1:325065449154:web:a25b6c20d4b89e7382255b",
  measurementId: "G-FJ5W46D15H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword  };