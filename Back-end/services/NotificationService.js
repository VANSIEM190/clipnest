const admin = require("../util/firebase");


class NotificationService {
  static async  sendNotification(deviceToken, title, body) {
    const message = {
      notification: {
        title,
        body,
      },
      token : deviceToken,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log("Notification envoyée avec succès :", response);
      return response;
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification :", error);
    }
  }
}

module.exports =  NotificationService;