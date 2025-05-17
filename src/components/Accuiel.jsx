import  { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { collection, onSnapshot, deleteDoc, doc,getDocs, } from "firebase/firestore";
import { db } from "../services/firebaseconfig";
import { useDarkMode } from "../Context/DarkModeContext";
import { stringToColor } from "../utils/StringToColor";
import Loader from "./Loader";
import { useUser } from "../Context/UserContext";
import usePagination from "../hooks/Pagination";
import ButtonPagination from "./ButtonPagination";
import { FaTrash } from "react-icons/fa"; 
import useSortedQuestions from "../hooks/useSortedQuestions";


const MessageList = () => {
  const [messageList, setMessageList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useDarkMode();
  const { user } = useUser();
  const [responseCounts, setResponseCounts] = useState({});
    const [expandedMessageId, setExpandedMessageId] = useState(null);
  const sortedMessages = useSortedQuestions(messageList);
  const navigate = useNavigate();

  const maxMessagesPerPage = 20;
  const minLengthToPaginate = 6;

  const {
    currentPage,
    totalPages,
    currentData: paginatedMessages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(sortedMessages, maxMessagesPerPage);


  useEffect(() => {
    if (!user?.uid) return;

    const messagesRef = collection(db, "messages");
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const updatedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessageList(updatedMessages);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
  const fetchResponseCounts = async () => {
    const responsesRef = collection(db, "responses");
    const snapshot = await getDocs(responsesRef);
    const counts = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.messageId) {
        counts[data.messageId] = (counts[data.messageId] || 0) + 1;
      }
    });
    setResponseCounts(counts); 
  };

  fetchResponseCounts();
}, [messageList]);


  const toggleResponseView = (messageId) => {
    setExpandedMessageId(messageId);
    navigate(`/message/${messageId}`);
  };


//supression du message
  const handleDelete = async (messageId) => {
    const confirmDelete = window.confirm("Es-tu sûr de vouloir supprimer ce message ?");
    if (!confirmDelete) return;

    const messageRef = doc(db, "messages", messageId);
    try {
      await deleteDoc(messageRef);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  // Affiche la date au format "Aujourd'hui à HH:mm" ou "Hier à HH:mm" ou "JJ/MM/AAAA HH:mm"
  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "";
    const date = new Date(timestamp.toDate());
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Aujourd'hui à ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (isYesterday) {
      return `Hier à ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return date.toLocaleString();
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {paginatedMessages.length === 0 ? (
        <p className="text-center text-gray-500">Aucun message trouvé.</p>
      ) : (
        <>
          {paginatedMessages.map((message) => {
            return (
              <div
                key={message.id}
                className={`flex flex-col gap-3 rounded-2xl p-2 sm:p-5 border shadow-md transition-all duration-300 w-full min-w-[100px]
                  ${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 text-gray-100 backdrop-blur-sm"
                      : "bg-white/80 backdrop-blur-sm text-gray-900"
                  }
                  hover:shadow-xl
                `}
              >
                <div className="flex items-center gap-3 sm:gap-5">
                  <div
                    className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-xl shadow-inner shrink-0"
                    style={{ backgroundColor: stringToColor(message?.name) }}
                    translate="no"
                  >
                    {message?.nameProfil}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold text-sm sm:text-base truncate">{message?.name}</span>
                    <div className="text-[10px] sm:text-xs text-gray-400 truncate">
                      {formatDate(message?.timestamp)}
                    </div>
                  </div>
                </div>
                <div
                  className="text-xs sm:text-sm leading-relaxed mt-1 text-wrap break-words whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: message.message }}
                />

                {/* deux button de réponse avec email ou sans email */}
                <div className="flex justify-between items-center gap-2 mt-2 flex-wrap">
                  {
                    user?.fullName !== message?.name ? (
                      <div className="flex items-center justify-center  gap-2">
                        <button 
                        type="button" 
                        className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm  bg-blue-500
                          text-white rounded-full  transition cursor-pointer
                          ${isDarkMode? "bg-gradient-to-br from-gray-800/30 via-gray-900/90 to-black/90 text-gray-100 "
                      : "bg-gray-300  text-gray-900 hover:bg-gray-400"}
                        `}>
                          <a href={`mailto:${message?.email}`}>Envoyez un Email</a>
                        </button>
                        <button 
                        type="button" 
                        className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm bg-blue-500
                        text-white rounded-full hover:bg-blue-600 transition cursor-pointer
                        ${isDarkMode? "bg-gradient-to-br from-gray-800/30 via-gray-900/90 to-black/90 text-gray-100 "
                      : "bg-gray-300  text-gray-900 hover:bg-gray-400"}
                        `}
                        onClick={() => toggleResponseView(message.id)}
                        >
                          {responseCounts[message.id] || 0} Réponse(s)
                      </button>
                      </div>
                  ) :
                  (
                    <button 
                    type="button" 
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm bg-blue-500 
                    rounded-full  transition cursor-pointer text-white
                    ${isDarkMode? "bg-gradient-to-br from-gray-800/30 via-gray-900/90 to-black/90 text-gray-100 "
                      : "bg-gray-300  text-gray-900 hover:bg-gray-400"}
                    `}
                      onClick={() => toggleResponseView(message.id)}
                    >
                        {responseCounts[message.id] || 0} Réponse(s)
                      </button>
                  )}
                  {/* button de suppression du message */}

                  {user?.fullName === message?.name && (
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                {/* Affichage de la réponse */}
                    
              </div>
            );
          })}
        </>
      )}

      {/* les boutons dela pagination */}
      {messageList.length > minLengthToPaginate && (
        <div className="flex justify-center mt-6">
          <ButtonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
          />
        </div>
      )}
    </div>
  );
};

export default MessageList;
