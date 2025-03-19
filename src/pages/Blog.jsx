import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Fade,
  Grow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../services/api';
import { Alert, Snackbar } from '@mui/material';  // Thêm import này

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  }
}));

const StyledCardMedia = styled(CardMedia)({
  height: 240,
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
  }
});

const BlogTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  color: '#2c3e50',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-16px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    background: 'linear-gradient(45deg, #FF69B4, #FFB6C1)',
    borderRadius: '2px',
  }
}));

const ShowMoreButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: '12px 32px',
  borderRadius: '30px',
  background: 'linear-gradient(45deg, #FF69B4, #FFB6C1)',
  color: 'white',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(45deg, #FF1493, #FF69B4)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(255,105,180,0.4)',
  }
}));

function Blog() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Thêm states cho alert
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Thay đổi trong useEffect
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsData = await api.blog.getAllBlogs();
        setBlogs(blogsData);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setAlertMessage("Không thể tải danh sách blog");
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Fade in timeout={1000}>
        <BlogTitle variant="h1">
          Pregnancy Journey Blog
        </BlogTitle>
      </Fade>

      <Grid container spacing={4}>
        {(isExpanded ? blogs : blogs.slice(0, 6)).map((blog, index) => (
          <Grid item xs={12} sm={6} md={4} key={blog.blogId || index}>
            <Grow in timeout={500 * (index % 3 + 1)}>
              <StyledCard onClick={() => navigate(`/blog/${blog.blogId}`)}>
                <StyledCardMedia
                  image={blog.images?.[0]?.imageUrl || '/fallback-image.jpg'}
                  title={blog.title}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    fontWeight: 600,
                    color: '#2c3e50',
                    mb: 2
                  }}>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2
                    }}
                  >
                    {blog.content}
                  </Typography>
                  <Box sx={{ 
                    color: '#FF69B4',
                    fontWeight: 500,
                    '&:hover': { pl: 1 },
                    transition: 'all 0.3s ease'
                  }}>
                    Read More →
                  </Box>
                </CardContent>
              </StyledCard>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {blogs.length > 6 && (
        <Box sx={{ textAlign: 'center' }}>
          <ShowMoreButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Show Less" : "Show More"}
          </ShowMoreButton>
        </Box>
      )}
      
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Blog;