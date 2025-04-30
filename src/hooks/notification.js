import { useEffect } from "react";
import Push from "push.js";  // Importation de Push.js
import iconImage from "../assets/image.png"; // Icône pour la notification

const useNotificationListener = (userName) => {
  useEffect(() => {
    // Demander la permission de notification si elle n'est pas encore donnée
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Si la permission est accordée, afficher la notification
    if (Notification.permission === "granted") {
      Push.create(`${userName}`, {
        body: "a écrit un nouveau message ",  // Affiche le message de l'utilisateur
        icon: iconImage,  // Icône de notification
        timeout: 5000,  // La notification disparaît après 5 secondes
        onClick: function () {
          // Que faire quand l'utilisateur clique sur la notification ?
          window.focus();
          this.close();
        }
      });
    } else {
      console.log("❌ Permission non accordée pour les notifications");
    }
  }, [userName]); // On réexécute si les données changent
};

export default useNotificationListener;
