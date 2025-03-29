importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBn1HH9eGeJ2xswelAT5_VCdbHdl6XezPw",
  authDomain: "pregnancy-tracking-6034b.firebaseapp.com",
  projectId: "pregnancy-tracking-6034b",
  storageBucket: "pregnancy-tracking-6034b.appspot.com", // Sửa lại đúng domain
  messagingSenderId: "1075566391540",
  appId: "1:1075566391540:web:3f9b9b9b9b9b9b9b9b9b9b"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'notification-' + Date.now(),
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});