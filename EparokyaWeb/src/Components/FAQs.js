import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Container, useMediaQuery } from "@mui/material";
import GuestSideBar from "./GuestSideBar";

const faqs = [
  {
    question: "Payment Method",
    answer:
      "The parish only accepts IN-PERSON payments.\n\nFor payment instructions and approval notifications, please monitor your SMS, email, and in-app chat messages.\n\nKindly review the Terms and Conditions found on the “Request” page of each form before proceeding."
  },
  {
    question: "How do I determine the requirements for an appointment?",
    answer:
      "You can view a complete list of requirements by visiting the “Guides” page, located near your name at the top of the screen.\n\nEach form has detailed instructions to help you prepare the necessary documents."
  },
  {
    question: "How long does it take to process my submitted request form?",
    answer:
      "(For Wedding, Funeral, Baptism, Counseling, Blessings, and Prayers)\n\n• Initial review: 10–24 hours after submission\n• Full verification: 1–3 working days\n\nPlease keep your lines open for follow-up questions or clarifications."
  },
  {
    question: "If I complete my documents and application, am I automatically scheduled?",
    answer:
      "No. All submissions go through a verification process which considers:\n• Schedule availability (date & time)\n• Accuracy and legitimacy of the provided information\n• Completeness of required documents\n\nFailure to comply with the stated requirements may result in your application being declined.\n\nRefer to the “Guides” page for specific instructions related to Weddings, Baptisms, Funerals, Mass Weddings, and Mass Baptisms."
  },
  {
    question: "What happens after I’m verified and eligible?",
    answer:
      "For Wedding, Baptism, and Funeral requests:\n\nPlease wait for admin confirmation before submitting your documents in person.\n\nDocuments uploaded online are for initial verification only and will help determine whether your request can proceed to scheduling."
  },
  {
    question: "Who do I contact if chat is unavailable?",
    answer:
      "For concerns or inquiries, reach out via:\n• Email: eparokyasys@gmail.com\n• Facebook: Saint Joseph Parish - Taguig\n• Mobile: 09**** (insert correct number)\n\nIf you’ve had previous correspondence with the Admin, you can access it via the “Chat” icon located at the bottom of your screen."
  },
  {
    question: "How are prayer requests handled?",
    answer:
      "Once submitted, your prayer request is immediately forwarded to the Parish Priest for review and prayer."
  }
];


const FAQs = () => {
  const [showSidePanel, setShowSidePanel] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <Box >
      {isMobile && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "10px",
          }}
        >
          {/* Left-side button (existing) */}
          <button
            onClick={() => setShowSidePanel(!showSidePanel)}
            style={{
              background: "none",
              border: "none",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            ☰
          </button>


        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && showSidePanel && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowSidePanel(false)} // close when clicking outside
        >
          <div>

            <div>
              <GuestSideBar />
            </div>
          </div>
        </div>
      )}
      <Box sx={{ display: "flex", height: "100vh" }}>
        {!isMobile && (
          <div>
            <GuestSideBar />
          </div>
        )}
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
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ whiteSpace: "pre-line" }}
                >
                  {faq.answer}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Container>
      </Box>
    </Box>
  );
};

export default FAQs;
