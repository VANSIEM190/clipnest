import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseconfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [initials, setInitials] = useState("");
  const [user, setUser] = useState({}); // null = pas encore de données

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const prenom = data.prenom || "";
            const nom = data.nom || "";
            const fullName = `${prenom} ${nom}`;
            const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();

            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              ...data,
              fullName,
              initials,
            });

            setInitials(initials);
          } else {
            console.warn("Utilisateur non trouvé dans Firestore");
            setInitials("");
            setUser(null);
          }
        } catch (error) {
          console.error("Erreur Firestore:", error);
          setInitials("");
          setUser(null);
        }
      } else {
        setInitials("");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ initials, user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
