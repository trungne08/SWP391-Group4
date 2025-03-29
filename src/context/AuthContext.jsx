import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestNotificationPermission } from '../firebase/firebase-config';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = tokenData.exp * 1000;
          
          if (Date.now() < expirationTime) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Auth state restoration error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      
      // Lưu thông tin user vào localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Request notification permission
      try {
        const fcmToken = await requestNotificationPermission();
        if (fcmToken) {
          // Send FCM token to backend using the correct endpoint
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/fcm-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ token: fcmToken })
          });

          if (!response.ok) {
            throw new Error('Failed to update FCM token');
          }
          console.log('FCM Token updated successfully');
        }
      } catch (error) {
        console.error('Notification setup failed:', error);
      }
      
      console.log("User logged in:", userData);
    } catch (error) {
      console.error("Login error in context:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('welcomePopupShown'); // Add this line
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  if (loading) {
    return null; // hoặc loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);