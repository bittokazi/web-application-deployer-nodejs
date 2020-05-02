importScripts("https://www.gstatic.com/firebasejs/7.8.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.8.0/firebase-messaging.js");

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

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.title;
  const notificationOptions = {
    body: payload.body,
    icon: payload.icon,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
