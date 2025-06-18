import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, onSnapshot, getDocs } from 'firebase/firestore'
import { db } from '../services/firebaseconfig'
import { getDatabase, ref, onValue } from 'firebase/database'
import { useDarkMode } from '../Context/DarkModeContext'
import { FileurLoader } from './Loader'
import { useUser } from '../Context/UserContext'
import usePagination from '../hooks/Pagination'
import ButtonPagination from './ButtonPagination'
import useSortedQuestions from '../hooks/useSortedQuestions'
import MessagesUsers from '../pages/AfficheMessagesUser'
import { FaEnvelope, FaCommentDots } from 'react-icons/fa'
import { stringToColor } from '../utils/StringToColor'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const UsersMessages = () => {
  const [messageList, setMessageList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isDarkMode } = useDarkMode()
  const { user } = useUser()
  const [responseCounts, setResponseCounts] = useState({})
  const [onlineStatuses, setOnlineStatuses] = useState({})
  const sortedMessages = useSortedQuestions(messageList)
  const [users, setUsers] = useState([])
  const realTimeDb = getDatabase()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleUsers] = useState(10) // nombre d'utilisateurs visibles à la fois

  const maxMessagesPerPage = 20
  const minLengthToPaginate = 6

  const {
    currentPage,
    totalPages,
    currentData: paginatedMessages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(sortedMessages, maxMessagesPerPage)

  useEffect(() => {
    try {
      const messagesRef = collection(db, 'messages')
      const unsubscribe = onSnapshot(
        messagesRef,
        snapshot => {
          const updatedMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          setMessageList(updatedMessages)
          setIsLoading(false)
        },
        error => {
          console.error('Erreur de lecture des messages:', error)
        }
      )

      const statusRef = ref(realTimeDb, 'status')
      const unsubscribeStatus = onValue(statusRef, snapshot => {
        if (snapshot.exists()) {
          const statuses = snapshot.val()
          const formattedStatuses = {}

          Object.entries(statuses).forEach(([userId, status]) => {
            formattedStatuses[userId] = {
              isOnline: status.isActivelyUsing === true,
              lastSeen: status.lastActivity,
              state: status.state,
            }
          })

          setOnlineStatuses(formattedStatuses)
        }
      })

      return () => {
        unsubscribe()
        unsubscribeStatus()
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation de l'écoute:", error)
      setIsLoading(false)
    }
  }, [realTimeDb])

  useEffect(() => {
    const fetchResponseCounts = async () => {
      try {
        const responsesRef = collection(db, 'responses')
        const snapshot = await getDocs(responsesRef)
        const counts = {}
        snapshot.forEach(doc => {
          const data = doc.data()
          if (data.messageId) {
            counts[data.messageId] = (counts[data.messageId] || 0) + 1
          }
        })
        setResponseCounts(counts)
      } catch (error) {
        console.error('Erreur lors de la récupération des réponses:', error)
      }
    }

    fetchResponseCounts()
  }, [messageList])
  useEffect(() => {
    // Récupérer tous les utilisateurs de Firestore avec leur dernière connexion
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'))
        const userList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastSeen: doc.data().lastSeen?.toDate?.() || null,
        }))
        setUsers(userList)
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des utilisateurs :',
          error
        )
      }
    }
    fetchUsers()
  }, [])

  //  fonction pour gérer le défilement
  const nextSlide = () => {
    const onlineUsers = users.filter(user => onlineStatuses[user.id]?.isOnline)
    setCurrentIndex(prevIndex =>
      prevIndex + visibleUsers >= onlineUsers.length ? 0 : prevIndex + 1
    )
  }

  // prévisualiser le défilement
  const previousSlide = () => {
    const onlineUsers = users.filter(user => onlineStatuses[user.id]?.isOnline)
    setCurrentIndex(prevIndex =>
      prevIndex === 0
        ? Math.max(0, onlineUsers.length - visibleUsers)
        : prevIndex - 1
    )
  }

  // naviguer sur l'onglet des réponses
  const toggleResponseView = messageId => {
    navigate(`/message/${messageId}`)
  }

  if (isLoading) return <FileurLoader />

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className={` ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`p-4 sm:p-6 max-w-4xl mx-auto space-y-6`}>
          {paginatedMessages.length === 0 ? (
            <p className="text-center text-gray-500">Aucun message trouvé.</p>
          ) : (
            <>
              {/* affichage des utilisateur connectés */}
              <div className="flex justify-center ">
                <div
                  className={`relative flex items-center gap-3 px-3 ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 text-gray-100'
                      : 'bg-white/80 text-gray-900'
                  } rounded-2xl p-2 sm:p-5`}
                >
                  <button
                    onClick={previousSlide}
                    className="absolute left-0 z-10 p-1 sm:p-2 bg-gray-400 rounded-full text-white hover:bg-gray-700 cursor-pointer"
                  >
                    &#8249;
                  </button>

                  <div className="flex items-center gap-2 overflow-hidden">
                    {users
                      .filter(user => onlineStatuses[user.id]?.isOnline)
                      .slice(currentIndex, currentIndex + visibleUsers)
                      .map((user, idUser) => (
                        <div className="flex items-center gap-2" key={idUser}>
                          <div
                            className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center mx-2
                        justify-center font-semibold text-white text-sm sm:text-xl shadow-inner shrink-0"
                            title="en ligne"
                            style={{
                              backgroundColor: stringToColor(
                                `${user.prenom} ${user.nom}`
                              ),
                            }}
                          >
                            {`${user.prenom.charAt(0)} ${user.nom.charAt(
                              0
                            )}`.toUpperCase()}
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-green-500" />
                          </div>
                        </div>
                      ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    className="absolute right-0 z-10 p-1  sm:p-2 bg-gray-400 rounded-full text-white hover:bg-gray-700 cursor-pointer"
                  >
                    &#8250;
                  </button>
                </div>
              </div>

              {/* card message */}
              {paginatedMessages.map(message => {
                return (
                  <div
                    key={message.id}
                    className={`flex flex-col gap-3 rounded-2xl p-2 sm:p-5  transition-all duration-300 w-full 
            ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 text-gray-100 backdrop-blur-sm'
                : 'bg-white/80 backdrop-blur-sm text-gray-900 '
            }
            hover:shadow-xl
          `}
                  >
                    <MessagesUsers
                      userName={message.name}
                      userProfil={message.nameProfil}
                      timestamp={message.timestamp}
                      messageId={message.id}
                      userId={message.userId}
                      collectionName={'messages'}
                      messageText={message.message}
                    />
                    <div className="flex justify-between items-center gap-2 mt-2 flex-wrap">
                      {user?.fullName !== message?.name ? (
                        <div className="flex items-center justify-center  gap-2">
                          <a href={`mailto:${message?.email}`}>
                            <FaEnvelope size={18} />
                          </a>
                          <button
                            type="button"
                            className="relative cursor-pointer"
                            onClick={() => toggleResponseView(message.id)}
                          >
                            <span className="absolute left-2.5 bottom-2.5 flex items-center justify-center text-sm w-4 h-4 rounded-full bg-red-500 text-white">
                              {responseCounts[message.id] || 0}
                            </span>
                            <FaCommentDots size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="relative cursor-pointer"
                          onClick={() => toggleResponseView(message.id)}
                        >
                          <span className="absolute left-2.5 bottom-2.5 flex items-center justify-center text-sm w-4 h-4 rounded-full bg-red-500 text-white">
                            {responseCounts[message.id] || 0}
                          </span>
                          <FaCommentDots size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                )
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
      </div>
    </>
  )
}

export default UsersMessages
