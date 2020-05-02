import firebase from "firebase";
import { ApiCall } from "./NetworkLayer";

export const initializerFirebase = () => {
  firebase.initializeApp(
    JSON.parse(
      atob(
        "eyJhcGlLZXkiOiJBSXphU3lDOUxOVjgyTkViY0pQLXVfOFRBZXpIYVdkM013ek84ZG8iLCJhdXRoRG9tYWluIjoid2ViLWFwcC1kZXBsb3llci1ub2RlanMuZmlyZWJhc2VhcHAuY29tIiwiZGF0YWJhc2VVUkwiOiJodHRwczovL3dlYi1hcHAtZGVwbG95ZXItbm9kZWpzLmZpcmViYXNlaW8uY29tIiwicHJvamVjdElkIjoid2ViLWFwcC1kZXBsb3llci1ub2RlanMiLCJzdG9yYWdlQnVja2V0Ijoid2ViLWFwcC1kZXBsb3llci1ub2RlanMuYXBwc3BvdC5jb20iLCJtZXNzYWdpbmdTZW5kZXJJZCI6IjU0NDQxNTUzODc3NyIsImFwcElkIjoiMTo1NDQ0MTU1Mzg3Nzc6d2ViOmIxNmZiODUxYjExNzViMmVlZGRiNDgiLCJtZWFzdXJlbWVudElkIjoiRy01MVJaSEZSOTBKIn0="
      )
    )
  );
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
