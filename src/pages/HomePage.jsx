import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Grid, Paper, Fade, Slide } from "@mui/material";
import { Link } from "react-router-dom";
import api from "../services/api";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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
      {/* Hero Section với hiệu ứng fade in */}
      <Fade in={isVisible} timeout={1500}>
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            backgroundImage: 'url("/img2.webp")', // Sửa đường dẫn ảnh hero
            backgroundSize: "cover",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
            height: "600px", // Tăng chiều cao
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
            position: "relative",
            borderRadius: "16px", // Tăng border radius
            overflow: "hidden",
            "&::before": { // Thêm overlay gradient
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1))",
              zIndex: 1,
            },
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.01)",
            },
          }}
        >
          <Container sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
            <Typography
              variant="h1"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                mb: 3,
                fontSize: { xs: "2.5rem", md: "4rem" },
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              BabyCare Center
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                mb: 4,
                fontSize: { xs: "1.5rem", md: "2rem" },
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              Professional Growth | Tracking System
            </Typography>
          </Container>
        </Box>
      </Fade>

      {/* Featured Images với hiệu ứng mượt hơn */}
      <Container 
        sx={{ 
          mb: 8, 
          overflow: 'hidden',
          maxWidth: '1200px !important',
          padding: '0 !important',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Box
          className="carousel"
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: '300px', // Tăng kích thước
            gap: '20px', // Thêm khoảng cách
            padding: '20px',
            overflow: 'hidden',
            '& img': {
              borderRadius: '12px',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            },
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
              { src: '/images/hinh-nen-em-be-de-thuong-cho-dien-thoai-2-07-11-44-50.jpg', title: 'BaBy' },
              { src: '/images/134949-dep-tu-trong-trung-2.jpg', title: 'Baby Development' },
              { src: '/images/hinh-nen-em-be-de-thuong-cho-dien-thoai-6-07-11-46-22.jpg', title: 'Pregnancy Care' },
              { src: '/images/image001-2900-1703579998.jpg', title: 'Family Care' },
              { src: '/images/tre-mut-tay-3-c161-1662443957357294142935.jpg', title: 'Child Care' },
              // Duplicate for infinite effect
              { src: '/images/baby-smile.jpg', title: 'Baby Care' },
              { src: '/images/hinh-nen-em-be-de-thuong-cho-dien-thoai-2-07-11-44-50.jpg', title: 'BaBy' },
              { src: '/images/134949-dep-tu-trong-trung-2.jpg', title: 'Baby Development' },
              { src: '/images/hinh-nen-em-be-de-thuong-cho-dien-thoai-6-07-11-46-22.jpg', title: 'Pregnancy Care' },
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

      {/* Blog Section với hiệu ứng slide up */}
      <Container sx={{ mb: 8 }}>
        <Slide direction="up" in={isVisible} timeout={1000}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 5, 
              textAlign: "center",
              fontWeight: "bold",
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Latest Blog Posts
          </Typography>
        </Slide>
        <Grid container spacing={4}>
          {blogs.map((blog, index) => (
            <Grid item xs={12} sm={6} md={4} key={blog.blogId}>
              <Fade in={isVisible} timeout={1000 + index * 500}>
                <Paper
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    '&:hover': {
                      transform: "translateY(-8px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Box sx={{ height: '200px', mb: 2, overflow: 'hidden', borderRadius: '8px' }}>
                    <img
                      src={blog.images?.[0]?.imageUrl}
                      alt={blog.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        console.error("Image load error:", e);
                        e.target.onerror = null;
                        e.target.src = '/fallback-image.jpg';
                      }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    {blog.content?.substring(0, 150)}...
                  </Typography>
                  <Link 
                    to={`/blog/${blog.blogId}`}
                    style={{ 
                      textDecoration: 'none',
                      color: '#2196F3',
                      fontWeight: 'bold',
                      display: 'block',
                      marginTop: 'auto'
                    }}
                  >
                    Read More →
                  </Link>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;