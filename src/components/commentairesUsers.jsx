import EditorModal from "./EditorModal";
import MessageModal from "./MessageModal";
import { ToastContainer } from "react-toastify";
import AfficheCommentairesUsers from "./AfficheCommentaireUsers";

const CommentsUsers = ({codeId})=> {

return(
  <>
  <ToastContainer/>
  <div className="flex justify-center items-center flex-col">
    <AfficheCommentairesUsers codeId={codeId}/>
    <div  className="py-2 px-3 flex justify-center items-center gap-2 " >
      <EditorModal codeId={codeId}/>
      <MessageModal codeId={codeId}/>
    </div>
  </div>
  </>
)
}


export default CommentsUsers