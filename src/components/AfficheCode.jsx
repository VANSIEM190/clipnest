import { db } from "../services/firebaseconfig"
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { ToastContainer, toast } from 'react-toastify'
import { useDarkMode } from '../Context/DarkModeContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { stringToColor } from '../utils/StringToColor'
import { FaCopy, FaCommentDots } from 'react-icons/fa'
import usePagination from '../hooks/usePagination'
import { FileurLoader } from './Loader'
import ButtonPagination from './ButtonPagination'
import Prism from 'prismjs'
import '../utils/prismLanguages'
import 'prismjs/themes/prism-tomorrow.css'

const AffCode = () => {
  const [code, setCode] = useState([])
  const [loading, setLoading] = useState(true)
  const { isDarkMode } = useDarkMode()
  const minLengthToPaginate = 5
  const maxSnippetsCodePerPage = 15
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
      })
      return () => unsubscribe()
    } catch (error) {
      console.error('Erreur lors de la récupération des codes :', error)
      toast.error('Une erreur est survenue lors de la récupération des codes')
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    Prism.highlightAll()
  }, [code])

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
                  <span
                    className={`${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    } font-semibold text-sm sm:text-base truncate`}
                  >
                    {`${item.prenom} ${item.nom}`}
                  </span>
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
                <Link to={`/code-Id/${item.id}`}>
                  <button
                    type="button"
                    className="relative cursor-pointer mt-1.5"
                  >
                    <span className="absolute left-2.5 bottom-2.5 flex items-center justify-center text-sm w-4 h-4 rounded-full bg-red-500 text-white">
                      0
                    </span>
                    <FaCommentDots size={18} />
                  </button>
                </Link>
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
