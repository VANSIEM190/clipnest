import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../services/firebaseconfig";
import { useDarkMode } from "../../context/DarkModeContext";
import usePagination from '../../hooks/usePagination'
import ButtonPagination from "../common/ButtonPagination";
import { IoReturnUpBack } from 'react-icons/io5'
import MessagesUsers from '../../pages/AfficheMessagesUser'
import MessageModal from "./MessageModal";

const ResponseList = ({ messageId }) => {
  const [responses, setResponses] = useState([])
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()

  const maxMessagesPerPage = 4
  const {
    currentPage,
    totalPages,
    currentData: paginatedMessages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(responses, maxMessagesPerPage)

  useEffect(() => {
    if (!messageId) return

    const q = query(
      collection(db, 'responses'),
      where('itemId', '==', messageId),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(q, snapshot => {
      const responseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setResponses(responseData)
      console.log(responseData);
      
    })
      
    return () => unsubscribe()
  }, [messageId])

  


  return (
    <>
      <div className="flex-1  w-2/4 mt-4 max-sm:w-full border-t pt-3 space-y-4">
        <h2 className="text-lg font-bold">
          {responses.length < 1
            ? `Réponse (${responses.length})`
            : `Réponses (${responses.length})`}
        </h2>

        <div className="space-y-2">
          {paginatedMessages.map(response => (
            <div
              key={response.id}
              className={`rounded-2xl p-2 sm:p-5 text-sm transition-all duration-300
          ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 text-gray-100 backdrop-blur-sm'
              : 'bg-white/80 backdrop-blur-sm text-gray-900 '
          }
          `}
            >
              <MessagesUsers
                userName={response.userName}
                userProfil={response.userProfil}
                timestamp={response.timestamp}
                messageId={response.id}
                userId={response.userId}
                collectionName={'responses'}
                messageText={response.commentaire}
              />
            </div>
          ))}
        </div>

        <div className="py-2 px-3 flex justify-center items-center gap-2 ">
        <MessageModal 
        itemId={messageId} 
        collectionName={"responses"} 
        />
        <button
            type="button"
            className="rounded-md bg-gray-200 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-300 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <IoReturnUpBack size={18} />
          </button>
        </div>
      {responses.length > maxMessagesPerPage && (
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
    </>
  )
}

export default ResponseList
