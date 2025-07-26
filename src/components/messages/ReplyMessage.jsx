// pages/MessageResponses.jsx
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseconfig'
import ResponseList from './ReponsesList.jsx'
import { useDarkMode } from '../../context/DarkModeContext.jsx'
import { FileurLoader } from '../common'
import { Navbar } from '../layout'

const ReplyMessage = () => {
  const { isDarkMode } = useDarkMode()
  const { messageId } = useParams()
  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // Récupérer le message
      const messageRef = doc(db, 'messages', messageId)
      const messageSnap = await getDoc(messageRef)
      if (messageSnap.exists()) {
        setMessage({ id: messageSnap.id, ...messageSnap.data() })
        setIsLoading(false)
      }
    }

    fetchData()
  }, [messageId])

  return (
    <>
      <Navbar />
      <div
        className={`w-screen min-h-screen flex justify-between items-center flex-col mx-auto p-4 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
        }`}
      >
        {isLoading ? (
          <FileurLoader />
        ) : (
          message && (
            <div
              className={` w-2/4  max-sm:w-full  border p-4 rounded-lg shadow
          ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 text-gray-100'
              : 'bg-white/80 text-gray-900'
          }`}
            >
              <h2 className="text-lg font-bold">Message original</h2>
              <p className="mt-2 ">{message.message}</p>
              <div className="mt-2 text-sm truncate">
                Posté par {message.name} ({message.email})
              </div>
            </div>
          )
        )}
        <ResponseList messageId={messageId} />
      </div>
    </>
  )
}

export default ReplyMessage
