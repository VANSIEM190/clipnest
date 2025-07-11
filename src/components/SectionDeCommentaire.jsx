import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoc , doc } from "firebase/firestore";
import { useDarkMode } from "../Context/DarkModeContext";
import { db } from "../services/firebaseconfig";
import { ToastContainer , toast } from "react-toastify";
import { stringToColor } from "../utils/StringToColor";
import { FileurLoader } from "./Loader";
import Prism from 'prismjs'
import "../utils/prismLanguages"
import 'prismjs/themes/prism-tomorrow.css'
import Navbar from "./Navbar";
import CommentsUsers from "./commentairesUsers";
import formatDate from '../utils/formatDate'

const SectionDeCommentaire = () => {
  const [isCodeToComment, setIsCodeToComment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { codeId } = useParams()
  const { isDarkMode } = useDarkMode()

  useEffect(() => {
    const fetchDocUser = async () => {
      try {
        const codeCommentRef = doc(db, 'snippets', codeId)
        const codeCommentSnap = await getDoc(codeCommentRef)
        if (codeCommentSnap.exists()) {
          const data = codeCommentSnap.data()
          setIsCodeToComment({ id: codeCommentSnap.id, ...data })
          setIsLoading(false)
        } else {
          toast.error('Erreur lors du chargement, veuillez actualiser la page')
        }
      } catch {
        toast.error('Une erreur est survenue')
      }
    }
    fetchDocUser()
  }, [codeId])

  useEffect(() => {
    if (!isLoading && isCodeToComment) {
      Prism.highlightAll()
    }
  }, [isLoading, isCodeToComment])

  const language = isCodeToComment?.language?.toLowerCase() || 'javascript'

  return (
    <>
      {isLoading ? (
        <FileurLoader />
      ) : (
        <>
          <Navbar />
          <div
            className={`${
              isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
            }  min-h-screen flex justify-center flex-col items-center gap-2 overflow-hidden`}
          >
            <div
              className={`${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-200'
              } w-2/4 max-sm:w-3/4 rounded-lg shadow-md p-4 mt-5`}
            >
              <div className="flex gap-3 sm:gap-5">
                <div
                  className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-xl shadow-inner shrink-0"
                  style={{
                    backgroundColor: stringToColor(
                      `${isCodeToComment.prenom} ${isCodeToComment.nom}`
                    ),
                  }}
                >
                  {`${isCodeToComment.prenom.charAt(
                    0
                  )}${isCodeToComment.nom.charAt(0)}`.toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    } font-semibold text-sm sm:text-base truncate`}
                  >
                    {`${isCodeToComment.prenom} ${isCodeToComment.nom}`}
                  </span>
                  <div className="text-[10px] sm:text-xs text-gray-400 truncate">
                    {formatDate(isCodeToComment.date)}
                  </div>
                </div>
              </div>
              <div
                className={`${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                } flex justify-between mt-7`}
              >
                <p className="text-sm mb-4">{isCodeToComment.language}</p>
              </div>

              <pre className="bg-transparent p-4 rounded-lg overflow-auto">
                <code className={`language-${language}`}>
                  {isCodeToComment.code}
                </code>
              </pre>

              <div
                className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
              >
                <p className="text-xs sm:text-sm leading-relaxed mt-1 text-wrap break-words whitespace-pre-wrap">
                  mon commentaire : {isCodeToComment.commentaireUser}
                </p>
              </div>
            </div>
            <div></div>
            <CommentsUsers codeId={codeId} />
          </div>
        </>
      )}
    </>
  )
}

export default SectionDeCommentaire;
