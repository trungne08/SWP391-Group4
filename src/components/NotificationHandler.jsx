import React, { useEffect } from 'react';
import { notification } from 'antd';
import { onMessageListener } from '../firebase/firebase-config';

const NotificationHandler = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        onMessageListener()
          .then(payload => {
            console.log('Received notification:', payload);
            notification.open({
              message: payload.notification.title,
              description: payload.notification.body,
              duration: 4.5,
              placement: 'topRight'
            });
          })
          .catch(err => console.error('Failed to setup notification listener:', err));
      } catch (err) {
        console.error('Notification handler error:', err);
      }
    };

    setupNotifications();
  }, []);

  return null;
};

export default NotificationHandler;