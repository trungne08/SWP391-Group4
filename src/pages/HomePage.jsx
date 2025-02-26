import React from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          backgroundImage: 'url("/images/doctor-patient.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          height: "500px",
          marginBottom: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          position: "relative",
          borderRadius: "8px", // bo góc
          overflow: "hidden",  // ẩn phần ảnh thừa
        }}
      >
        <Container sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              color: "#000",
              fontWeight: "bold",
              mb: 2,
              position: "relative",
              zIndex: 1,
              textShadow:
                "1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff",
            }}
          >
            BabyCare Center
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#666",
              position: "relative",
              zIndex: 1,
              textShadow:
                "0.5px 0.5px 0 #fff, -0.5px -0.5px 0 #fff, 0.5px -0.5px 0 #fff, -0.5px 0.5px 0 #fff",
            }}
          >
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
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <img
              src="/images/baby-smile.jpg"
              alt="Baby Care"
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                objectPosition: "top center",
                borderRadius: "8px",
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Trimester Sections */}
      <Container sx={{ mb: 6 }}>
        {[
          { title: "First Trimester (Weeks 1-12)", link: "/pregnancy/first-trimester" },
          { title: "Second Trimester (Weeks 13-26)", link: "/pregnancy/second-trimester" },
          { title: "Third Trimester (Weeks 27-40)", link: "/pregnancy/third-trimester" },
        ].map((trimester, index) => (
          <Paper key={index} sx={{ p: 3, bgcolor: "#f5f5f5", mb: 3 }}>
            <Typography variant="h6">{trimester.title}</Typography>
            <Typography variant="body2" sx={{ color: "#666", my: 2 }}>
              Learn about your baby’s growth and development during this period.
            </Typography>
            <Link to={trimester.link} style={{ textDecoration: "none" }}>
              <Typography sx={{ color: "#000" }}>Read more</Typography>
            </Link>
          </Paper>
        ))}
      </Container>

      {/* Blog Section */}
      <Container sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Paper
                sx={{
                  p: 3,
                  height: "100%",
                  '&:hover': {
                    transform: "translateY(-4px)",
                    transition: "transform 0.3s ease",
                  },
                }}
              >
                <Box sx={{ width: "100%", height: "200px", bgcolor: "#f5f5f5", mb: 2 }} />
                <Typography variant="h6">Blog's Title</Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                  Learn more about pregnancy and baby care in our latest blog posts.
                </Typography>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Typography sx={{ color: "#000" }}>Read more</Typography>
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