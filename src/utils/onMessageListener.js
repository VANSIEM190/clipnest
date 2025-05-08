// notifications/onMessageListener.js
import { onMessage } from "../services/firebaseconfig";

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage((payload) => {
      console.log("Notification reçue en avant-plan : ", payload);
      resolve(payload);
    });
  });
