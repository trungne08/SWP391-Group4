import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Grid, Paper, Fade, Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { Link } from "react-router-dom";
import api from "../services/api";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dueReminders, setDueReminders] = useState({ overdue: [], today: [] });

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  useEffect(() => {
    setIsVisible(true);
    const checkAuthAndShowPopup = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setIsLoggedIn(true);
          setOpenPopup(true);  // This should trigger the popup
          
          try {
            const remindersData = await api.reminders.getAllReminders();
            console.log("Reminders data received:", remindersData); // Add logging

            if (Array.isArray(remindersData)) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              const overdue = remindersData.filter(reminder => {
                const reminderDate = new Date(reminder.reminderDate);
                reminderDate.setHours(0, 0, 0, 0);
                return reminderDate < today;
              });

              const todayReminders = remindersData.filter(reminder => {
                const reminderDate = new Date(reminder.reminderDate);
                reminderDate.setHours(0, 0, 0, 0);
                return reminderDate.getTime() === today.getTime();
              });

              setDueReminders({ overdue, today: todayReminders });
            }
          } catch (reminderError) {
            console.error("Failed to fetch reminders:", reminderError);
          }
        } else {
          console.log("No token found, popup won't show"); // Add logging
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuthAndShowPopup();
  }, []);

  const fetchBlogs = async () => {
    try {
      const blogsData = await api.blog.getAllBlogs();
      setBlogs(blogsData.slice(0, 3)); 
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  // Remove these lines as they're causing the error
  // checkAuthAndShowPopup();
  // fetchBlogs();

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #fff1f9 0%, #fff 100%)' }}>
      {/* Welcome Popup */}
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        aria-labelledby="welcome-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '20px',
            background: 'linear-gradient(145deg, #fff5f8, #fff)',
            maxWidth: '500px',
            width: '90%',
          }
        }}
      >
        <DialogTitle 
          id="welcome-dialog-title"
          sx={{
            textAlign: 'center',
            color: '#FF69B4',
            fontFamily: "'Comfortaa', cursive",
            fontWeight: 'bold',
          }}
        >
          Chào Mừng Đến Với Pregnancy Tracking
        </DialogTitle>
        <DialogContent>
          <Typography 
            sx={{ 
              textAlign: 'center',
              mb: 2,
              fontFamily: "'Quicksand', sans-serif",
            }}
          >
            Chúng tôi sẽ đồng hành cùng bạn trong hành trình làm mẹ tuyệt vời này! 🌸
          </Typography>
          </DialogContent>
        {/* Existing DialogActions */}
        <DialogActions sx={{ justifyContent: 'center', flexDirection: 'column', pb: 2 }}>
          <Button 
            onClick={handleClosePopup}
            sx={{
              background: 'linear-gradient(45deg, #FF69B4 30%, #FFB6C1 90%)',
              color: 'white',
              padding: '10px 30px',
              borderRadius: '25px',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF1493 30%, #FF69B4 90%)',
              }
            }}
          >
            Bắt Đầu Khám Phá
          </Button>
          
          <Link 
            to="/reminder"
            style={{ 
              textDecoration: 'none',
              marginTop: '15px',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                color: '#FF69B4',
                fontSize: '0.9rem',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              Hôm nay có {dueReminders.today.length} nhắc nhở đến hạn và {dueReminders.overdue.length} nhắc nhở quá hạn
            </Typography>
          </Link>
        </DialogActions>
      </Dialog>

      <Fade in={isVisible} timeout={1500}>
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            backgroundImage: 'url("/img2.webp")',
            backgroundSize: "cover",
            backgroundPosition: "top center",
            height: "600px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
            position: "relative",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: '0 8px 32px rgba(255, 182, 193, 0.3)',
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(rgba(255,182,193,0.3), rgba(255,192,203,0.1))",
              zIndex: 1,
            },
            transition: "all 0.5s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: '0 12px 40px rgba(255, 182, 193, 0.4)',
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
                fontSize: { xs: "2.5rem", md: "4.5rem" },
                textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
                fontFamily: "'Comfortaa', cursive",
              }}
            >
              Theo Dõi Thai Kỳ
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                mb: 4,
                fontSize: { xs: "1.5rem", md: "2.2rem" },
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                fontFamily: "'Quicksand', sans-serif",
              }}
            >
              Hành Trình Làm Mẹ Của Bạn ✨
            </Typography>
          </Container>
        </Box>
      </Fade>

      {/* Featured Images Carousel */}
      <Container 
        sx={{ 
          mb: 8, 
          overflow: 'hidden',
          maxWidth: '1200px !important',
          padding: '0 !important',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(255, 182, 193, 0.2)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
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
              { src: '/images/baby-smile.jpg', title: 'Chăm Sóc Em Bé' },
              { src: '/images/hinh-nen-em-be-de-thuong-cho-dien-thoai-2-07-11-44-50.jpg', title: 'Em Bé' },
              { src: '/images/134949-dep-tu-trong-trung-2.jpg', title: 'Sự Phát Triển Của Bé' },
              { src: '/images/hinh-nen-em-be-de-thuong-cho-dien-thoai-6-07-11-46-22.jpg', title: 'Chăm Sóc Thai Kỳ' },
              { src: '/images/image001-2900-1703579998.jpg', title: 'Chăm Sóc Gia Đình' },
              { src: '/images/tre-mut-tay-3-c161-1662443957357294142935.jpg', title: 'Chăm Sóc Trẻ Em' },
              // Duplicate for infinite effect
              { src: '/images/baby-smile.jpg', title: 'Chăm Sóc Em Bé' },
              { src: '/images/hinh-nen-em-be-de-thuong-cho-dien-thoai-2-07-11-44-50.jpg', title: 'Em Bé' },
              { src: '/images/134949-dep-tu-trong-trung-2.jpg', title: 'Sự Phát Triển Của Bé' },
              { src: '/images/hinh-nen-em-be-de-thuong-cho-dien-thoai-6-07-11-46-22.jpg', title: 'Chăm Sóc Thai Kỳ' },
              { src: '/images/image001-2900-1703579998.jpg', title: 'Chăm Sóc Gia Đình' },
              { src: '/images/tre-mut-tay-3-c161-1662443957357294142935.jpg', title: 'Chăm Sóc Trẻ Em' },
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
        <Slide direction="up" in={isVisible} timeout={1000}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 5, 
              textAlign: "center",
              fontWeight: "bold",
              background: "linear-gradient(45deg, #FF69B4 30%, #FFB6C1 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Comfortaa', cursive",
              position: 'relative',
              paddingBottom: '20px', // Thêm padding phía dưới
              lineHeight: '1.5', // Điều chỉnh chiều cao dòng
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '0', // Điều chỉnh vị trí của gạch chân
                left: '50%',
                transform: 'translateX(-50%)',
                width: '150px', // Tăng độ rộng của gạch chân
                height: '3px',
                background: 'linear-gradient(45deg, #FF69B4 30%, #FFB6C1 90%)',
                borderRadius: '10px',
              }
            }}
          >
            Blog Hành Trình Thai Kỳ
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
                    borderRadius: "20px",
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 8px 32px rgba(255, 182, 193, 0.15)',
                    transition: "all 0.4s ease",
                    '&:hover': {
                      transform: "translateY(-12px) scale(1.02)",
                      boxShadow: '0 12px 40px rgba(255, 182, 193, 0.25)',
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
                      color: '#FF69B4',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginTop: '15px',
                      padding: '8px 16px',
                      background: 'linear-gradient(45deg, #FFE5EE 30%, #FFF0F5 90%)',
                      borderRadius: '20px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 105, 180, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Xem Thêm →
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