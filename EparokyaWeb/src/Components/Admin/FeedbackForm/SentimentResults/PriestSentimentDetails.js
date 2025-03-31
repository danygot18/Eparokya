import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import SideBar from "../../SideBar";

const PriestSentimentDetails = () => {
  const { id } = useParams();
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSentimentDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getPriestSentimentById/${id}`
        );
        setSentiment(response.data);
      } catch (err) {
        console.error("Error fetching sentiment details:", err);
        setError("Failed to fetch sentiment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentDetails();
  }, [id]);

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

  if (!sentiment) {
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
          No sentiment data available.
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
          Priest Sentiment Details
        </Typography>

        {/* Sentiment Metadata */}
        <Box sx={{ marginBottom: "20px" }}>
          <Typography variant="body1">
            <strong>User:</strong> {sentiment.userId?.name || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Priest:</strong> {sentiment.priestId?.fullName || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Overall Sentiment:</strong> {sentiment.overallSentiment}
          </Typography>
          <Typography variant="body1">
            <strong>Confidence:</strong> {sentiment.confidence.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            <strong>Comment:</strong> {sentiment.comment || "No comment"}
          </Typography>
          <Typography variant="body1">
            <strong>Comment Sentiment:</strong>{" "}
            {sentiment.commentSentiment?.label || "N/A"}
          </Typography>
        </Box>

        <Divider sx={{ marginBottom: "20px" }} />

        {/* Responses Table */}
        <Typography variant="h5" gutterBottom>
          Responses
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Question</strong>
                </TableCell>
                <TableCell>
                  <strong>Emoji</strong>
                </TableCell>
                <TableCell>
                  <strong>Score</strong>
                </TableCell>
                <TableCell>
                  <strong>Comparative</strong>
                </TableCell>
                <TableCell>
                  <strong>Magnitude</strong>
                </TableCell>
                <TableCell>
                  <strong>Positive</strong>
                </TableCell>
                <TableCell>
                  <strong>Negative</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sentiment.responses.map((response) => (
                <TableRow key={response._id}>
                  <TableCell>{response.question}</TableCell>
                  <TableCell>{response.emoji}</TableCell>
                  <TableCell>{response.sentimentResult.score}</TableCell>
                  <TableCell>{response.sentimentResult.comparative}</TableCell>
                  <TableCell>{response.sentimentResult.magnitude}</TableCell>
                  <TableCell>
                    {response.sentimentResult.positive.join(", ") || "N/A"}
                  </TableCell>
                  <TableCell>
                    {response.sentimentResult.negative.join(", ") || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default PriestSentimentDetails;