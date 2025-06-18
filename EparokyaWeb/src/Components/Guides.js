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
  Divider,
} from "@mui/material";
import GuestSideBar from "./GuestSideBar";

const guides = [
  {
    title: "Wedding (Rite: 4500 ; Mass: 10,000)",
    details: [
      "Submit wedding form not less than 3 months before preferred date.",
      "Prepare for both Groom and Bride's Document/Image Requirements:",
      "Baptismal Certificate (issued within 6 months)",
      "Confirmation Certificate",
      "Marriage License",
      "Marriage Bans",
      "Certificate of No Marriage Record (CENOMAR)",
      "PSA Birth Certificate.",
      "One By One Pictures",
      "Please be advised that the parish only accepts IN-PERSON payments.",
      "Once confirmed, One by One pictures of the couple will be posted in the Wedding Wall.",
      "Keep your lines opened for follow-up questions, concerns, and requirements.",
      "Refer to the Wedding Calendar shown in the Wedding Form.",
      "NO SCHEDULES ON MONDAYS, NO SAME WEDDING DAY, ONLY MORNING SCHEDULES.",
    ],
  },
  {
    title: "Baptism (Solo: 1500)",
    details: [
      "Submit child's birth certificate.",
      "At least two primary godparents.",
      "Prepare for the following Document/Image Requirements:",
      "Birth Certificate",
      "Marriage Certificate (For Married Parents)",
      "Prepare for the following Additional Requirements (7 years old and above):",
      "Baptism Permit from Issuing Parish",
      "Certificate of No Record of Baptism (CENOMAR)",
      "Arrive 30 minutes before scheduled baptism.",
      "Keep your lines opened for follow-up questions, concerns, and requirements.",
      "Refer to the Baptism Calendar shown in the Baptism Form.",
      "NO SCHEDULES ON MONDAYS, NO SAME DAY WEDDING, ONLY MORNING SCHEDULES.",
    ],
  },
  {
    title: "Funeral (Fee: Donation)",
    details: [
      "Provide death certificate copy.",
      "Coordinate with parish office for mass schedule.",
      "The body or ashes of the deceased should be present during the mass.",
    ],
  },
  {
    title: "Blessing (Fee: Donation)",
    details: [
      "Submit request at least 1 week ahead.",
      "Prepare holy water & candles.",
      "Preferably all family members present during blessing.",
    ],
  },
  {
    title: "Counseling (Fee: N/A)",
    details: ["Strictly confidential.", "Schedule at least 3 days in advance."],
  },
  {
    title: "Mass Intention (Submission)",
    details: [
      "Indicate full name of person being prayed for.",
      "Can be submitted online or through office.",
    ],
  },
];

const cardsPerPage = 4;

const Guides = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const startIndex = (currentPage - 1) * cardsPerPage;
  const paginatedGuides = guides.slice(startIndex, startIndex + cardsPerPage);
  const totalPages = Math.ceil(guides.length / cardsPerPage);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <GuestSideBar />
      <Box sx={{ flex: 1, py: 4, px: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Form Submission Guides
        </Typography>

        <Stack spacing={3}>
          {paginatedGuides.map((guide, index) => (
            <Card key={index} elevation={3}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {guide.title}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Stack spacing={1} sx={{ pl: 2 }}>
                  {guide.details.slice(0, 3).map((point, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary">
                      • {point}
                    </Typography>
                  ))}
                  {guide.details.length > 3 && (
                    <Typography variant="body2" color="primary" mt={1}>
                      + {guide.details.length - 3} more...
                    </Typography>
                  )}
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                <Button size="small" onClick={() => setSelectedGuide(guide)}>
                  View Full Guide
                </Button>
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

        {/* Dialog for Full Guide */}
        <Dialog
          open={!!selectedGuide}
          onClose={() => setSelectedGuide(null)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle fontWeight="bold">{selectedGuide?.title}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={1} sx={{ pl: 2 }}>
              {selectedGuide?.details.map((detail, idx) => (
                <Typography key={idx} variant="body1">
                  • {detail}
                </Typography>
              ))}
            </Stack>
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
