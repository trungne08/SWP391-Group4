import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Avatar,
  Button,
  Typography,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Edit as EditIcon,
  Lock as LockIcon,
  PhotoCamera as CameraIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
}));

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    avatar: ''
  });
  const [alertState, setAlertState] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showAlert = (message, severity = 'success') => {
    setAlertState({
      open: true,
      message,
      severity
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        if (!token || !storedUser) {
          navigate('/login');
          return;
        }
        
        setLoading(true);
        const profileData = await api.user.getProfile();
        
        if (profileData) {
          setUserData(profileData);
          setFormData({
            fullName: profileData.fullName || '',
            phoneNumber: profileData.phoneNumber || '',
            avatar: profileData.avatar || ''
          });
        } else {
          setUserData(storedUser);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        showAlert('Failed to load profile data', 'error');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = () => {
    if (!userData) return;
    setIsModalVisible(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const updateData = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        avatar: formData.avatar.trim()
      };
      
      const response = await api.user.updateProfile(updateData);
      
      if (response) {
        setUserData(response);
        showAlert('Profile updated successfully');
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      showAlert('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress sx={{ color: '#FF69B4' }} />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" textAlign="center" mt={5}>
          No user data available
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <StyledPaper>
        <Box textAlign="center" mb={4}>
          <Avatar
            src={userData.avatar}
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto',
              cursor: 'pointer',
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onClick={() => setIsAvatarModalVisible(true)}
          >
            {!userData.avatar && <PersonIcon fontSize="large" />}
          </Avatar>

          <Typography variant="h4" sx={{ mt: 2, color: '#2c3e50' }}>
            {userData.fullName || userData.username}
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {userData.email}
          </Typography>

          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ bgcolor: '#FF69B4', '&:hover': { bgcolor: '#FF1493' } }}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => navigate('/change-password')}
              sx={{ 
                color: '#FF69B4', 
                borderColor: '#FF69B4',
                '&:hover': { 
                  borderColor: '#FF1493',
                  color: '#FF1493'
                }
              }}
            >
              Change Password
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Username
            </Typography>
            <Typography variant="body1">{userData.username}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Full Name
            </Typography>
            <Typography variant="body1">
              {userData.fullName || 'Not set'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{userData.email}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Phone Number
            </Typography>
            <Typography variant="body1">
              {userData.phoneNumber || 'Not set'}
            </Typography>
          </Grid>
        </Grid>

        <Dialog
          open={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleUpdate} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Avatar URL"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                margin="normal"
              />
              <DialogActions>
                <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                <Button 
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: '#FF69B4', '&:hover': { bgcolor: '#FF1493' } }}
                >
                  Update
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isAvatarModalVisible}
          onClose={() => setIsAvatarModalVisible(false)}
          maxWidth="md"
        >
          <DialogContent>
            <img
              src={userData.avatar}
              alt="Profile"
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400?text=No+Image';
              }}
            />
          </DialogContent>
        </Dialog>

        <Snackbar
          open={alertState.open}
          autoHideDuration={6000}
          onClose={() => setAlertState({ ...alertState, open: false })}
        >
          <Alert
            onClose={() => setAlertState({ ...alertState, open: false })}
            severity={alertState.severity}
            sx={{ width: '100%' }}
          >
            {alertState.message}
          </Alert>
        </Snackbar>
      </StyledPaper>
    </Container>
  );
}

export default Profile;
