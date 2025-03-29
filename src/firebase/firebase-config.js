import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBn1HH9eGeJ2xswelAT5_VCdbHdl6XezPw",
  authDomain: "pregnancy-tracking-6034b.firebaseapp.com",
  projectId: "pregnancy-tracking-6034b",
  storageBucket: "pregnancy-tracking-6034b.appspot.com",
  messagingSenderId: "1075566391540",
  appId: "1:1075566391540:web:3f9b9b9b9b9b9b9b9b9b9b"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    // Kiểm tra notification support
    if (!('Notification' in window)) {
      console.error('Browser không hỗ trợ notifications');
      return null;
    }

    // Log trạng thái notification hiện tại
    console.log('Notification permission:', Notification.permission);

    // Xin quyền notification
    const permission = await Notification.requestPermission();
    console.log('Permission result:', permission);

    if (permission !== 'granted') {
      console.error('Quyền notification bị từ chối');
      return null;
    }

    // Kiểm tra service worker
    if (!('serviceWorker' in navigator)) {
      console.error('Service Worker không được hỗ trợ');
      return null;
    }

    // Đăng ký service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Service Worker đăng ký thành công:', registration);

    // Lấy FCM token
    const token = await getToken(messaging, {
      vapidKey: 'BDXyWImwKOSHR7BqGZHy2soufEAHfJRG8Z38zE7vt8OU1gWnMLeTLU8lOxddOzzSqq8WWb_1amCUr_YXxEBBZng',
      serviceWorkerRegistration: registration
    });

    console.log('FCM Token:', token);
    return token;

  } catch (error) {
    console.error('Lỗi chi tiết:', error);
    return null;
  }
};

// Thêm listener để kiểm tra notification
export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Nhận được notification:', payload);
      // Trigger browser notification if in background
      if (document.hidden) {
        const notification = new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/logo192.png'
        });
      }
      resolve(payload);
    });
  });
};

export default app;