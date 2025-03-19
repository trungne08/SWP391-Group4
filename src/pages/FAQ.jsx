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
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, textAlign: 'center' }}>
          Frequently Asked Questions
        </Typography>
        
        {faqs.map((faq) => (
          <Accordion key={faq.id} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${faq.id}-content`}
              id={`panel${faq.id}-header`}
            >
              <Typography fontWeight="500">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography 
                color="text.secondary"
                sx={{ whiteSpace: 'pre-line' }} // This will preserve line breaks in the answer
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
    
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Still have questions?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Can't find the answer you're looking for? Please contact our support team.
          </Typography>
          <Button
            component={Link}
            to="/contact"
            variant="contained"
            sx={{ 
              bgcolor: 'black',
              '&:hover': {
                bgcolor: '#333'
              }
            }}
          >
            Contact Us
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default FAQ;