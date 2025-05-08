const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());

// Initialiser Firebase
const serviceAccount = require("./serviceAccountKey.js");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Créer le serveur HTTP
const server = http.createServer(app);

// Créer le WebSocket server attaché à ce serveur HTTP
const wss = new WebSocket.Server({ server });

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

      const tokens = [/* Liste des tokens FCM */];
      await admin.messaging().sendToDevice(tokens, payload);

      clients.forEach((client) => {
        client.send(JSON.stringify({
          type: "notification",
          title: `Nouveau message de ${data.name}`,
          message: data.message,
          img: "",
        }));
      });
    }
  });

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
  });
});

// ✅ Choisir un port : Render utilise `process.env.PORT`
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur WebSocket/HTTP lancé sur le port ${PORT}`);
});
