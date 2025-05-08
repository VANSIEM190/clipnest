// hooks/useOnlineStatus.js
import { useEffect } from "react";
import { getDatabase, ref as rtdbRef, onDisconnect, onValue, set, serverTimestamp } from "firebase/database";
import { getFirestore, doc, setDoc, serverTimestamp as fsServerTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function useOnlineStatus() {
  useEffect(() => {
    const auth = getAuth();
    const dbRTDB = getDatabase();
    const dbFS = getFirestore();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const uid = user.uid;

      const rtdbStatusRef = rtdbRef(dbRTDB, `/status/${uid}`);
      const fsUserDocRef = doc(dbFS, "users", uid);

      const isOfflineForRTDB = {
        online: false,
        last_changed: serverTimestamp(),
      };

      const isOnlineForRTDB = {
        online: true,
        last_changed: serverTimestamp(),
      };

      const isOfflineForFirestore = {
        online: false,
        last_changed: fsServerTimestamp(),
      };

      const isOnlineForFirestore = {
        online: true,
        last_changed: fsServerTimestamp(),
      };

      const connectedRef = rtdbRef(dbRTDB, ".info/connected");

      onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === false) {
          return;
        }

        onDisconnect(rtdbStatusRef).set(isOfflineForRTDB).then(() => {
          set(rtdbStatusRef, isOnlineForRTDB);
          setDoc(fsUserDocRef, isOnlineForFirestore, { merge: true });
        });
      });
    });

    return () => unsubscribe();
  }, []);
}
