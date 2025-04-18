import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { db } from '../services/firebaseconfig';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function RichTextEditor() {
  const [content, setContent] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  const handleEditorChange = (content) => {
    setContent(content);
  };

  const handleSendMessage = async () => {
    if (!user) {
      alert('Vous devez être connecté pour envoyer un message');
      return;
    }

    try {
      // Enregistrer le message dans Firestore avec les informations de l'utilisateur
      await addDoc(collection(db, "messages"), {
        userId: user.uid,
        name: user.displayName,  // Nom de l'utilisateur
        email: user.email,        // Email de l'utilisateur
        message: content,         // Message de l'utilisateur
        timestamp: new Date(),    // Date et heure d'envoi
      });
      alert('Message envoyé avec succès!');
      setContent(''); // Réinitialiser l'éditeur
    } catch (error) {
      console.error("Erreur lors de l'envoi du message : ", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Éditeur de texte</h2>
      <Editor
        apiKey="3ndc08vft6rbkrvkb5yzmdcbmd3tp4vkzl289c8yljgbxcgy"
        value={content}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap',
            'preview', 'anchor',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar:
            'cut copy paste | undo redo | styleselect | fontselect fontsizeselect | ' +
            'bold italic underline | alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | link | removeformat | help',
          toolbar_mode: 'floating',
          branding: false,
        }}
        onEditorChange={handleEditorChange}
      />

      <div className="flex justify-center mt-4">
        <button
          onClick={handleSendMessage}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Envoyer le message
        </button>
      </div>
    </div>
  );
}
