import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add your logout logic here (e.g., clear localStorage, cookies, etc.)
    const handleLogout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Redirect to login page after logout
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    };

    handleLogout();
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography variant="h6">
        Logging out...
      </Typography>
    </Box>
  );
};

export default Logout;