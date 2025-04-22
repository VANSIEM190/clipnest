import { useEffect } from "react";
import { db } from "../services/firebaseconfig";
import { collection, onSnapshot, query, orderBy, limit, doc, getDoc } from "firebase/firestore";

const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const useNotificationListener = () => {
  useEffect(() => {
    const askPermission = async () => {
      if ("Notification" in window && Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
    };

    askPermission();

    const q = query(
      collection(db, "messages"),
      orderBy("timestamp", "desc"),
      limit(1)
    );

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

            if (Notification.permission === "granted") {
              new Notification(`💬 Nouveau message de ${nomComplet}`, {
                body: cleanMessage || "Message reçu",
                icon: "../assets/image.png",
              });
            }
          }
        }
      });
    });

    return () => unsubscribe();
  }, []);
};

export default useNotificationListener;
