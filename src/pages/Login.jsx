import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Paper } from '@mui/material';

const Login = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
            Welcome to Baby Care!<br />
            Login to continue
          </Typography>
          <form>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                bgcolor: 'black',
                '&:hover': {
                  bgcolor: '#333'
                }
              }}
            >
              Sign In
            </Button>
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link to="/forgot-password" style={{ textDecoration: 'underline', color: 'black' }}>
                Forgot password?
              </Link>
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