# Structure du Dossier Src

Ce dossier contient tous les fichiers nécessaires pour le développement de l'application, organisés de manière logique et maintenable.

## 📁 Organisation des Dossiers

### `/components/` - Composants React
Organisés par fonctionnalité pour une meilleure maintenabilité :

- **`/common/`** - Composants réutilisables
  - `Loader.jsx` - Indicateur de chargement
  - `ButtonPagination.jsx` - Boutons de pagination
  - `Options.jsx` - Composant d'options

- **`/layout/`** - Composants de mise en page
  - `Navbar.jsx` - Barre de navigation
  - `Sidebar.jsx` - Barre latérale

- **`/forms/`** - Composants de formulaires
  - `ConnectionForm.jsx` - Formulaire de connexion
  - `Formulaire.jsx` - Formulaires génériques

- **`/code/`** - Composants liés au code
  - `CodeEditor.jsx` - Éditeur de code
  - `EditorModal.jsx` - Modal d'édition
  - `AfficheCode.jsx` - Affichage de code
  - `SnippetsCode.jsx` - Snippets de code

- **`/users/`** - Composants liés aux utilisateurs
  - `AllUsers.jsx` - Liste de tous les utilisateurs
  - `UserProfil.jsx` - Profil utilisateur
  - `SelectedUser.jsx` - Utilisateur sélectionné
  - `UserStatut.jsx` - Statut utilisateur
  - `AutreUsersStatus.jsx` - Statut des autres utilisateurs
  - `profilsUsers.jsx` - Profils des utilisateurs

- **`/messages/`** - Composants de messagerie
  - `UsersMessages.jsx` - Messages des utilisateurs
  - `MessageModal.jsx` - Modal de message
  - `ReplyMessage.jsx` - Réponse aux messages
   - `QuestionsUsers.jsx` - Questions des utilisateurs
  - `ReponsesList.jsx` - Liste des réponses des utilisateurs
  - `AfficheMessagesUser.jsx` - Affichage des messages

- **`/comments/`** - Composants de commentaires
  - `AfficheCommentaireUsers.jsx` - Affichage des commentaires
  - `SectionDeCommentaire.jsx` - Section de commentaires
  - `commentairesUsers.jsx` - Commentaires des utilisateurs

### `/pages/` - Pages de l'application
- `LadingPage.jsx` - Page d'accueil
- `Apropos.jsx` - Page À propos
- `OfflineStatus.jsx` - Statut hors ligne
- `ErrorPage.jsx` - Page d'erreur

### `/context/` - Contextes React
- `UserContext.jsx` - Contexte utilisateur
- `networkStatusContext.jsx` - Contexte de statut réseau
- `DarkModeContext.jsx` - Contexte mode sombre

### `/hooks/` - Hooks personnalisés
- `useOnelineStatus.js` - Hook pour le statut en ligne
- `useUserStatus.js` - Hook pour le statut utilisateur
- `UseSizeScreen.js` - Hook pour la taille d'écran
- `usePagination.js` - Hook pour la pagination

### `/services/` - Services et API
- `firebaseconfig.js` - Configuration Firebase

### `/utils/` - Utilitaires
- `firebase-utils.js` - Utilitaires Firebase
- `formatDate.js` - Formatage de dates
- `formatLastSeen.js` - Formatage dernière connexion
- `languagesAndThemesEditor.js` - Langages et thèmes d'éditeur
- `prismLanguages.js` - Langages Prism
- `StringToColor.js` - Conversion string vers couleur

### `/styles/` - Styles
- `index.css` - Styles principaux

### `/assets/` - Ressources statiques
- Images et autres ressources

### `/router/` - Configuration du routeur
- `RouterApp.jsx` - Configuration des routes

## 🔄 Imports

Chaque sous-dossier de composants contient un fichier `index.js` qui exporte tous les composants du dossier. Cela permet des imports plus propres :

```javascript
// Avant
import { Loader } from '../components/Loader.jsx';
import { Navbar } from '../components/Navbar.jsx';

// Après
import { Loader } from '../components/common';
import { Navbar } from '../components/layout';
```

## 📝 Conventions

1. **Nommage** : Utiliser PascalCase pour les composants React
2. **Organisation** : Grouper les composants par fonctionnalité
3. **Exports** : Utiliser des fichiers index.js pour les exports groupés
4. **Imports** : Préférer les imports relatifs courts grâce aux index.js

## 🚀 Avantages de cette Structure

- **Maintenabilité** : Facile de trouver et modifier les composants
- **Réutilisabilité** : Composants bien organisés et réutilisables
- **Scalabilité** : Structure qui s'adapte à la croissance du projet
- **Lisibilité** : Code plus lisible et compréhensible
- **Performance** : Imports optimisés avec les fichiers index 