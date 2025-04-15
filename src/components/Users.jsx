import React, { useEffect, useState } from "react";
import { db } from "../services/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import Loader from "./Loader";
import { useDarkMode } from "../Context/DarkModeContext";

const ContactCard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => doc.data());
      setUsers(usersData);
      setLoading(false); 
    };

    fetchUsers();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-200"} p-6`}>
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-400">
            Cartes de contact
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 justify-center">
            {users.map((user, index) => (
              <div
                key={index}
                className={` ${isDarkMode? "bg-gray-800" : "bg-white"} rounded-xl shadow p-4 text-center hover:shadow-lg transition`}
              >
                <div className="w-20 h-20 max-sm:w-10 max-sm:h-10 rounded-full mx-auto mb-4 text-gray-400 flex justify-center items-center font-bold border border-gray-400">
                  {`${user.prenom.charAt(0)} ${user.nom.charAt(0)}`.toUpperCase()}
                </div>

                <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center whitespace-normal">
                  {user.prenom} {user.nom}
                </h5>

                <p className="text-gray-500 text-sm mb-1 text-center break-words">{user.email}</p>
                <p className="text-gray-500 text-sm text-center">{user.niveau}</p>
                <p className="text-gray-500 text-sm mb-2 text-center">{user.nationalite}</p>

                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full mb-3">
                  Admin
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ContactCard;
