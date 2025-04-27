import { useState , useEffect } from 'react';
import { db } from '../services/firebaseconfig';
import { addDoc, collection } from 'firebase/firestore';
import Loader from './Loader';
import useStateScreen from '../hooks/UseSizeScreen';
import { useUser } from '../Context/UserContext';

export default function RichTextEditor() {
  const [content, setContent] = useState('');
  const [loading , setLoading] = useState(true);
  const isSmallScreen = useStateScreen();
  const { user } = useUser();

  useEffect(() => {
    const miliSecond = 3000;
    const timer = setTimeout(() => {
      setLoading(false);
    }, miliSecond);

    return () => clearTimeout(timer);
  }, []);


  const handleSendMessage = async () => {
    if (!user.uid) {
      alert('Vous devez être connecté pour envoyer un message');
      return;
    }

    try {
      // Enregistrer le message dans Firestore avec les informations de l'utilisateur
      await addDoc(collection(db, "messages"), {
        userId: user.uid,
        name : user.fullName,
        nameProfil : user.initials,
        email: user.email,        
        message: content,         
        timestamp: new Date(),   
      });
      alert('Message envoyé avec succès!');
      setContent('');
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message : ", error);
    }
  };
  if (loading) {
    return <Loader />;
  }


  return (
    loading? 
    <Loader/>
    :
    <div className='flex justify-center items-center w-full h-screen'>
<div className={`mx-auto my-8 p-4  rounded-lg shadow-md  ${isSmallScreen? "w-3/4" : "w-2/4"}`}>
      <h2 className="text-xl font-bold mb-4 text-center">Éditeur de texte</h2>
      <textarea name="text" id="text"
      className="resize-none w-full h-36 m-auto p-2  border border-gray-400 rounded-2xl " 
      placeholder='écrire un message ici ....'
      onChange={(e)=> setContent(e.target.value)}
      value={content}
      ></textarea>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSendMessage}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Envoyer le message
        </button>
      </div>
    </div>
    </div>
  );
}
