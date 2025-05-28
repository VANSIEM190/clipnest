import { stringToColor } from '../utils/StringToColor'
import formatDate from '../utils/formatDate'
import { FaTrash } from 'react-icons/fa'
import { db } from '../services/firebaseconfig'
import { doc, deleteDoc } from 'firebase/firestore'
import { useUser } from '../Context/UserContext'

const MessagesUsers = ({
  userName,
  userProfil,
  timestamp,
  messageId,
  messageText,
}) => {
  const { user } = useUser()

  const handleDelete = async messageId => {
    const confirmDelete = window.confirm(
      'Es-tu sûr de vouloir supprimer ce message ?'
    )
    if (!confirmDelete) return

    const messageRef = doc(db, 'responses', messageId)
    try {
      await deleteDoc(messageRef)
    } catch (error) {
      console.error('Erreur lors de la suppression :', error)
    }
  }

  return (
    <>
      <div className="flex  gap-3 sm:gap-5 relative">
        <div
          className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-xl shadow-inner shrink-0"
          style={{ backgroundColor: stringToColor(userName) }}
        >
          {userProfil}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold text-sm sm:text-base truncate">
            {userName}
          </span>
          <div className="text-[10px] sm:text-xs text-gray-400 truncate">
            {formatDate(timestamp)}
          </div>
          <div className="text-xs sm:text-sm leading-relaxed mt-1 text-wrap break-words whitespace-pre-wrap">
            {messageText}
          </div>
        </div>
      </div>
      {user?.fullName === userName && (
        <div className="absolute right-2 bottom-3">
          <button
            onClick={() => handleDelete(messageId)}
            className="px-1 py-1 sm:px-.5 sm:py-1.5 text-[10px] sm:text-sm bg-red-500 outline-none text-white rounded-full hover:bg-red-600 transition cursor-pointer"
          >
            <FaTrash />
          </button>
        </div>
      )}
    </>
  )
}

export default MessagesUsers
