import React, { useEffect, useState } from "react";
import { Scatter, Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import { Container, Tabs, Tab, Box } from "@mui/material";

const SentimentResult = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [eventSentiment, setEventSentiments] = useState([]);
  const [activitySentiment, setActivitySentiments] = useState([]);
  const [priestSentiment, setPriestSentiments] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/api/v1/getAllEventSentiment`)
      .then(res => setEventSentiments(res.data))
      .catch(err => console.error("Error fetching event sentiments:", err));
  
    axios.get(`${process.env.REACT_APP_API}/api/v1/getAllActivitySentiment`)
      .then(res => setActivitySentiments(res.data))
      .catch(err => console.error("Error fetching activity sentiments:", err));
  
    axios.get(`${process.env.REACT_APP_API}/api/v1/getAllPriestSentiment`)
      .then(res => setPriestSentiments(res.data))
      .catch(err => console.error("Error fetching priest sentiments:", err));
  }, []);

  const sentiments = [eventSentiment, activitySentiment, priestSentiment][tabIndex];

  // Prepare Scatter Data
  const scatterData = {
    datasets: sentiments.map((sentiment, index) => ({
      label: sentiment.comment,
      data: [{
        x: sentiment.commentSentiment.score,
        y: sentiment.commentSentiment.magnitude,
      }],
      backgroundColor: sentiment.commentSentiment.score < 0 ? "red" : "green",
      borderColor: "black",
      pointRadius: 6,
      pointHoverRadius: 8,
    })),
  };

  // Prepare Emoji & Comment Stacked Bar Data
  const emojiCount = {};
  const positiveWords = {};
  const negativeWords = {};

  sentiments.forEach(sentiment => {
    sentiment.responses.forEach(response => {
      if (response.emoji) {
        emojiCount[response.emoji] = (emojiCount[response.emoji] || 0) + 1;
      }
    });
    
    sentiment.commentSentiment.positive.forEach(word => {
      positiveWords[word] = (positiveWords[word] || 0) + 1;
    });
    
    sentiment.commentSentiment.negative.forEach(word => {
      negativeWords[word] = (negativeWords[word] || 0) + 1;
    });
  });

  const barData = {
    labels: Object.keys(emojiCount),
    datasets: [
      {
        label: "Emoji Frequency",
        data: Object.values(emojiCount),
        backgroundColor: "orange",
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  const stackedBarData = {
    labels: Object.keys({ ...positiveWords, ...negativeWords }),
    datasets: [
      {
        label: "Positive Words",
        data: Object.keys(positiveWords).map(word => positiveWords[word] || 0),
        backgroundColor: "green",
      },
      {
        label: "Negative Words",
        data: Object.keys(negativeWords).map(word => negativeWords[word] || 0),
        backgroundColor: "red",
      },
    ],
  };

  return (
    <Container>
      <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
        <Tab label="Event Sentiment" />
        <Tab label="Activity Sentiment" />
        <Tab label="Priest Sentiment" />
      </Tabs>
      <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
        <h3>Comment Sentiments (Scatter Plot)</h3>
        <Scatter data={scatterData} options={{ responsive: true }} />
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
        <h3>Emoji Sentiments (Bar Chart)</h3>
        <Bar data={barData} options={{ responsive: true }} />
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
        <h3>Comment Sentiment Analysis (Stacked Bar Chart)</h3>
        <Bar data={stackedBarData} options={{ responsive: true, scales: { x: { stacked: true }, y: { stacked: true } } }} />
      </Box>
    </Container>
  );
};

export default SentimentResult;
