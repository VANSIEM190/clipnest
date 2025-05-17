// pages/MessageResponses.jsx
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {doc, getDoc} from "firebase/firestore";
import { db } from "../services/firebaseconfig";
import ResponseList from "./ReponsesList";
import { useDarkMode } from "../Context/DarkModeContext";

const MessageResponses = () => {
  const {isDarkMode} = useDarkMode();
  const { messageId } = useParams();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Récupérer le message
      const messageRef = doc(db, "messages", messageId);
      const messageSnap = await getDoc(messageRef);
      if (messageSnap.exists()) {
        setMessage({ id: messageSnap.id, ...messageSnap.data() });
      }

    };

    fetchData();
  }, [messageId]);

  return (
    <>
    <div className={`max-w-3xl min-h-screen mx-auto p-4 ${
      isDarkMode?
      "bg-gray-900 backdrop-blur-sm text-white"
        : "bg-white/80 backdrop-blur-sm text-gray-900"
        }`}>
      {message && (
        <div className={`mb-6 border p-4 rounded-lg shadow
          ${isDarkMode
            ? "bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 text-gray-100"
            : "bg-white/80 text-gray-900"}`}>
          <h2 className="text-lg font-bold">Message original</h2>
          <p className="mt-2 ">{message.message}</p>
          <div className="mt-2 text-sm ">
            Posté par {message.name} ({message.email})
          </div>
        </div>
      )}

      <ResponseList messageId ={messageId}/>
      <Link to="/salon">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
          Retour
        </button>
      </Link>
    </div>
    </>
  );
};

export default MessageResponses;
