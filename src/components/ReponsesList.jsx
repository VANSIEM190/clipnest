import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebaseconfig";
import { useUser } from "../Context/UserContext";
import { useDarkMode } from "../Context/DarkModeContext";
import usePagination from '../hooks/usePagination'
import ButtonPagination from "./ButtonPagination";
import {FiSend} from "react-icons/fi";
import { IoReturnUpBack } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import MessagesUsers from '../pages/AfficheMessagesUser'

const ResponseList = ({ messageId }) => {
  const [responses, setResponses] = useState([])
  const [newResponse, setNewResponse] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const { user } = useUser()
  const { isDarkMode } = useDarkMode()

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
      where('messageId', '==', messageId),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(q, snapshot => {
      const responseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setResponses(responseData)
    })

    return () => unsubscribe()
  }, [messageId])

  const handleSendResponse = async () => {
    if (!newResponse.trim()) return

    await addDoc(collection(db, 'responses'), {
      messageId,
      text: newResponse,
      userName: user?.fullName || 'Anonyme',
      userProfil: user?.initials || 'X',
      userId: user?.uid || null,
      timestamp: serverTimestamp(),
    })

    setNewResponse('')
  }

  const handleKeyDown = e => {
    if (newResponse.trim()) {
      setIsVisible(true)
    }
    if (e.key === 'Enter') {
      handleSendResponse()
    }
  }

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
                messageText={response.text}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <textarea
            value={newResponse}
            onChange={e => setNewResponse(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Votre réponse..."
            className="flex-1 px-2 py-1 border rounded text-sm resize-none"
          ></textarea>

          <div className="gap-2">
            <button
              onClick={handleSendResponse}
              className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm bg-blue-500 mr-1
            text-white rounded-full hover:bg-blue-600 transition cursor-pointer
            ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-800/30 via-gray-900/90 to-black/90 text-gray-100'
                : 'bg-gray-400 text-gray-900 hover:bg-gray-500'
            }`}
              disabled={!isVisible}
            >
              <FiSend />
            </button>
            <Link to="/salon">
              <button
                className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm bg-blue-500
              text-white rounded-full hover:bg-blue-600 transition cursor-pointer
              ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-800/30 via-gray-900/90 to-black/90 text-gray-100'
                  : 'bg-gray-400 text-gray-900 hover:bg-gray-500'
              }`}
              >
                <IoReturnUpBack />
              </button>
            </Link>
          </div>
        </div>
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
    </>
  )
}

export default ResponseList
