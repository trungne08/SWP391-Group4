import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.auth.login(formData);
      console.log("Login response:", response);

      if (response) {
        // Request notification permission after successful login
        try {
          const fcmToken = await api.notifications.requestPermission();
          if (fcmToken) {
            // Send FCM token to backend
            await api.notifications.updateFcmToken(fcmToken);
            console.log('FCM Token registered successfully');
          }
        } catch (fcmError) {
          console.error('Failed to setup notifications:', fcmError);
          // Continue with login even if notification setup fails
        }

        // Lưu thông tin user vào context
        await login(response);
        
        // Kiểm tra role và chuyển hướng
        if (response.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Email hoặc mật khẩu không đúng");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          mb: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography
            component="h1"
            variant="h5"
            sx={{ textAlign: "center", mb: 3 }}
          >
            Chào mừng đến với Pregnancy Tracking!
            <br />
            Đăng nhập để bắt đầu!
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
              label="Địa chỉ Email"
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
              label="Mật Khẩu"
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
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "black",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              Đăng nhập
            </Button>
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="body2" sx={{ mt: 1 }}>
              Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  style={{
                    textDecoration: "underline",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  Đăng ký tại đây
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
