import { useState } from 'react';
import { db } from '../services/firebaseconfig';
import { addDoc, collection } from 'firebase/firestore';
import useStateScreen from '../hooks/UseSizeScreen';
import { useUser } from '../Context/UserContext';
import MessageList from './Accuiel';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';



export default function RichTextEditor() {
  const [content, setContent] = useState('');
  const [disable, setDisable] = useState(false);
  const isSmallScreen = useStateScreen();
  const { user } = useUser();

  const handleSendMessage = async () => {
  if (!user?.uid) {
    toast.error("Veuillez vous connecter pour envoyer un message");
    return;
  }

  if (content.trim() === '') {
    toast.error("Veuillez entrer un message avant de l'envoyer");
    return;
  }

  try {
    // 1. Ajouter dans Firestore
    await addDoc(collection(db, "messages"), {
      userId: user.uid,
      name: user.fullName,
      nameProfil: user.initials,
      email: user.email,
      message: content,
      timestamp: new Date(),
    });

    setContent('');
    setDisable(true);

    // 2. Demander la permission de notification
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // 3. Envoyer la notif locale
      new Notification(user?.fullName, {
        body: content,
      });

      await axios.post('http://localhost:3000/api/firebase/send-notification', {
        deviceToken: "cv10YCMGCXuMAYLQOz6OBg:APA91bHKmu462FdmXImoFYYWmejRKWEaHgAIkG_-GuO4msDzNm18waq-4F3bbuUXVDz7uKiFi25wwGaLt8owROsHVBC-1SQNCgneA61gEcHELptRCWFNFgw",
        title: user?.fullName,
        body: content,
      });

      toast.success(
        `
        ${user?.fullName} a été notifié avec succès.
        ${content}
        `
      );
      setDisable(false);
    } else {
      toast.error("Permission de notification non accordée.");
    }

  } catch (error) {
    console.error("Erreur :", error);
    toast.error("Erreur lors de l'envoi du message ou de la notification.");
  }
};


  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex justify-center items-center w-full h-screen">
          <div className={`mx-auto my-8 p-4 rounded-lg shadow-md ${isSmallScreen ? "w-3/4" : "w-2/4"}`}>
            <h2 className="text-xl font-bold mb-4 text-center">Éditeur de texte</h2>
            <textarea
              className="resize-none w-full h-36 p-2 border border-gray-400 rounded-2xl"
              placeholder="Écrire un message ici..."
              onChange={(e) => setContent(e.target.value)}
              value={content}
            ></textarea>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSendMessage}
                className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ${
                  disable ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={disable}
              >
                Envoyer le message
              </button>
            </div>
          </div>
        </div>
    </>
  );
}
