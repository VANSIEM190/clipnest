// server.js (backend Render)
const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
const wss = new WebSocket.Server({ noServer: true });

const serviceAccount = require("./serviceAccountKey.js");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  ws.on("message", async (message) => {
    const data = JSON.parse(message);
    if (data.type === "new_message") {
      const payload = {
        notification: {
          title: `Nouveau message de ${data.name}`,
          body: data.message,
        },
      };

      // Envoie à tous les tokens FCM stockés en base (Firestore ou fichier)
      const tokens = [/* Liste des tokens FCM */];
      await admin.messaging().sendToDevice(tokens, payload);

      // Répartir la notif aussi via WebSocket
      clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: "notification",
            title: `Nouveau message de ${data.name}`,
            message: data.message,
            img: "", // éventuellement un avatar
          })
        );
      });
    }
  });

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
  });
});
