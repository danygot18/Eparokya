import React from "react";
import { Box, Card, CardContent, Typography, Container } from "@mui/material";
import GuestSideBar from "./GuestSideBar";

const faqs = [
  {
    question: "Sino makakakita ng aking pinapasang mga forms?",
    answer:
      "Ang mga makakakita ng iyong sinumitte ay ang Secretary, Assistant Secretary, at si Padre lamang."
  },
  {
    question: "Gaano katagal ang proseso ng aking request?",
    answer:
      "You will need to submit valid IDs of both parties, a Certificate of No Marriage (CENOMAR), and baptismal/confirmation certificates."
  },
  {
    question: "Can I cancel my submitted request?",
    answer:
      "Yes, requests can be canceled by logging into your account and selecting the 'Cancel' button from the request details page, if it hasn't been confirmed yet."
  }
 
];

const FAQs = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <GuestSideBar />
      <Container sx={{ py: 4, px: 3, overflowY: "auto" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Frequently Asked Questions (FAQs)
        </Typography>

        {faqs.map((faq, index) => (
          <Card key={index} sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {faq.question}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {faq.answer}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Container>
    </Box>
  );
};

export default FAQs;
