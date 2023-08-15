import admin from 'firebase-admin';
import { token } from 'morgan';

const serviceAccount = require('../../vakeelonline-dc519-firebase-adminsdk-e1pky-89f7d01d6c.json');

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
});

const sendFirebaseNotification = async (tokens, title, body) => {
   try {
      const registrationTokens = tokens;

      console.log(tokens);
      if (tokens.length < 1) {
         return;
      }
      const message = {
         data: {
            title,
            body,
            icon: 'https://vakeelonline-assets.s3.ap-southeast-1.amazonaws.com/logo/vo_logo_small.png',
            image: 'https://localhost:3000/posts',
         },
         notification: {
            title,
            body,
            sound: 'default',
         },
      };

      console.log(
         `>>>>>> Attempting to send the notification to ${registrationTokens.length} devices.`
      );
      const { failureCount, successCount } = await admin
         .messaging()
         .sendToDevice(registrationTokens, message, { priority: 'high' });
      console.log(
         `>>>>>>>>>>>>>>>>>>  Successfully sent the notification to ${successCount} devices (${failureCount} failed).`
      );
   } catch (err) {
      console.log(err);
   }
};

export default sendFirebaseNotification;
