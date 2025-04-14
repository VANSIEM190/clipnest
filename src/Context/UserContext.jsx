import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseconfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [initials, setInitials] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid); 
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const { nom = "", prenom = "" } = userSnap.data();
            const init = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
            const userName = `${prenom} ${nom}`;
            setUser(userName);
            setInitials(init);
          } else {
            console.warn("Utilisateur non trouvé dans Firestore");
            setInitials("");
          }
        } catch (error) {
          console.error("Erreur Firestore:", error);
          setInitials("");
          setUser("");
        }
      } else {
        setInitials("");
        setUser("");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ initials , user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
