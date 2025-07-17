// Script pour mettre à jour les imports vers la nouvelle structure
// À exécuter après la réorganisation

const fs = require('fs');
const path = require('path');

// Mapping des anciens imports vers les nouveaux
const importMappings = {
  // Composants communs
  '../components/Loader': '../components/common/Loader',
  '../components/ButtonPagination': '../components/common/ButtonPagination',
  '../components/Options': '../components/common/Options',
  
  // Composants de layout
  '../components/Navbar': '../components/layout/Navbar',
  '../components/Sidebar': '../components/layout/Sidebar',
  
  // Composants de formulaires
  '../components/ConnectionForm': '../components/forms/ConnectionForm',
  '../components/Formulaire': '../components/forms/Formulaire',
  
  // Composants de code
  '../components/CodeEditor': '../components/code/CodeEditor',
  '../components/EditorModal': '../components/code/EditorModal',
  '../components/AfficheCode': '../components/code/AfficheCode',
  '../components/SnippetsCode': '../components/code/SnippetsCode',
  
  // Composants utilisateurs
  '../components/AllUsers': '../components/users/AllUsers',
  '../components/UserProfil': '../components/users/UserProfil',
  '../components/SelectedUser': '../components/users/SelectedUser',
  '../components/UserStatut': '../components/users/UserStatut',
  '../components/AutreUsersStatus': '../components/users/AutreUsersStatus',
  
  // Composants de messages
  '../components/UsersMessages': '../components/messages/UsersMessages',
  '../components/MessageModal': '../components/messages/MessageModal',
  '../components/ReplyMessage': '../components/messages/ReplyMessage',
  
  // Composants de commentaires
  '../components/AfficheCommentaireUsers': '../components/comments/AfficheCommentaireUsers',
  '../components/SectionDeCommentaire': '../components/comments/SectionDeCommentaire',
  '../components/commentairesUsers': '../components/comments/commentairesUsers',
  '../components/QuestionsUsers': '../components/comments/QuestionsUsers',
  '../components/ReponsesList': '../components/comments/ReponsesList',
  
  // Contextes (mise à jour de la casse)
  '../Context/': '../context/',
  './Context/': './context/',
  
  // Styles (mise à jour du nom)
  '../style/': '../styles/',
  './style/': './styles/'
};

// Fonction pour mettre à jour un fichier
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    for (const [oldImport, newImport] of Object.entries(importMappings)) {
      if (content.includes(oldImport)) {
        content = content.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newImport);
        updated = true;
        console.log(`Updated ${oldImport} -> ${newImport} in ${filePath}`);
      }
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Fonction pour parcourir récursivement les dossiers
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      updateFile(filePath);
    }
  });
}

// Exécuter le script
console.log('Starting import updates...');
walkDir(__dirname);
console.log('Import updates completed!'); 