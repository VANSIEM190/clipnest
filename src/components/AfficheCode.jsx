import { db } from "../services/firebaseconfig"
import { useEffect, useState } from "react"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { ToastContainer, toast } from "react-toastify"
import { useDarkMode } from "../Context/DarkModeContext"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { stringToColor } from "../utils/StringToColor"
import { FaCopy } from "react-icons/fa"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css" // 🌑 thème foncé, tu peux choisir d'autres : prism.css, prism-okaidia.css, etc.
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-python"
// Ajoute d'autres langages si tu veux (prism-java, prism-css...)

const AffCode = () => {
  const [code, setCode] = useState([])
  const [loading, setLoading] = useState(true)
  const { isDarkMode } = useDarkMode()

  useEffect(() => {
    try {
      const queryCode = query(collection(db, "snippets"), orderBy("date", "desc"))
      const unsubscribe = onSnapshot(queryCode, (snapshot) => {
        const codeData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setCode(codeData)

      })
      return () => unsubscribe()
    } catch (error) {
      console.error("Erreur lors de la récupération des codes :", error)
      toast.error("Une erreur est survenue lors de la récupération des codes")
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    Prism.highlightAll()
  }, [code])


  return (
    <>
      <ToastContainer />
      <Navbar />
      <Sidebar />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className={`mx-auto p-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
          <h1 className="text-center text-2xl font-bold mb-4">Codes partagés</h1>
          <div className="flex flex-col justify-center items-center gap-3">
            {code.map((item) => (
              <div
                key={item.id}
                className={`${isDarkMode ? "bg-gray-900" : "bg-gray-200"} w-2/4 max-sm:w-3/4 rounded-lg shadow-md p-4`}
              >
                <div className="flex gap-3 sm:gap-5">
                  <div
                    className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-xl shadow-inner shrink-0"
                    style={{ backgroundColor: stringToColor(`${item.prenom} ${item.nom}`) }}
                  >
                    {`${item.prenom.charAt(0)}${item.nom.charAt(0)}`.toUpperCase()}
                  </div>
                  <span className={`${isDarkMode? "text-gray-100" : "text-gray-900"} font-semibold text-sm sm:text-base truncate`}>
                    {`${item.prenom} ${item.nom}`}
                  </span>
                </div>
                <div className={`${isDarkMode ? "text-gray-100" : "text-gray-900"} flex justify-between mt-7`}>
                  <p className="text-sm  mb-4">{item.language}</p>
                  <FaCopy size={18} />
                </div>

                <pre className="bg-transparent p-4 rounded-lg overflow-auto">
                  <code className={`language-${item.language?.toLowerCase() || "javascript"}`}>
                    {item.code}
                  </code>
                </pre>

                <div className={`${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                  <p className="text-xs sm:text-sm leading-relaxed mt-1 text-wrap break-words whitespace-pre-wrap">
                    mon commentaire : {item.commentaireUser}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default AffCode
