import { db } from "../services/firebaseconfig"
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
import { ToastContainer, toast } from 'react-toastify'
import { useDarkMode } from '../Context/DarkModeContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { stringToColor } from '../utils/StringToColor'
import { FaCopy, FaCommentDots, FaTrash } from 'react-icons/fa'
import usePagination from '../hooks/usePagination'
import { FileurLoader } from './Loader'
import ButtonPagination from './ButtonPagination'
import Prism from 'prismjs'
import '../utils/prismLanguages'
import 'prismjs/themes/prism-tomorrow.css'
import { useUser } from '../Context/UserContext'
import formatDate from '../utils/formatDate'

const AffCode = () => {
  const [code, setCode] = useState([])
  const [isCountComments, setIsCountComments] = useState({})
  const [loading, setLoading] = useState(true)
  const { isDarkMode } = useDarkMode()
  const { user } = useUser()
  const minLengthToPaginate = 5
  const maxSnippetsCodePerPage = 7
  const {
    currentPage,
    totalPages,
    currentData: paginatedMessages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(code, maxSnippetsCodePerPage)

  useEffect(() => {
    try {
      const queryCode = query(
        collection(db, 'snippets'),
        orderBy('date', 'desc')
      )
      const unsubscribe = onSnapshot(queryCode, snapshot => {
        const codeData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setCode(codeData)
        setLoading(false)
      })
      return () => unsubscribe()
    } catch (error) {
      console.error('Erreur lors de la récupération des codes :', error)
      toast.error('Une erreur est survenue lors de la récupération des codes')
    }
  }, [])

  useEffect(() => {
    const fetchCommentCounts = async () => {
      try {
        const commentRef = collection(db, 'commentCode')
        const querySnapshot = await getDocs(commentRef)
        const counts = {}
        querySnapshot.forEach(snapshot => {
          const idComment = snapshot.data().codeId
          if (idComment) {
            counts[idComment] = (counts[idComment] || 0) + 1
          }
        })
        setIsCountComments(counts)
      } catch {
        toast.error('erreur lors de la recupération de nombre de message')
      }
    }

    fetchCommentCounts()
  }, [])
  useEffect(() => {
    Prism.highlightAll()
  }, [paginatedMessages])

  const CopierLeCode = code => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success('code copié avec succés')
      })
      .catch(() => {
        toast.error("une erreur s'est produit")
      })
  }

  return (
    <>
      <ToastContainer />
      <Navbar />
      {loading ? (
        <FileurLoader />
      ) : (
        <div
          className={`overflow-auto mx-auto p-4 min-h-screen flexjustify-center max-sm:justify-between ${
            isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
          }`}
        >
          <Sidebar />

          <div className="flex flex-col justify-center items-center gap-3">
            {paginatedMessages.map(item => (
              <div
                key={item.id}
                className={`${
                  isDarkMode ? 'bg-gray-900' : 'bg-gray-200'
                } w-2/4 max-sm:w-3/4 rounded-lg shadow-md p-4`}
              >
                <div className="flex gap-3 sm:gap-5">
                  <div
                    className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-xl shadow-inner shrink-0"
                    style={{
                      backgroundColor: stringToColor(
                        `${item.prenom} ${item.nom}`
                      ),
                    }}
                  >
                    {`${item.prenom.charAt(0)}${item.nom.charAt(
                      0
                    )}`.toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      } font-semibold text-sm sm:text-base truncate`}
                    >
                      {`${item.prenom} ${item.nom}`}
                    </span>
                    <div className="text-[10px] sm:text-xs text-gray-400 truncate">
                      {formatDate(item.date)}
                    </div>
                  </div>
                </div>
                <div
                  className={`${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  } flex justify-between items-center mt-7`}
                >
                  <p className="text-sm">{item.language}</p>
                  <button
                    type="button"
                    onClick={() => CopierLeCode(item.code)}
                    className="cursor-pointer"
                    title="copier le code"
                  >
                    <div className="flex items-center justify-center">
                      <FaCopy size={18} />
                      copier
                    </div>
                  </button>
                </div>

                <pre className="bg-transparent p-4 rounded-lg overflow-auto">
                  <code
                    className={`language-${
                      item.language?.toLowerCase() || 'javascript'
                    }`}
                  >
                    {item.code}
                  </code>
                </pre>

                <div
                  className={`${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed mt-1 text-wrap break-words whitespace-pre-wrap">
                    mon commentaire : {item.commentaireUser}
                  </p>
                </div>
                <div className=" relative flex justify-between items-center w-full px-1">
                  <Link to={`/code-Id/${item.id}`}>
                    <button
                      type="button"
                      className="relative cursor-pointer mt-1.5"
                    >
                      <span className="absolute left-2.5 bottom-2.5 flex items-center justify-center text-sm w-4 h-4 rounded-full bg-red-500 text-white">
                        {isCountComments[item.id] || 0}
                      </span>
                      <FaCommentDots size={18} />
                    </button>
                  </Link>
                  {item.idUser === user?.uid && (
                    <button
                      type="button"
                      className="absolute bottom-1.5 right-2.5 cursor-pointer text-red-400"
                    >
                      <FaTrash size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {code.length > minLengthToPaginate && (
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
      )}
    </>
  )
}

export default AffCode
