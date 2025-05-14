import  {initializeApp} from "firebase/app"
import {getMessaging , getToken , onMessage} from "firebase/messaging"


const firebaseConfig = {
  apiKey: "AIzaSyBgEJuuO5CR5nPoyD8ga_8CVq9dNHaX54g",
  authDomain: "reseau-social-64426.firebaseapp.com",
  projectId: "reseau-social-64426",
  storageBucket: "reseau-social-64426.firebasestorage.app",
  messagingSenderId: "967445960671",
  appId: "1:967445960671:web:94f40da4dfdf20ecf7966a",
  measurementId: "G-C0S8K660ZE"
};

const vapidkey = "BIanCUYSecZqQYqqtVIq_nMZoc7_bRMaz-0DGVj-uCe49bbTrZ_N68T3Tgmh0KJ2rAktdWA-d_AeNYz0jJ3NB8s";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestFCMToken = async () => {
  return Notification.requestPermission()
  .then(async (permission) => {
    if (permission === "granted") {
      const token = await getToken(messaging , { vapidkey });
      return token;
    } else {
      console.error("Permission non accordée pour les notifications.");
    }
  })
  .catch((error) => {
    console.error("Erreur lors de la demande de permission :", error);
  });

}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging , (payload) => {
      console.log("Message reçu :", payload);
      resolve(payload);
    }
    );
  }
  );