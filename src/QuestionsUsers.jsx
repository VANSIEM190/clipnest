import React, { useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HeadingNode } from "@lexical/rich-text";
import {$getRoot,} from "lexical";
import { db } from "./services/firebaseconfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Toolbar from "./components/Toolbar";
import { useDarkMode } from "./Context/DarkModeContext";

// 🛠️ Barre d'outils


const QuestionForm = () => {
  const [content, setContent] = useState("");
  const {isDarkMode} = useDarkMode();

  const initialConfig = {
    namespace: "QuestionEditor",
    onError(error) {
      throw error;
    },
    theme: {
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "line-through",
      },
    },
    nodes: [HeadingNode],
  };

  const handleSubmit = async () => {
    if (!content.trim()) return alert("Veuillez écrire une question !");
    try {
      await addDoc(collection(db, "questions"), {
        content,
        createdAt: serverTimestamp(),
      });
      setContent("");
      alert("Question envoyée !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <div className="flex justify-center items-center  h-screen w-full  ">
      <div className={`max-w-full  mt-6 p-4 border rounded shadow ${isDarkMode? " text-white bg-gray-900" : "bg-white"} `}>
      <h2 className="text-xl font-semibold mb-4">Pose ta question</h2>
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className={`z-0 editor-input p-4 border rounded-lg min-h-[300px] max-h-[300px] overflow-auto focus:outline-none text-sm sm:text-base ${isDarkMode? "" : "bg-gray-100 text-gray-900"}`} />
          }
            placeholder={
              <div className="absolute top-0 left-0 p-4 text-gray-400 dark:text-gray-500 pointer-events-none">
                Écris ta question ici...
              </div>
            }
          />
          <HistoryPlugin />
          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const root = $getRoot();
                setContent(root.getTextContent());
              });
            }}
          />
        </div>
      </LexicalComposer>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Envoyer
      </button>
    </div>
    </div>
  );
};

export default QuestionForm;
