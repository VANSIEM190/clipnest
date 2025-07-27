import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { languages , themes } from "../../utils/languagesAndThemesEditor";
import { addDoc , collection  , serverTimestamp} from "firebase/firestore";
import { db } from "../../services/firebaseconfig";
import { FaCode , FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDarkMode, useUser } from '../../context'


const EditorModal = ({codeId})=>{
  const [open , setOpen] = useState(false);
  const [detailsIsOpen , setDetailsIsOpen] = useState(false)
  const [commentaire , setCommentaire] = useState()
  const [language , setLanguage] = useState("javascript");
  const [theme , setTheme] = useState("vs-dark");
  const [code , setCode] = useState("//votre code ici");
  const {user} = useUser()
  const {isDarkMode} = useDarkMode();

    const fetchCommentCode = async ()=>{
      try {
        if(!code.trim()) return
        const codeCommentRef = collection(db, "commentCode")
        await addDoc(codeCommentRef, {
          codeId,
          isCode:true,
          code : code,
          language: language,
          commentaireCode : commentaire,
          userName: user?.fullName || "anonyme",
          userProfil : user?.initials || "X",
          userId : user?.uid,
          timestamp : serverTimestamp()
        })
        toast.success("code envoyé")
      } catch{
        toast.error("error lors de l'envoie ")
      }
    }

  return (
    <>
      <div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-gray-200 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-300 cursor-pointer"
        >
          <FaCode size={18} />
        </button>
        <dialog open={open} onClose={setOpen} className="relative z-10">
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in" />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                <div className="bg- px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-center sm:justify-center flex-col">
                    <div className="flex flex-col sm:flex-row gap-3 mb-2">
                      <select
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className="bg-gray-300 text-gray-900  p-2 rounded"
                      >
                        {languages.map(lang => (
                          <option value={lang.id} key={lang.id}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={theme}
                        onChange={e => setTheme(e.target.value)}
                        className="bg-gray-300 text-gray-900 p-2 rounded"
                      >
                        {themes.map(th => (
                          <option value={th.id} key={th.id}>
                            {th.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Editor
                      height={400}
                      width="100%" // hauteur dynamique
                      language={language} // tu peux changer (voir liste plus bas)
                      theme={theme} // ou "light", "hc-black", etc.
                      value={code}
                      onChange={value => setCode(value)}
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false }, // petite carte de code à droite
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                    {/* partie commentaire pour le code */}
                    <details
                      open={detailsIsOpen}
                      onClick={() => setDetailsIsOpen(!detailsIsOpen)}
                      className={`w-full max-w-md  mt-2  rounded-2xl shadow-lg p-4 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      <summary
                        className={` cursor-pointer text-lg font-semibold  flex items-center justify-between list-none${
                          isDarkMode ? 'text-white' : 'text-black'
                        }`}
                      >
                        <span>Écrire un commentaire</span>
                        <FaChevronDown
                          className={`w-5 h-5 ml-2 transform transition-transform duration-300 ${
                            detailsIsOpen ? 'rotate-180' : ''
                          } ${isDarkMode ? 'text-white' : 'text-base'}`}
                        />
                      </summary>
                      <div className="mt-4">
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-200"
                          rows="5"
                          placeholder="Votre message..."
                          onChange={e => setCommentaire(e.target.value)}
                          value={commentaire}
                        ></textarea>
                      </div>
                    </details>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={() => {
                      fetchCommentCode()
                      setOpen(false)
                    }}
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto cursor-pointer"
                  >
                    Envoyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}

export default EditorModal