import  { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { collection, onSnapshot, getDocs, } from "firebase/firestore";
import { db } from "../services/firebaseconfig";
import { useDarkMode } from "../Context/DarkModeContext";
import { FileurLoader} from "./Loader";
import { useUser } from "../Context/UserContext";
import usePagination from "../hooks/Pagination";
import ButtonPagination from "./ButtonPagination";
import useSortedQuestions from "../hooks/useSortedQuestions";
import MessagesUsers from "./MessagesUsers";
import {FaEnvelope , FaCommentDots} from "react-icons/fa";


const MessageList = () => {
  const [messageList, setMessageList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useDarkMode();
  const { user } = useUser();
  const [responseCounts, setResponseCounts] = useState({});
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
    navigate(`/message/${messageId}`);
  };


  if (isLoading) return <FileurLoader />;

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
            className={`flex flex-col gap-3 rounded-2xl p-2 sm:p-5  transition-all duration-300 w-full 
            ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 text-gray-100 backdrop-blur-sm"
                : "bg-white/80 backdrop-blur-sm text-gray-900 "
            }
            hover:shadow-xl
          `}
            >
              <MessagesUsers 
              userName={message.name} 
              userProfil={message.nameProfil} 
              timestamp={message.timestamp} 
              messageId={message.id} 
              messageText={message.message}
              />
              <div className="flex justify-between items-center gap-2 mt-2 flex-wrap">
                    {user?.fullName !== message?.name ? (
                    <div className="flex items-center justify-center  gap-2">
                      <a href={`mailto:${message?.email}`}>
                        <FaEnvelope  size={18}/>
                      </a>
                    <button 
                      type="button" 
                      className="relative cursor-pointer"
                      onClick={() => toggleResponseView(message.id)}
                      >
                        <span className="absolute left-2.5 bottom-2.5 flex items-center justify-center text-sm w-4 h-4 rounded-full bg-red-500 text-white">{responseCounts[message.id] || 0}</span>
                        <FaCommentDots size={18} />
                    </button>
                  </div>
                  ) :
                  (
                    <button 
                      type="button" 
                      className="relative cursor-pointer"
                      onClick={() => toggleResponseView(message.id)}
                      >
                        <span className="absolute left-2.5 bottom-2.5 flex items-center justify-center text-sm w-4 h-4 rounded-full bg-red-500 text-white">{responseCounts[message.id] || 0}</span>
                        <FaCommentDots size={18} />
                    </button> 
                  )}
                </div>
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
