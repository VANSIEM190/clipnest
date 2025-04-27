import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebaseconfig";
import { useDarkMode } from "../Context/DarkModeContext";
import { stringToColor } from "../utils/StringToColor";
import Loader from "./Loader";
import { useUser } from "../Context/UserContext";
import usePagination from "../hooks/Pagination";
import ButtonPagination from "./ButtonPagination";
import { FaTrash } from "react-icons/fa"; // Importer l'icône de suppression

const MessageList = () => {
  const [messageList, setMessageList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useDarkMode();
  const { user } = useUser();

  const maxMessagesPerPage = 20;
  const minLengthToPaginate = 20;

  const {
    currentPage,
    totalPages,
    currentData: paginatedMessages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(messageList, maxMessagesPerPage);

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
    const saved = localStorage.getItem(`votes_${user?.uid}`);
    if (saved) {
      setLocalVotes(JSON.parse(saved));
    } else {
      setLocalVotes({});
    }
  }, [user?.uid]);

  useEffect(() => {
    const updatedReputations = {};
    messageList.forEach((message) => {
      const vote = localVotes[message.id] || { liked: false, disliked: false };
      if (vote.liked && !vote.disliked) {
        updatedReputations[message.id] = "Bonne";
      } else if (vote.disliked) {
        updatedReputations[message.id] = "Mauvaise";
      } else {
        updatedReputations[message.id] = "Moyenne";
      }
    });
    setReputations(updatedReputations);
  }, [localVotes, messageList]);

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
            const reputation = reputations[message.id] ;

            return (
              <div
                key={message.id}
                className={`flex flex-col gap-3 rounded-2xl p-5 border shadow-md transition-all duration-300 
                  ${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-200"
                      : "bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-900"
                  }
                  hover:shadow-2xl
                `}
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-white text-xl sm:text-2xl shadow-inner"
                    style={{ backgroundColor: stringToColor(message?.name) }}
                    translate="no"
                  >
                    {message?.nameProfil}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-base sm:text-lg md:text-xl">{message?.name}</span>
                    <div className="text-xs sm:text-sm text-gray-400">
                      {formatDate(message?.timestamp)}
                    </div>
                    <div className="text-xs sm:text-sm mt-1 font-medium">
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
                  className="text-sm sm:text-base leading-relaxed mt-2 whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{ __html: message.message }}
                />

                <div className="flex justify-between items-center gap-3 mt-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleLike(message.id)}
                      disabled={vote.liked}
                      className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full transition 
                        ${
                          vote.liked
                            ? "bg-green-400 text-white cursor-not-allowed"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }
                      `}
                    >
                      👍 {vote.liked ? 1 : 0}
                    </button>

                    <button
                      onClick={() => handleDislike(message.id)}
                      disabled={vote.disliked}
                      className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full transition 
                        ${
                          vote.disliked
                            ? "bg-red-400 text-white cursor-not-allowed"
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
                      className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <FaTrash /> {/* Ajouter l'icône ici */}
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
