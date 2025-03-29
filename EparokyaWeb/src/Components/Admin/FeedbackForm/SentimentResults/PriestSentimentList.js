import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SideBar from "../../SideBar";

const PriestSentimentList = () => {
  const [sentiments, setSentiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchSentiments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getAllPriestSentiment`
        );
        setSentiments(response.data);
      } catch (err) {
        console.error("Error fetching priest sentiments:", err);
        setError("Failed to fetch priest sentiments.");
      } finally {
        setLoading(false);
      }
    };

    fetchSentiments();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/admin/PriestSentimentDetails/${id}`); 
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <Container sx={{ marginLeft: "240px", paddingTop: "20px" }}>
        <Typography variant="h4" gutterBottom sx={{ paddingTop: "20px" }}>
          Priest Sentiments
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>User</strong></TableCell>
                <TableCell><strong>Priest</strong></TableCell>
                <TableCell><strong>Overall Sentiment</strong></TableCell>
                <TableCell><strong>Confidence</strong></TableCell>
                <TableCell><strong>Comment</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sentiments.map((sentiment) => (
                <TableRow
                  key={sentiment._id}
                  onClick={() => handleCardClick(sentiment._id)} // Add onClick handler
                  sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }} // Add hover effect
                >
                  <TableCell>{sentiment.userId?.name || "N/A"}</TableCell>
                  <TableCell>{sentiment.priestId?.fullName || "N/A"}</TableCell>
                  <TableCell>{sentiment.overallSentiment}</TableCell>
                  <TableCell>{sentiment.confidence.toFixed(2)}</TableCell>
                  <TableCell>{sentiment.comment || "No comment"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default PriestSentimentList;