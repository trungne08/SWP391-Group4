import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../services/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
}));

const BlogImage = styled('img')({
  width: '100%',
  maxHeight: '500px',
  objectFit: 'cover',
  borderRadius: '16px',
  marginBottom: '24px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  }
});

const BackButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '30px',
  padding: '8px 20px',
  color: '#FF69B4',
  borderColor: '#FF69B4',
  '&:hover': {
    borderColor: '#FF1493',
    backgroundColor: 'rgba(255,105,180,0.1)',
    transform: 'translateX(-5px)',
  }
}));

function BlogDetail() {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const blogData = await api.blog.getBlogById(blogId);
        setBlog(blogData);
      } catch (error) {
        console.error("Failed to fetch blog detail:", error);
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [blogId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#FF69B4' }} />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Blog không tồn tại
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in timeout={1000}>
        <Box>
          <BackButton
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/blog')}
          >
            Quay Lại Blog
          </BackButton>

          <StyledPaper elevation={0}>
            {blog.images && blog.images[0]?.imageUrl && (
              <BlogImage
                src={blog.images[0].imageUrl}
                alt={blog.title}
              />
            )}
            
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                color: '#2c3e50',
                fontWeight: 700,
                mb: 3
              }}
            >
              {blog.title}
            </Typography>

            <Typography 
              variant="subtitle1" 
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              {new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: '#2c3e50',
                whiteSpace: 'pre-line'
              }}
            >
              {blog.content}
            </Typography>
          </StyledPaper>
        </Box>
      </Fade>

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
          Không thể tải thông tin bài viết
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default BlogDetail;