import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Stack,
} from "@mui/material";
import GuestSideBar from "./GuestSideBar";

const guides = [
  {
    title: "Wedding (500)",
    details: [
      "Submit wedding form not less than 3 months before preferred date.",
      "Prepare NSO Birth Certificate & Baptismal Certificate.",
      "Fee: ₱3,000 (with choir), ₱2,000 (without choir)",
    ],
  },
  {
    title: "Baptism (Requirements)",
    details: [
      "Submit child's birth certificate.",
      "At least two primary godparent must be a practicing Catholic.",
      "Arrive 30 minutes before scheduled baptism.",
    ],
  },
  {
    title: "Funeral (Arrangements)",
    details: [
      "Provide death certificate copy.",
      "Coordinate with parish office for mass schedule.",
      "Priest honorarium is voluntary.",
    ],
  },
  {
    title: "House Blessing (Guide)",
    details: [
      "Submit request at least 1 week ahead.",
      "Prepare holy water & candles.",
      "Preferably all family members present during blessing.",
    ],
  },
  {
    title: "Counseling (Process)",
    details: [
      "Strictly confidential.",
      "Schedule at least 3 days in advance.",
      "Arrive 15 minutes before your time slot.",
    ],
  },
  {
    title: "Mass Intention (Submission)",
    details: [
      "Indicate full name of person being prayed for.",
      "Can be submitted online or through office.",
      "Donation is appreciated but not required.",
    ],
  },
];

const cardsPerPage = 5;

const Guides = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const startIndex = (currentPage - 1) * cardsPerPage;
  const paginatedGuides = guides.slice(startIndex, startIndex + cardsPerPage);

  const totalPages = Math.ceil(guides.length / cardsPerPage);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <GuestSideBar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
          Form Submission Guides
        </Typography>

        <Stack spacing={3}>
          {paginatedGuides.map((guide, index) => (
            <Card key={index} elevation={3}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {guide.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {guide.details[0]}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => setSelectedGuide(guide)}>Click to See More</Button>
              </CardActions>
            </Card>
          ))}
        </Stack>

        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
          />
        </Box>

        {/* Dialog for Guide Details */}
        <Dialog open={!!selectedGuide} onClose={() => setSelectedGuide(null)} fullWidth maxWidth="sm">
          <DialogTitle>{selectedGuide?.title}</DialogTitle>
          <DialogContent dividers>
            {selectedGuide?.details.map((detail, idx) => (
              <Typography key={idx} paragraph>
                • {detail}
              </Typography>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedGuide(null)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Guides;
