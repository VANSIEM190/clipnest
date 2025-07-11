import { useState , useEffect } from "react";
import { onSnapshot , collection , query , where , orderBy, doc , deleteDoc } from "firebase/firestore";
import { db } from "../services/firebaseconfig";
import { toast } from "react-toastify";
import {FileurLoader} from "./Loader"
import { useDarkMode } from "../Context/DarkModeContext";
import { stringToColor } from "../utils/StringToColor";
import "../utils/prismLanguages"
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import { FaTrash , FaCopy } from "react-icons/fa";
import { useUser } from "../Context/UserContext";
import formatDate from "../utils/formatDate";

const AfficheCommentairesUsers = ({codeId}) =>{

  const [CommentsUsers, setCommentsUsers] = useState([]);
  const [isLoading , setIsLoading] = useState(true)
  const {isDarkMode} = useDarkMode()
  const {user} = useUser();

  useEffect(()=>{
    // récuperation des données depuis firebase/firestore
    try{
    const queryCommentsUsers = query(
      collection(db , "commentCode"),
      where('codeId' , '==', codeId),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(queryCommentsUsers , snapshot=>{
      const comments = snapshot.docs.map(data =>({
        id: data.id,
        ...data.data(),
      }))
      setCommentsUsers(comments);
      setIsLoading(false)
    })
    return ()=> unsubscribe()
  }
  catch{
    toast.error("une erreur s'est produit lors du chargement veillez actualiser la page")
  }
  },[codeId])

  useEffect(() => {
    Prism.highlightAll()
  }, [CommentsUsers])
  

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

  const deleteComment = async (idDoc) =>{
    const confirmDelete = confirm('Es-tu sûr de vouloir supprimer ce message ?')
    if(!confirmDelete) return
    try {
      if(!user?.uid){
        toast.error("Vous n'avez pas la permission de supprimer ce message")
        return
      }
      const refCommentaireAsupprimer = doc(db ,"commentCode" ,idDoc )
      await deleteDoc(refCommentaireAsupprimer)
      toast.success("message supprimer avec succés")
    } catch  {
      toast.error("quelque chose s'est mal passée")
    }
  }


  return (
    <>
      {isLoading ? (
        <FileurLoader />
      ) : (
        <>
          <h3 className={`${isDarkMode? "text-gray-200" : "text-gray-900"} font-bold mt-3`}>Commentaires</h3>
          {CommentsUsers.map((comment, ind) => (
            <div
              className={`${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-200'
              } relative w-2/4 max-sm:w-3/4 rounded-lg shadow-md p-4 mt-5`}
              key={ind}
            >
              <div className="flex gap-3 sm:gap-5">
                <div
                  className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-xl shadow-inner shrink-0"
                  style={{
                    backgroundColor: stringToColor(`${comment?.userName} `),
                  }}
                >
                  {comment?.userProfil}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    } font-semibold text-sm sm:text-base truncate`}
                  >
                    {`${comment.userName}`}
                  </span>
                  <div className="text-[10px] sm:text-xs text-gray-400 truncate">
                    {formatDate(comment.timestamp)}
                  </div>
                </div>
              </div>
              {comment?.isCode ? (
                <>
                  <div
                    className={`${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    } flex justify-between mt-7`}
                  >
                    <p className="text-sm">{comment?.language}</p>
                    <button
                      type="button"
                      className="cursor-pointer  flex justify-center items-center"
                      onClick={CopierLeCode}
                      title="copier le code"
                    >
                      <FaCopy size={18} />
                      <span>Copier</span>
                    </button>
                  </div>

                  <pre className="bg-transparent p-4 rounded-lg overflow-auto">
                    <code className={`language-${comment?.language}`}>
                      {comment?.code}
                    </code>
                  </pre>
                  <div
                    className={`${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed mt-1 text-wrap break-words whitespace-pre-wrap">
                      mon commentaire :{' '}
                      {comment.commentaireCode || 'pas de commentaire'}
                    </p>
                  </div>
                </>
              ) : (
                <p className={`${isDarkMode? "text-gray-200" : "text-gray-900"}`}>{comment?.commentaire}</p>
              )}
              {comment?.userId.includes(user?.uid) ? (
                <button
                  type="button"
                  className="text-red-400 absolute  bottom-2 right-3 cursor-pointer"
                  onClick={() => deleteComment(comment.id)}
                >
                  <FaTrash size={18} />
                </button>
              ) : null}
            </div>
          ))}
        </>
      )}
    </>
  )
}

export default AfficheCommentairesUsers