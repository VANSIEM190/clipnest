import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebaseconfig";
import { useNavigate } from "react-router-dom";
import { stringToColor } from "../utils/StringToColor";
import { useDarkMode } from "../Context/DarkModeContext";
import Loader from "../components/Loader"


const ContactCard = () => {
  const [users, setUsers] = useState([]);
  const [connectedUserIds, setConnectedUserIds] = useState([]);
  const [loading , setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const socket = new WebSocket("wss:https://clipnest-ugfj.onrender.com");

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            type: "login",
            userId: user.uid,
          })
        );
      };
    }
  }, []);

  useEffect(() => {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "userList") {
        setConnectedUserIds(message.users);
      }
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
        setLoading(false)
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    };

    fetchUsers();
  }, []);

  const handleClick = (userId) => {
    navigate(`/message/${userId}`);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.prenom} ${user.nom}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    loading?
    <Loader/> : 
    <div className="container mx-auto p-2 sm:p-4">
      <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">Liste des utilisateurs</h2>
      <input
        type="text"
        placeholder="Recherche"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        className={`w-full max-w-full sm:max-w-md rounded-md bg-transparent px-3.5 py-2 text-sm sm:text-base ${
          isDarkMode ? "text-white" : "text-gray-900"
        } outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-500 mb-4`}
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(152px,1fr))] gap-4">
        {filteredUsers.map((user) => {
          const isOnline = connectedUserIds.includes(user.uid);

          return (
            <div
              key={user.id}
              className={`p-2 sm:p-5 rounded shadow relative cursor-pointer hover:bg-gray-50 transition-all ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
              onClick={() => handleClick(user.id)}
              translate="no"
            >
              <div className="flex items-center">
                <div
                  className="min-w-[40px] min-h-[40px] w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-xl font-bold text-gray-700 mr-2 sm:mr-4"
                  title={user.displayName || "Sans nom"}
                  style={{
                    backgroundColor: stringToColor(`${user.prenom} ${user.nom}`),
                  }}
                  translate="no"
                >
                  {`${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold">
                    {`${user.prenom} ${user.nom}`}
                  </h3>
                  <p className={`text-xs ${isOnline ? "text-green-600" : "text-red-500"}`}>
                    {isOnline ? "En ligne" : "Hors ligne"}
                  </p>
                </div>
              </div>
              <span
                className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-red-500"
                }`}
                title={isOnline ? "En ligne" : "Hors ligne"}
              ></span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactCard;
