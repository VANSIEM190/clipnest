import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

const UserStatus = ({ uid }) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const statusRef = ref(db, `/status/${uid}`);

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIsOnline(data.online);
      } else {
        setIsOnline(false);
      }
    });

    return () => unsubscribe();
  }, [uid]);

  return (
    <div
      className={`z-50 h-2 w-2 rounded-full  ${
        isOnline ? "bg-green-500" : "bg-red-500"
      }`}
    ></div>
  );
};

export default UserStatus;
