import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import api from "../services/api";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsData = await api.blog.getAllBlogs();
        setBlogs(blogsData.slice(0, 3)); 
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

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
          borderRadius: "8px",
          overflow: "hidden",  
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
      <Container 
        sx={{ 
          mb: 6, 
          overflow: 'hidden',
          maxWidth: '1200px !important',
          padding: '0 !important',
          borderRadius: '16px',
        }}
      >
        <Box
          className="carousel"
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: '250px',
            overflow: 'hidden',
            '& img': {
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              gridAutoColumns: '250px',
              animation: 'scroll 20s linear infinite',
              '@keyframes scroll': {
                '0%': {
                  transform: 'translateX(0)',
                },
                '100%': {
                  transform: 'translateX(calc(-250px * 6))', // Adjusted for more images
                },
              },
            }}
          >
            {[
              { src: '/images/baby-smile.jpg', title: 'Baby Care' },
              { src: '/images/doctor-patient.jpg', title: 'Doctor Care' },
              { src: '/images/134949-dep-tu-trong-trung-2.jpg', title: 'Baby Development' },
              { src: '/images/pregnant-teddy.jpg', title: 'Pregnancy Care' },
              { src: '/images/image001-2900-1703579998.jpg', title: 'Family Care' },
              { src: '/images/tre-mut-tay-3-c161-1662443957357294142935.jpg', title: 'Child Care' },
              // Duplicate for infinite effect
              { src: '/images/baby-smile.jpg', title: 'Baby Care' },
              { src: '/images/doctor-patient.jpg', title: 'Doctor Care' },
              { src: '/images/134949-dep-tu-trong-trung-2.jpg', title: 'Baby Development' },
              { src: '/images/pregnant-teddy.jpg', title: 'Pregnancy Care' },
              { src: '/images/image001-2900-1703579998.jpg', title: 'Family Care' },
              { src: '/images/tre-mut-tay-3-c161-1662443957357294142935.jpg', title: 'Child Care' },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  height: '300px',
                }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Blog Section */}
      <Container sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
          Latest Blog Posts
        </Typography>
        <Grid container spacing={4}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.blogId}>
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
                {blog.images && blog.images[0]?.imageUrl ? (
                  <Box
                    component="img"
                    src={blog.images[0].imageUrl}
                    alt={blog.title}
                    sx={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      mb: 2
                    }}
                  />
                ) : (
                  <Box sx={{ width: "100%", height: "200px", bgcolor: "#f5f5f5", mb: 2 }} />
                )}
                <Typography variant="h6">{blog.title}</Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                  {blog.content.substring(0, 100)}...
                </Typography>
                <Link to="/blog" style={{ textDecoration: "none" }}>
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