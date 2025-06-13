import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Chip, CircularProgress, Divider, Stack } from "@mui/material";
import axios from "axios";

const checklistFields = [
  { key: "PhotocopyOfBirthCertificate", label: "Photocopy of Birth Certificate" },
  { key: "PhotocopyOfMarriageCertificate", label: "Photocopy of Marriage Certificate" },
  { key: "BaptismalPermit", label: "Baptismal Permit" },
  { key: "CertificateOfNoRecordBaptism", label: "Certificate of No Record of Baptism" },
  { key: "PreBaptismSeminar1", label: "Pre-Baptism Seminar 1" },
  { key: "PreBaptismSeminar2", label: "Pre-Baptism Seminar 2" },
];

const UserMassBaptismChecklist = ({ massBaptismId }) => {
  const [checklist, setChecklist] = useState({
    PhotocopyOfBirthCertificate: false,
    PhotocopyOfMarriageCertificate: false,
    BaptismalPermit: false,
    CertificateOfNoRecordBaptism: false,
    PreBaptismSeminar1: false,
    PreBaptismSeminar2: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (massBaptismId) {
      axios
        .get(`${process.env.REACT_APP_API}/api/v1/massBaptism/getMassBaptismChecklist/${massBaptismId}`, 
            { withCredentials: true })
        .then((res) => {
          if (res.data.checklist) {
            setChecklist(res.data.checklist);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [massBaptismId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: "#154314", fontWeight: "bold", textAlign: "center" }}>
          Baptism Checklist
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          {checklistFields.map((field) => (
            <Box
              key={field.key}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f4f4f4",
                borderRadius: 1,
                px: 2,
                py: 1.5,
              }}
            >
              <Typography sx={{ fontSize: 15, color: "#333" }}>{field.label}</Typography>
              <Chip
                label={checklist[field.key] ? "Checked" : "Unchecked"}
                color={checklist[field.key] ? "success" : "default"}
                sx={{
                  minWidth: 90,
                  fontWeight: "bold",
                  color: "#fff",
                  backgroundColor: checklist[field.key] ? "green" : "gray",
                }}
              />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserMassBaptismChecklist;