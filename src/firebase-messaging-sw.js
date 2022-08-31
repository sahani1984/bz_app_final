// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.

// importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-messaging.js');

// importScripts("https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js");


// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
// firebase.initializeApp({
//   apiKey: "AIzaSyDmhdnkR8bVZfzaJ2vlCNO8GyDdwbV_3eM",
//   authDomain: "web-push-notification-d9f49.firebaseapp.com",
//   databaseURL:
//     "https://web-push-notification-d9f49-default-rtdb.firebaseio.com",
//   projectId: "web-push-notification-d9f49",
//   storageBucket: "web-push-notification-d9f49.appspot.com",
//   messagingSenderId: "570147974473",
//   appId: "1:570147974473:web:6fc60dc34915dec5893e98",
//   measurementId: "G-2LVFSF2LPE",
// });


// Retrieve an instance of Firebase Messaging so that it can handle background
// const  messaging =  firebase.messaging();



// messaging.onBackgroundMessage(function(payload) {
//   console.log('Received background message ', payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });
