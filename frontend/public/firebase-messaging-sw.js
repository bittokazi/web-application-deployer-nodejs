importScripts("https://www.gstatic.com/firebasejs/7.8.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.8.0/firebase-messaging.js");

firebase.initializeApp(
  JSON.parse(
    atob(
      "eyJhcGlLZXkiOiJBSXphU3lDOUxOVjgyTkViY0pQLXVfOFRBZXpIYVdkM013ek84ZG8iLCJhdXRoRG9tYWluIjoid2ViLWFwcC1kZXBsb3llci1ub2RlanMuZmlyZWJhc2VhcHAuY29tIiwiZGF0YWJhc2VVUkwiOiJodHRwczovL3dlYi1hcHAtZGVwbG95ZXItbm9kZWpzLmZpcmViYXNlaW8uY29tIiwicHJvamVjdElkIjoid2ViLWFwcC1kZXBsb3llci1ub2RlanMiLCJzdG9yYWdlQnVja2V0Ijoid2ViLWFwcC1kZXBsb3llci1ub2RlanMuYXBwc3BvdC5jb20iLCJtZXNzYWdpbmdTZW5kZXJJZCI6IjU0NDQxNTUzODc3NyIsImFwcElkIjoiMTo1NDQ0MTU1Mzg3Nzc6d2ViOmIxNmZiODUxYjExNzViMmVlZGRiNDgiLCJtZWFzdXJlbWVudElkIjoiRy01MVJaSEZSOTBKIn0="
    )
  )
);

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
