import { useState } from "react";
import { addDoc , collection ,  serverTimestamp  } from "firebase/firestore";
import { db } from "../services/firebaseconfig";
import { FaRegComment } from "react-icons/fa";
import { toast } from "react-toastify";
import { useUser } from "../Context/UserContext";

const MessageModal = ({codeId}) =>{
  const [open , setOpen] = useState(false);
  const [commentaire , setCommentaire] = useState();
  const {user} = useUser()

  const fetchCommentCode = async ()=>{
    try {
      if(!commentaire.trim()) return
      const commentairesUsersRef = collection(db, "commentCode")
      await addDoc(commentairesUsersRef, {
        codeId,
        iscode:false,
        commentaire : commentaire,
        userName: user?.fullName || "anonyme",
        userProfil : user?.initials || "X",
        userId : user?.uid,
        timestamp : serverTimestamp()
      })
      toast.success("commentaire envoyer")
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
          <FaRegComment size={18}/>
        </button>
        <dialog open={open} onClose={setOpen} className="relative z-10">
          <div
            
            className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
          />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg- px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-center sm:justify-center flex-col">
                <div className="col-span-full">
              <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">
                votre commentaire
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={'inserer votre commentaire'}
                  value={commentaire}
                  onChange={(e)=> setCommentaire(e.target.value)}
                />
              </div>
              <p className="mt-3 text-sm/6 text-gray-600">écrire un commentaire à propos du code</p>
            </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() =>{
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

export default MessageModal