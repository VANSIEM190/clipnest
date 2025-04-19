import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebaseconfig";
import Loader from "./Loader";
import { getAuth } from "firebase/auth";
import { stringToColor } from "../utils/StringToColor";
import { useUser } from "../Context/UserContext";
import DOMPurify from "dompurify";
import { useDarkMode } from "../Context/DarkModeContext";
import usePagination from "../hooks/Pagination"; // 👈 import du hook

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const {  user } = useUser();
  const { isDarkMode } = useDarkMode();
  const auth = getAuth();
  const userProfil = auth.currentUser;
  const bgColor = stringToColor(user?.fullName,);

  const {
    currentPage,
    totalPages,
    currentData: paginatedMessages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(messages, 3); // 👈 par exemple 4 messages par page

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userProfil) return;

      try {
        const q = query(
          collection(db, "messages"),
          where("email", "==", userProfil.email)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userProfil]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      {paginatedMessages.length === 0 ? (
        <p className="text-center text-gray-500">Aucun message trouvé.</p>
      ) : (
        paginatedMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 flex-col rounded-xl shadow p-4 border max-sm:flex-col 
              ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-200 text-gray-900"}`}
          >
            <div className="flex justify-center gap-2">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: bgColor }}
              >
                {user?.initials}
              </div>
              <div className="text-base font-semibold ">{user?.fullName}</div>
            </div>
            <div className="flex-1">
              <div
                className="text-sm mt-1"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(msg.message),
                }}
              ></div>
            </div>
          </div>
        ))
      )}

      {messages.length > 6 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageList;
