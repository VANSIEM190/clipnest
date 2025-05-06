import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebaseconfig";
import { useDarkMode } from "../Context/DarkModeContext";
import { stringToColor } from "../utils/StringToColor";
import Loader from "./Loader";
import { useUser } from "../Context/UserContext";
import usePagination from "../hooks/Pagination";
import ButtonPagination from "./ButtonPagination";
import { FaTrash } from "react-icons/fa"; 
import useSortedQuestions from "../hooks/useSortedQuestions";
import useUsersAreConnected from "../hooks/UsersIsConnecd";

const MessageList = () => {
  const [messageList, setMessageList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useDarkMode();
  const { user } = useUser();
  const sortedMessages = useSortedQuestions(messageList);
  const connectedUserIds = useUsersAreConnected();

  const maxMessagesPerPage = 20;
  const minLengthToPaginate = 6;

  const {
    currentPage,
    totalPages,
    currentData: paginatedMessages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(sortedMessages, maxMessagesPerPage);

  const [localVotes, setLocalVotes] = useState(() => {
    const saved = localStorage.getItem(`votes_${user?.uid}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [reputations, setReputations] = useState({});

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
    const updatedReputations = {};
    messageList.forEach((message) => {
      const likes = message.likes || 0;
      const dislikes = message.dislikes || 0;

      if (likes > dislikes) {
        updatedReputations[message.id] = "Bonne";
      } else if (likes === dislikes) {
        updatedReputations[message.id] = "Moyenne";
      } else {
        updatedReputations[message.id] = "Mauvaise";
      }
    });
    setReputations(updatedReputations);
  }, [messageList]);

  const saveVotes = (votes) => {
    setLocalVotes(votes);
    localStorage.setItem(`votes_${user?.uid}`, JSON.stringify(votes));
  };

  const handleLike = (messageId) => {
    if (!user?.uid) return;

    const votes = { ...localVotes };

    if (votes[messageId]?.liked) return;

    votes[messageId] = { liked: true, disliked: false };
    saveVotes(votes);
  };

  const handleDislike = (messageId) => {
    if (!user?.uid) return;

    const votes = { ...localVotes };

    if (votes[messageId]?.disliked) return;

    votes[messageId] = { liked: false, disliked: true };
    saveVotes(votes);
  };

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
            const vote = localVotes[message.id] || { liked: false, disliked: false };
            const reputation = reputations[message.id];
            const isOnline = connectedUserIds.includes(message.uid);
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
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-xl shadow-inner shrink-0"
                    style={{ backgroundColor: stringToColor(message?.name) }}
                    translate="no"
                  >
                  <span
                    className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-red-500"
                    }`}
                  title={isOnline ? "En ligne" : "Hors ligne"}
                  >
                </span>
                    {message?.nameProfil}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold text-sm sm:text-base truncate">{message?.name}</span>
                    <div className="text-[10px] sm:text-xs text-gray-400 truncate">
                      {formatDate(message?.timestamp)}
                    </div>
                    <div className="text-[11px] sm:text-sm mt-1 font-medium">
                      Réputation :{" "}
                      <span
                        className={`${
                          reputation === "Bonne"
                            ? "text-green-500"
                            : reputation === "Mauvaise"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {reputation}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="text-xs sm:text-sm leading-relaxed mt-1 text-wrap break-words whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: message.message }}
                />

                <div className="flex justify-between items-center gap-2 mt-2 flex-wrap">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleLike(message.id)}
                      disabled={vote.liked}
                      className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm rounded-full transition 
                        ${
                          vote.liked
                            ? "bg-green-500 text-white cursor-not-allowed"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }
                      `}
                    >
                      👍 {vote.liked ? 1 : 0}
                    </button>

                    <button
                      onClick={() => handleDislike(message.id)}
                      disabled={vote.disliked}
                      className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm rounded-full transition 
                        ${
                          vote.disliked
                            ? "bg-red-500 text-white cursor-not-allowed"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }
                      `}
                    >
                      👎 {vote.disliked ? 1 : 0}
                    </button>
                  </div>

                  {user?.fullName === message?.name && (
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

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
