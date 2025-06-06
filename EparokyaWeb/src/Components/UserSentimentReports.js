import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import {
  Container,
  Tabs,
  Tab,
  Box
} from "@mui/material";
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

  const emojiCount = {};
  sentiments.forEach(sentiment => {
    sentiment.responses.forEach(response => {
      if (response.emoji) {
        emojiCount[response.emoji] = (emojiCount[response.emoji] || 0) + 1;
      }
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
          <h3>Emoji Sentiments</h3>
          <Bar data={barData} options={{ responsive: true }} />
        </Box>
      </Container>
    </Box>
  );
};

export default UserSentimentReports;
