// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getMessaging, getToken , onMessage } from "firebase/messaging";
import { initializeFirestore } from 'firebase/firestore'
import { persistentMultipleTabManager } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBgEJuuO5CR5nPoyD8ga_8CVq9dNHaX54g',
  authDomain: 'reseau-social-64426.firebaseapp.com',
  projectId: 'reseau-social-64426',
  storageBucket: 'reseau-social-64426.firebasestorage.app',
  messagingSenderId: '967445960671',
  appId: '1:967445960671:web:94f40da4dfdf20ecf7966a',
  measurementId: 'G-C0S8K660ZE',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = initializeFirestore(app, {
  cache: {
    tabManager: persistentMultipleTabManager(),
  },
})
const messaging = getMessaging(app)

// Export them
export const generateToken = async () => {
  const permission = await Notification.requestPermission()
  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey:
        'BIanCUYSecZqQYqqtVIq_nMZoc7_bRMaz-0DGVj-uCe49bbTrZ_N68T3Tgmh0KJ2rAktdWA-d_AeNYz0jJ3NB8s',
    })
    console.log(token)
  }
}



export { auth, createUserWithEmailAndPassword, db , messaging , onMessage};;
