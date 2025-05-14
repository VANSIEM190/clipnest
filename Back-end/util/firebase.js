const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config(); // Charger les variables d'environnement

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
}
admin.initializeApp({ 
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin; // Exporter l'instance admin pour l'utiliser dans d'autres fichiers