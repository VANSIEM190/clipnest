import { useNavigate } from 'react-router-dom'
import { EditorModal } from '../code'
import { MessageModal } from '../messages'
import { ToastContainer } from 'react-toastify'
import AfficheCommentairesUsers from './AfficheCommentaireUsers.jsx'
import { IoReturnUpBack } from 'react-icons/io5'

const CommentsUsers = ({ codeId }) => {
  const navigate = useNavigate()
  return (
    <>
      <ToastContainer />
      <div className=" w-full flex justify-center items-center flex-col">
        <AfficheCommentairesUsers codeId={codeId} dataBaseName={"commentCode"} />
        <div className="py-2 px-3 flex justify-center items-center gap-2 ">
          <EditorModal codeId={codeId} />
          <MessageModal itemId={codeId}  collectionName={"commentCode"}/>
          <button
            type="button"
            className="rounded-md bg-gray-200 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-300 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <IoReturnUpBack size={18} />
          </button>
        </div>
      </div>
    </>
  )
}

export default CommentsUsers
