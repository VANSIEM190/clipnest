import * as PusherPushNotifications from "@pusher/push-notifications-web";
const useNotification =() =>{
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: "8c5e7d1b-06ad-42af-9162-40bed556a7c0",
  })
  beamsClient.start()
  .then(() => beamsClient.addDeviceInterest())
  .then(() => {
    console.log('✅ Inscription à Pusher Beams réussie')
  });
}
export default  useNotification;
