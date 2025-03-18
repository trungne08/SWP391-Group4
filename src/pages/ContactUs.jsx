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
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 6 }}>
        Have questions? We'd love to hear from you.
      </Typography>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Box sx={{ mb: 4 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Contact Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 2, color: 'black' }} />
                <Typography variant="body1">
                  3rd Floor, ABC Building, District 1, Ho Chi Minh City, Vietnam
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ mr: 2, color: 'black' }} />
                <Typography variant="body1">
                  (+84) 987 654 321
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 2, color: 'black' }} />
                <Typography variant="body1">
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