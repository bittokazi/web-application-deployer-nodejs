import firebase from "firebase";
import { ApiCall } from "./NetworkLayer";

export const initializerFirebase = () => {
  firebase.initializeApp({
    apiKey: "AIzaSyC9LNV82NEbcJP-u_8TAezHaWd3MwzO8do",
    authDomain: "web-app-deployer-nodejs.firebaseapp.com",
    databaseURL: "https://web-app-deployer-nodejs.firebaseio.com",
    projectId: "web-app-deployer-nodejs",
    storageBucket: "web-app-deployer-nodejs.appspot.com",
    messagingSenderId: "544415538777",
    appId: "1:544415538777:web:b16fb851b1175b2eeddb48",
    measurementId: "G-51RZHFR90J",
  });
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        firebase.messaging().useServiceWorker(registration);
      })
      .catch(function (err) {
        console.log("Service worker registration failed, error:", err);
      });
  }
};

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();

    ApiCall().authorized(
      {
        method: "POST",
        url: "/fcm/subscribe",
        data: { token },
      },
      (response) => {
        console.log("Subscribed to  all");
        messaging.onMessage(function (payload) {
          console.log("Message received. ", payload);
          var notification = new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.icon,
          });
        });
      },
      (error) => {
        console.log(error.response);
      }
    );
    return token;
  } catch (error) {
    console.log(error);
  }
};

export const removeFirebaseNotification = async () => {
  return new Promise(async (resolve) => {
    try {
      const messaging = firebase.messaging();
      if (Notification.permission !== "granted") {
        return resolve({});
      }
      const token = await messaging.getToken();
      console.log(Notification.permission);
      ApiCall().authorized(
        {
          method: "POST",
          url: "/fcm/unsubscribe",
          data: { token },
        },
        (response) => {
          console.log("unsubscribed to  all");
          return resolve({});
        },
        (error) => {
          console.log(error.response);
          return resolve({});
        }
      );

      return token;
    } catch (error) {
      console.log(error);
      return resolve({});
    }
  });
};
