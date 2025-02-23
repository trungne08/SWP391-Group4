import React from 'react';
import { 
  Container, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Button,
  Box 
} from '@mui/material';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function FAQ() {
  const faqData = [
    {
      question: "What is BabyCare Center?",
      answer: "BabyCare Center is a comprehensive platform dedicated to supporting mothers throughout their pregnancy journey and early childcare. We provide tracking tools, expert advice, and a supportive community."
    },
    {
      question: "How do I track my pregnancy progress?",
      answer: "You can track your pregnancy progress through our week-by-week guide, which provides detailed information about your baby's development, expected changes, and important milestones."
    },
    {
      question: "Is the information provided medically verified?",
      answer: "Yes, all medical information on our platform is reviewed and verified by qualified healthcare professionals, including obstetricians and pediatricians."
    },
    {
      question: "How can I join the community?",
      answer: "You can join our community by creating a free account. This gives you access to forums, discussion groups, and the ability to connect with other parents."
    },
    {
      question: "Are there any premium features?",
      answer: "Yes, we offer premium membership plans that provide access to exclusive content, personalized advice, and additional tracking tools."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team through email at support@babycare.com or through the contact form in the Contact Us section."
    }
  ];

  return (
    <>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, textAlign: 'center' }}>
          Frequently Asked Questions
        </Typography>
        
        {faqData.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography fontWeight="500">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
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