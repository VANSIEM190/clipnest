import React from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "./Context/DarkModeContext";

const Apropos = () => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`bg-white min-h-screen px-6 py-12 md:px-16 ${isDarkMode ? "dark:bg-gray-900" : ""}`}>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          À propos de <span className="text-indigo-600">ClipNest</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          ClipNest est une plateforme éducative collaborative qui aide les apprenants à poser
          des questions, trouver des réponses et partager leurs connaissances avec le monde.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 mt-12">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">🎯 Notre mission</h2>
          <p className="text-gray-600">
            Rendre l'apprentissage accessible à tous en créant une communauté d'entraide éducative. 
            Que tu sois étudiant, enseignant ou autodidacte, ClipNest est fait pour toi.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">📚 Ce que nous offrons</h2>
          <ul className="list-disc ml-6 text-gray-600 space-y-2">
            <li>Des questions-réponses sur des sujets scolaires et académiques</li>
            <li>Des ressources partagées par les membres</li>
            <li>Un espace de discussion et de collaboration</li>
            <li>Des notifications pour suivre ses sujets préférés</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">🌍 Pour qui ?</h2>
          <p className="text-gray-600">
            Élèves, étudiants, professeurs, formateurs, autodidactes — tous ceux qui veulent apprendre et aider les autres à progresser.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">💡 Nos valeurs</h2>
          <ul className="list-disc ml-6 text-gray-600 space-y-2">
            <li>Éducation pour tous</li>
            <li>Partage et entraide</li>
            <li>Respect et inclusion</li>
            <li>Curiosité et excellence</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-16">
        <p className="text-gray-700 text-lg">
          Rejoins ClipNest et participe à la construction d’un monde où l’apprentissage est ouvert, libre et collaboratif 📖✨
        </p>
        <Link to="/salon" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          retour  à mon salon
        </Link>
      </div>
    </div>
  );
};

export default Apropos;
