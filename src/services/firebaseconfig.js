// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgEJuuO5CR5nPoyD8ga_8CVq9dNHaX54g",
  authDomain: "reseau-social-64426.firebaseapp.com",
  projectId: "reseau-social-64426",
  storageBucket: "reseau-social-64426.firebasestorage.app",
  messagingSenderId: "967445960671",
  appId: "1:967445960671:web:94f40da4dfdf20ecf7966a",
  measurementId: "G-C0S8K660ZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, createUserWithEmailAndPassword , db };