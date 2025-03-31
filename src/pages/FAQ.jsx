import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Button,
  Box,
  CircularProgress 
} from '@mui/material';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../services/api';

function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await api.faq.getAllFaqs();
        setFaqs(data);
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="md" sx={{ 
        py: 8,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 6, 
            textAlign: 'center',
            fontSize: '64px',  // Reduced from 72px
            fontFamily: '"Montserrat", "Be Vietnam Pro", sans-serif',
            fontWeight: 600,
            color: '#1a1a1a',  // Darker color for better contrast
            textShadow: '1px 1px 2px rgba(255, 192, 203, 0.4)',  // Subtler shadow
            letterSpacing: '1px',  // Reduced spacing
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',  // Shorter underline
              height: '3px',  // Thinner line
              background: 'linear-gradient(45deg, #FF69B4, #FFB6C1)',
              borderRadius: '2px'
            }
          }}
        >
          Câu Hỏi Thường Gặp
        </Typography>
        
        {faqs.map((faq) => (
          <Accordion 
            key={faq.id} 
            sx={{ 
              mb: 2,
              borderRadius: '12px !important',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: '16px 0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#FF69B4' }} />}
              aria-controls={`panel${faq.id}-content`}
              id={`panel${faq.id}-header`}
              sx={{
                borderRadius: '12px',
                '&.Mui-expanded': {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
                background: 'white',
                '&:hover': {
                  background: '#fafafa',
                }
              }}
            >
              <Typography 
                fontWeight="600" 
                sx={{ 
                  color: '#2c3e50',
                  fontSize: '1.1rem'
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ 
              background: 'white',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
              p: 3
            }}>
              <Typography 
                color="text.secondary"
                sx={{ 
                  whiteSpace: 'pre-line',
                  lineHeight: 1.8,
                  fontSize: '1rem'
                }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
    
        <Box sx={{ 
          textAlign: 'center', 
          mt: 8,
          p: 4,
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <Typography variant="h5" sx={{ 
            mb: 2,
            fontWeight: 700,
            color: '#2c3e50'
          }}>
            Bạn vẫn còn thắc mắc?
          </Typography>
          <Typography variant="body1" sx={{ 
            mb: 4, 
            color: 'text.secondary',
            fontSize: '1.1rem'
          }}>
            Không tìm thấy câu trả lời bạn đang tìm kiếm? Vui lòng liên hệ đội ngũ hỗ trợ của chúng tôi.
          </Typography>
          <Button
            component={Link}
            to="/contact"
            variant="contained"
            sx={{ 
              bgcolor: '#FF69B4',
              px: 4,
              py: 1.5,
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(255,105,180,0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#FF1493',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(255,105,180,0.4)',
              }
            }}
          >
            Liên Hệ Chúng Tôi
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default FAQ;