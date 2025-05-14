import { createContext, useEffect , useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, onDisconnect } from "firebase/database";
import { auth } from "../services/firebaseconfig";

const PresenceContext = createContext();

export const PresenceProvider = ({ children }) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const db = getDatabase();
        const statusRef = ref(db, `/status/${user.uid}`);

        // Mettre l'utilisateur en ligne
        set(statusRef, {
          online: true,
          lastChanged: Date.now(),
        });

        // En cas de fermeture d'onglet ou déconnexion
        onDisconnect(statusRef).set({
          online: false,
          lastChanged: Date.now(),
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <PresenceContext.Provider value={{}}>
      {children}
    </PresenceContext.Provider>
  );
};

export   const useContextPresence = () => {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error("useContextPresence must be used within a PresenceProvider");
  }
  return context;
}
