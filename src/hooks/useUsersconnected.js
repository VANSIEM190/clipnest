// hooks/useUsersAreConnected.js
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebaseconfig";

const useUsersIsConnected = () => {
  const [connectedUserIds, setConnectedUserIds] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const onlineUsers = snapshot.docs
        .filter(doc => doc.data().online === true)
        .map(doc => doc.id);

      setConnectedUserIds(onlineUsers);
    });

    return () => unsubscribe();
  }, []);

  return connectedUserIds;
};

export default useUsersIsConnected;
