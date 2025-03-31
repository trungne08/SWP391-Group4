import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
} from '@mui/material';
import { 
  Phone, 
  Email, 
  LocationOn 
} from '@mui/icons-material';

const ContactUs = () => {
  return (
    <Container maxWidth="lg" sx={{ 
      py: 8,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        align="center" 
        sx={{
          fontSize: '64px',
          fontFamily: 'inherit',
          fontWeight: 700,
          color: '#2c3e50',
          textShadow: '2px 2px 4px rgba(255, 192, 203, 0.6)',
          letterSpacing: '2px',
          mb: 3,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '4px',
            background: 'linear-gradient(45deg, #FF69B4, #FFB6C1)',
            borderRadius: '2px'
          }
        }}
      >
        Liên Hệ Với Chúng Tôi
      </Typography>
    
      <Typography 
        variant="body1" 
        align="center" 
        sx={{ 
          mb: 8,
          fontSize: '1.2rem',
          color: '#666',
          fontWeight: 500
        }}
      >
        Bạn có thắc mắc? Chúng tôi rất vui được lắng nghe bạn.
      </Typography>
    
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Box sx={{ mb: 4 }}>
            <Paper sx={{ 
              p: 5,
              height: '100%',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 40px rgba(0,0,0,0.15)'
              }
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4,
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#2c3e50',
                  textAlign: 'center'
                }}
              >
                Thông Tin Liên Hệ
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                p: 2,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255,105,180,0.1)'
                }
              }}>
                <LocationOn sx={{ 
                  mr: 3, 
                  color: '#FF69B4',
                  fontSize: '2rem'
                }} />
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                  Tầng 3, Tòa nhà ABC, Quận 1, TP. Hồ Chí Minh, Việt Nam
                </Typography>
              </Box>
    
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                p: 2,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255,105,180,0.1)'
                }
              }}>
                <Phone sx={{ 
                  mr: 3, 
                  color: '#FF69B4',
                  fontSize: '2rem'
                }} />
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                  (+84) 987 654 321
                </Typography>
              </Box>
    
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 2,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255,105,180,0.1)'
                }
              }}>
                <Email sx={{ 
                  mr: 3, 
                  color: '#FF69B4',
                  fontSize: '2rem'
                }} />
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                  support@babycare.com
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactUs;