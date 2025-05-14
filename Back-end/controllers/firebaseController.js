const NotificationService = require("../services/NotificationService");

const sendFirebaseNotification = async (req, res) => {
  try {
    const { title, body, deviceToken } = req.body;
    console.log("🔵 Données reçues dans le controller :", req.body);

    if (!deviceToken || !title || !body) {
      return res.status(400).json({ error: "deviceToken, title ou body manquant." });
    }

    const result = await NotificationService.sendNotification(deviceToken, title, body);

    if (result) {
      return res.status(200).json({ message: "Notification envoyée avec succès", result });
    } else {
      return res.status(500).json({ error: "Échec de l'envoi de la notification." });
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification :", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

module.exports = sendFirebaseNotification;
