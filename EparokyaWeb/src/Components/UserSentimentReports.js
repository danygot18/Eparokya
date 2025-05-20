import React, { useEffect, useState } from "react";
import { Scatter, Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GuestSideBar from "./GuestSideBar";
import Loader from "./Layout/Loader";

const UserSentimentReports = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [eventSentiment, setEventSentiments] = useState([]);
  const [activitySentiment, setActivitySentiments] = useState([]);
  const [priestSentiment, setPriestSentiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentiments = async () => {
      try {
        const [eventRes, activityRes, priestRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API}/api/v1/getAllEventSentiment`),
          axios.get(`${process.env.REACT_APP_API}/api/v1/getAllActivitySentiment`),
          axios.get(`${process.env.REACT_APP_API}/api/v1/getAllPriestSentiment`)
        ]);
        setEventSentiments(eventRes.data);
        setActivitySentiments(activityRes.data);
        setPriestSentiments(priestRes.data);
      } catch (err) {
        console.error("Error fetching sentiments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSentiments();
  }, []);

  const sentiments = [eventSentiment, activitySentiment, priestSentiment][tabIndex] || [];

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
    datasets: [{
      label: "Emoji Frequency",
      data: Object.values(emojiCount),
      backgroundColor: "orange",
      borderColor: "black",
      borderWidth: 1,
    }],
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

  if (loading) return <Loader />;

  return (
    <Box display="flex">
      <GuestSideBar />
      <Container sx={{ mt: 3 }}>
        <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
          <Tab label="Event Sentiment" />
          <Tab label="Activity Sentiment" />
          <Tab label="Priest Sentiment" />
        </Tabs>

        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
          <h3>Comment Sentiments</h3>
          <Scatter data={scatterData} options={{ responsive: true }} />
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
          <h3>Emoji Sentiments</h3>
          <Bar data={barData} options={{ responsive: true }} />
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
          <h3>Comment Sentiment Analysis</h3>
          <Bar
            data={stackedBarData}
            options={{
              responsive: true,
              scales: { x: { stacked: true }, y: { stacked: true } }
            }}
          />
        </Box>

        <Box mt={4}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">See Comments</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {sentiments.map((sentiment, idx) => (
                <Box key={idx} mb={2}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {sentiment.name || "Anonymous"}:
                  </Typography>
                  <Typography>{sentiment.comment || "No comment provided."}</Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
    </Box>
  );
};

export default UserSentimentReports;
