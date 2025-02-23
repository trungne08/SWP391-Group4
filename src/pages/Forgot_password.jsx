import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Paper } from '@mui/material';

const ForgotPassword = () => {
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
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
            Forgot Password
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }}>
            Enter your email address and we'll send you a link to reset your password.
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Back to Sign in
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;