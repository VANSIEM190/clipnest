import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot, // ✅ Correction ici
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../services/firebaseconfig";
import { useUser } from "../Context/UserContext";
import { useDarkMode } from "../Context/DarkModeContext";
import { stringToColor } from "../utils/StringToColor";
import Loader from "./Loader";
import usePagination from "../hooks/Pagination";


const MessageList = () => {
  const [messageList, setMessageList] = useState([]);
  const [localVotes, setLocalVotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useUser();
  const { isDarkMode } = useDarkMode();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const userColor = stringToColor(user?.fullName);
  const maxMessagesPerPage = 3;
  const minLengthToPaginate = 6;

  const {
    currentPage,
    totalPages,
    currentData: paginatedMessages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(messageList, maxMessagesPerPage);

  const fetchMessages = () => {
    if (!currentUser) return;

    const messagesRef = collection(db, "messages");

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const updatedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const votesFromDB = {};
      updatedMessages.forEach((msg) => {
        votesFromDB[msg.id] = {
          votesUp: msg.votesUp || 0,
          votesDown: msg.votesDown || 0,
        };
      });

      setMessageList(updatedMessages);
      setLocalVotes(votesFromDB);
      setIsLoading(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    let unsubscribe;

    if (navigator.onLine) {
      unsubscribe = fetchMessages(); // Appel immédiat si en ligne
    }

    const handleOnline = () => {
      unsubscribe = fetchMessages(); // Reconnexion détectée
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  const handleVoteMessage = async (messageId, voteType) => {
    if (!currentUser) return;

    const currentVotes = localVotes[messageId] || { votesUp: 0, votesDown: 0 };
    const voteField = voteType === "up" ? "votesUp" : "votesDown";

    setLocalVotes((prevVotes) => ({
      ...prevVotes,
      [messageId]: {
        ...currentVotes,
        [voteField]: currentVotes[voteField] + 1,
      },
    }));

    try {
      const messageRef = doc(db, "messages", messageId);
      await updateDoc(messageRef, {
        [voteField]: currentVotes[voteField] + 1,
      });

      const voteRef = doc(db, "messages", messageId, "votes", currentUser.uid);
      await setDoc(voteRef, {
        type: voteType,
        votedAt: new Date(),
      });
    } catch (error) {
      console.error("Erreur lors du vote :", error);
      setLocalVotes((prevVotes) => ({
        ...prevVotes,
        [messageId]: currentVotes,
      }));
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      {paginatedMessages.length === 0 ? (
        <p className="text-center text-gray-500">Aucun message trouvé.</p>
      ) : (
        paginatedMessages.map((message) => {
          const votes = localVotes[message.id] || { votesUp: 0, votesDown: 0 };
          const hasGoodReputation = votes.votesUp > votes.votesDown;
          const reputationLabel = hasGoodReputation ? "Bonne réputation" : "Mauvaise réputation";

          return (
            <div
              key={message.id}
              className={`flex flex-col gap-2 rounded-xl shadow p-4 border ${
                isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-200 text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className=" w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: userColor }}
                >
                  {user?.initials}
                </div>
                <div className="font-semibold">{user?.fullName}</div>
              </div>

              <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: message.message,
                }}
              ></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVoteMessage(message.id, "up")}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    👍 {votes.votesUp}
                  </button>
                  <button
                    onClick={() => handleVoteMessage(message.id, "down")}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    👎 {votes.votesDown}
                  </button>
                  <span className="text-xs italic ml-2">{reputationLabel}</span>
                </div>
              </div>
            </div>
          );
        })
      )}

      {messageList.length > minLengthToPaginate && (
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
