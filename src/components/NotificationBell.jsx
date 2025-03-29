import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { onMessageListener } from '../firebase/firebase-config';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const setupNotifications = () => {
      onMessageListener()
        .then(payload => {
          console.log('NotificationBell received:', payload);
          if (payload?.notification) {
            const newNotification = {
              id: Date.now(),
              title: payload.notification.title,
              body: payload.notification.body,
              timestamp: new Date(),
              read: false,
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        })
        .catch(err => console.error('NotificationBell error:', err));
    };

    // Call setupNotifications immediately
    setupNotifications();

    // Set up an interval to keep checking for new notifications
    const interval = setInterval(setupNotifications, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // Mark all as read when menu is closed
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ marginLeft: 2 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 300,
            width: '300px',
          },
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography>No notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem key={notification.id} sx={{ 
              whiteSpace: 'normal',
              backgroundColor: notification.read ? 'inherit' : '#f0f4f8'
            }}>
              <div>
                <Typography variant="subtitle2" fontWeight="bold">
                  {notification.title}
                </Typography>
                <Typography variant="body2">{notification.body}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(notification.timestamp).toLocaleString()}
                </Typography>
              </div>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;