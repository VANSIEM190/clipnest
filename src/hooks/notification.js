import { useEffect } from "react";
import { db } from "../services/firebaseconfig";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";

// Fonction pour retirer les balises HTML
const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const useNotificationListener = () => {
  useEffect(() => {
    // 🔔 Demande la permission de notification
    const askPermission = async () => {
      if (!("Notification" in window)) return; // Vérifie si les notifications sont supportées

      if (Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
    };

    askPermission();

    // 🔎 Préparation de la requête Firestore
    const q = query(
      collection(db, "messages"),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    // 🔁 Écoute en temps réel les nouveaux messages
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          const userId = data.userId;

          const userRef = doc(db, "users", userId);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const prenom = userData.prenom || "";
            const nom = userData.nom || "";
            const nomComplet = `${prenom} ${nom}`.trim();

            const cleanMessage = stripHtml(data.message || "");

            // ✅ Affiche la notification si l'autorisation est donnée
            if (Notification.permission === "granted") {
              new Notification(`💬 Nouveau message de ${nomComplet}`, {
                body: cleanMessage || "Message reçu",
                icon: "/assets/image.png", // Vérifie que le chemin est correct
              });
            }
          }
        }
      });
    });

    // Nettoyage à la désactivation du composant
    return () => unsubscribe();
  }, []);
};

export default useNotificationListener;
