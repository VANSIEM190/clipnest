// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBgEJuuO5CR5nPoyD8ga_8CVq9dNHaX54g",
  authDomain: "reseau-social-64426.firebaseapp.com",
  projectId: "reseau-social-64426",
  storageBucket: "reseau-social-64426.firebasestorage.app",
  messagingSenderId: "967445960671",
  appId: "1:967445960671:web:94f40da4dfdf20ecf7966a",
  measurementId: "G-C0S8K660ZE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Message reçu en arrière-plan :", payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: "/logo192.png",
  });
});
