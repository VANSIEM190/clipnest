import { useState } from 'react';
import { db } from '../services/firebaseconfig';
import { addDoc, collection } from 'firebase/firestore';
import useStateScreen from '../hooks/UseSizeScreen';
import { useUser } from '../Context/UserContext';
import MessageList from './Accuiel';


export default function RichTextEditor() {
  const [content, setContent] = useState('');
  const [disable, setDisable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [notif, setNotif] = useState(null);
  const isSmallScreen = useStateScreen();
  const { user } = useUser();



  // Fonction d'envoi du message
  const handleSendMessage = async () => {
    if (!user?.uid) {
      alert('Vous devez être connecté pour envoyer un message');
      return;
    }

    if (content.trim() === '') {
      alert('Le message ne peut pas être vide');
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        userId: user.uid,
        name: user.fullName,
        nameProfil: user.initials,
        email: user.email,
        message: content,
        timestamp: new Date(),
      });

      alert('Message envoyé avec succès!');
      setContent('');
      setDisable(true);
      setIsVisible(true);

      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const socket = new WebSocket(`${protocol}://clipnest-ugfj.onrender.com`);


    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification') {
        setNotif(`${data.title}: ${data.message}`);
        console.log('Notification reçue:', data.title, data.message, data.img);
        if (Notification.permission === 'granted') {
          new Notification(user?.fullName, { body: content, img : data.img });
        }
      }
    };

    socket.onopen = () => {
      console.log('Connecté au WebSocket');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Demande la permission pour afficher les notifications
    Notification.requestPermission();

    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  return (
    <>
      {isVisible ? (
        <MessageList />
      ) : (
        <div className="flex justify-center items-center w-full h-screen">
          <div className={`mx-auto my-8 p-4 rounded-lg shadow-md ${isSmallScreen ? "w-3/4" : "w-2/4"}`}>
            <h2 className="text-xl font-bold mb-4 text-center">Éditeur de texte</h2>
            <textarea
              name="text"
              id="text"
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
      )}
    </>
  );
}
