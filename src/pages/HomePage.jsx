import React from "react";
import { Row, Col, Card, Button } from "antd";
import { Link } from "react-router-dom";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";

// Remove this line since we're using MUI Typography
// const { Title, Text } = Typography;

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        backgroundImage: 'url("/images/doctor-patient.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',    
        height: '500px',                  
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 4,
        position: 'relative'              
      }}>
        <Container sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ 
            color: '#000', 
            fontWeight: 'bold', 
            mb: 2,
            position: 'relative',
            zIndex: 1,
            textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff'
          }}>
            BabyCare Center
          </Typography>
          <Typography variant="h5" sx={{ 
            color: '#666',
            position: 'relative',
            zIndex: 1,
            textShadow: '0.5px 0.5px 0 #fff, -0.5px -0.5px 0 #fff, 0.5px -0.5px 0 #fff, -0.5px 0.5px 0 #fff'
          }}>
            Professional Growth | Tracking System
          </Typography>
        </Container>
      </Box>

      {/* Featured Images */}
      <Container sx={{ mb: 6 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <img 
              src="/images/pregnant-teddy.jpg"
              alt="Pregnancy Care"
              style={{ 
                width: '100%', 
                height: '300px', 
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <img 
              src="/images/baby-smile.jpg"
              alt="Baby Care"
              style={{ 
                width: '100%', 
                height: '300px', 
                objectFit: 'cover',
                objectPosition: 'top center',
                borderRadius: '8px'
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Heading Section */}
      <Container sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>My pregnancy week by week</Typography>
      </Container>

      {/* Title Cards */}
      <Container sx={{ mb: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
              <Typography variant="h6">First Trimester (Weeks 1-12)</Typography>
              <Typography variant="body2" sx={{ color: '#666', my: 2 }}>
                The first trimester is crucial for your baby's development. During this time, your baby's body structure and organ systems develop.
              </Typography>
              <Link to="/pregnancy/first-trimester" style={{ textDecoration: 'none' }}>
                <Typography sx={{ color: '#000' }}>Read more</Typography>
              </Link>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
              <Typography variant="h6">Second Trimester (Weeks 13-26)</Typography>
              <Typography variant="body2" sx={{ color: '#666', my: 2 }}>
                The second trimester is often called the "golden period" of pregnancy. Your baby's features become more defined and you might feel movement.
              </Typography>
              <Link to="/pregnancy/second-trimester" style={{ textDecoration: 'none' }}>
                <Typography sx={{ color: '#000' }}>Read more</Typography>
              </Link>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
              <Typography variant="h6">Third Trimester (Weeks 27-40)</Typography>
              <Typography variant="body2" sx={{ color: '#666', my: 2 }}>
                The third trimester is the final stage of pregnancy. Your baby continues to grow and develop, getting ready for birth.
              </Typography>
              <Link to="/pregnancy/third-trimester" style={{ textDecoration: 'none' }}>
                <Typography sx={{ color: '#000' }}>Read more</Typography>
              </Link>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Heading Section */}
      <Container sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Blogs</Typography>
      </Container>

      {/* Grid Items */}
      <Container sx={{ mb: 8 }}>
        <Grid container spacing={8}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Paper sx={{ 
                p: 3, 
                height: '100%',
                mb: 4,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease'
                }
              }}>
                <Box sx={{ 
                  width: '100%', 
                  height: '200px', 
                  bgcolor: '#f5f5f5',
                  mb: 2 
                }} />
                <Typography variant="h6" sx={{ mb: 1 }}>Blog's Title</Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Typography sx={{ color: '#000' }}>Read more</Typography>
                </Link>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>

  );
};

export default HomePage;
