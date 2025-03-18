import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value.trim()
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Attempting login...');
      const response = await api.auth.login(formData);
      
      if (response) {
        localStorage.setItem('token', response.token);
        const userData = {
          user_id: response.user_id,
          username: response.username,
          email: response.email,
          fullName: response.fullName, // Thêm fullName, nếu không có thì dùng username
          role: response.role
        };
        // Log để debug
        console.log('User Data:', userData);
        
        localStorage.setItem('user', JSON.stringify(userData));
        login(userData);
        
        if (response.role === 'MEMBER') {
          navigate('/', { replace: true });
        } else if (response.role === 'ADMIN') {
          navigate('/admin', { replace: true });
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
            Welcome BabyCareCenter!<br />
            Login to continue
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              type="email"
              error={!!error}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!error}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
            >
              Sign In
            </Button>
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'underline', color: 'black', fontWeight: 'bold' }}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;