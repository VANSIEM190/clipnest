import { ref, onValue } from "firebase/database";
import { realtimeDb } from "../services/firebaseconfig"; 

export const listenToUserStatus = (uid, callback) => {
  const userRef = ref(realtimeDb, `/status/${uid}`);
  const unsubscribe = onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return () => unsubscribe();
};
