import React, { useState, useEffect, useMemo } from "react";
import { Container, Typography, Grid, Button, TextField, Modal, Box } from "@mui/material";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import axios from "axios";

const emojiOptions = ["😡", "😠", "😞", "😕", "😐", "😊", "😃", "😄", "😍", "👍"];
const questions = [
  "How approachable was the priest?",
  "Did the priest effectively deliver the message?",
  "Was the homily engaging and meaningful?",
  "Did you feel spiritually uplifted?",
  "Would you recommend this priest to others?",
];

const PriestSentiment = () => {
  const [activePriest, setActivePriest] = useState(null);
  const [responses, setResponses] = useState(Array(5).fill(null));
  const [comment, setComment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const config = useMemo(() => ({ withCredentials: true }), []);

  useEffect(() => {
    // Fetch Active Priest Selection
    axios
      .get(`${process.env.REACT_APP_API}/api/v1/admin-selections/active`, config)
      .then((res) => setActivePriest(res.data))
      .catch((err) => console.error("Error fetching active priest:", err));
  }, [config]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/profile`, config);
        setUserId(response.data.user._id);
      } catch (error) {
        console.error("Error fetching user:", error.response?.data || error.message);
      }
    };
    fetchUser();
  }, [config]);

  const handleSelectEmoji = (index, emoji) => {
    const updatedResponses = [...responses];
    updatedResponses[index] = emoji;
    setResponses(updatedResponses);
  };

  const handleSubmit = async () => {
    if (!activePriest?.typeId?._id) {
      alert("Priest ID is missing. Please try again.");
      console.error("Missing priestId:", activePriest);
      return;
    }

    if (responses.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    if (!userId) {
      alert("User not found. Please log in again.");
      console.error("User ID is missing:", userId);
      return;
    }

    const requestData = {
      userId,
      priestId: activePriest.typeId._id,
      responses: responses.map((emoji, index) => ({
        question: questions[index],
        emoji,
      })),
      comment,
    };

    console.log("Submitting Priest Sentiment:", requestData);

    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/analyzePriestSentiment`,
        requestData,
        config
      );
      setModalOpen(true);
    } catch (error) {
      console.error("Error submitting sentiment:", error.response?.data || error);
      alert(error.response?.data?.error || "Failed to submit feedback.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {activePriest ? (
        <>
          <Typography variant="h6">
            Form Status: {activePriest.isActive ? "Active" : "Inactive"}
          </Typography>
          <Typography variant="subtitle1">
            Date: {activePriest.date} | Time: {activePriest.time}
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Priest: {activePriest.typeId?.name}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Active Form Type: {activePriest.category.charAt(0).toUpperCase() + activePriest.category.slice(1)}
          </Typography>
        </>
      ) : (
        <Typography variant="h6" color="error">
          No active priest found.
        </Typography>
      )}
  
      <Typography variant="h6" sx={{ mt: 3 }}>
        Feedback Form
      </Typography>
      {questions.map((q, index) => (
        <Box key={index} sx={{ my: 2 }}>
          <Typography>{q}</Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {emojiOptions.map((emoji) => (
              <Grid item key={emoji}>
                <Button
                  variant={responses[index] === emoji ? "contained" : "outlined"}
                  onClick={() => handleSelectEmoji(index, emoji)}
                >
                  {emoji}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
  
      <TextField
        label="Other Comments/Suggestions"
        fullWidth
        multiline
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mt: 2 }}
      />
  
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 3 }}>
        Submit Feedback
      </Button>
  
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "white",
            borderRadius: 2,
            textAlign: "center",
            mx: "auto",
            mt: 10,
            width: 400,
          }}
        >
          <SentimentSatisfiedAltIcon color="success" sx={{ fontSize: 50 }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Thank you for your feedback!
          </Typography>
          <Typography>This will be a great help for the Parish to improve.</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
  
};

export default PriestSentiment;
