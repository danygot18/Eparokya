import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";

const tabOptions = ["Activity", "Event", "Priest"];

const SubmittedFeedback = () => {
  const [tabValue, setTabValue] = useState(0);
  const [sentiments, setSentiments] = useState([]);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

useEffect(() => {
  const fetchSentiments = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/mySubmittedEventSentiments`,
        { withCredentials: true }
      );
      console.log("Fetched sentiments:", data);
      data.sentiments.forEach((item) => {
        console.log("Type:", item.eventTypeId?.name);
      });
      setSentiments(data.sentiments || []);
    } catch (error) {
      console.error("Failed to fetch sentiments", error);
    }
  };

  fetchSentiments();
}, []);




  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

//   const filterCategory = (category) => {
//     if (category === "Activity") {
//       return sentiments.filter((item) =>
//         item.eventTypeId?.name?.toLowerCase().includes("activity")
//       );
//     }
//     if (category === "Event") {
//       return sentiments.filter((item) =>
//         item.eventTypeId?.name?.toLowerCase().includes("event")
//       );
//     }
//     if (category === "Priest") {
//       return sentiments.filter((item) =>
//         item.eventTypeId?.name?.toLowerCase().includes("priest")
//       );
//     }
//     return sentiments;
//   };


const filterCategory = (category) => {
  const lowerCategory = category.toLowerCase();

  return sentiments.filter((item) => {
    const typeName = item?.eventTypeId?.name?.toLowerCase() || "";
    return typeName.includes(lowerCategory);
  });
};

//   const displayedFeedback = filterCategory(tabOptions[tabValue]);

const displayedFeedback = sentiments;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        My Submitted Feedback
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        sx={{ mb: 3 }}
        textColor="primary"
        indicatorColor="primary"
      >
        {tabOptions.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      <Stack spacing={3}>
        {displayedFeedback.length > 0 ? (
          displayedFeedback.map((item, index) => (
            <Card key={item._id || index} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Feedback for: {item?.eventTypeId?.name || "Unknown"}
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  Overall Sentiment:{" "}
                  <Chip label={item.overallSentiment} color="primary" size="small" />
                  &nbsp;Confidence: {Math.round(item.confidence * 100)}%
                </Typography>

                <Divider sx={{ my: 2 }} />

                {item.responses?.map((resp, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Typography fontWeight={500}>
                      Q{idx + 1}: {resp.question}
                    </Typography>
                    <Typography variant="body2">Emoji: {resp.emoji}</Typography>
                    <Typography variant="body2">
                      Score: {resp.sentimentResult.score}, Comparative:{" "}
                      {resp.sentimentResult.comparative}, Magnitude:{" "}
                      {resp.sentimentResult.magnitude}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Positive: {resp.sentimentResult.positive.join(", ") || "None"} | Negative:{" "}
                      {resp.sentimentResult.negative.join(", ") || "None"}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography fontWeight={500}>Comment:</Typography>
                 <Typography variant="body2" mb={1}>
  "{item.commentSentiment?.comment || 'No comment provided'}"
</Typography>


                  <Typography variant="body2">
                    Rating: <strong>{item.commentSentiment.label}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Score: {item.commentSentiment.score}, Comparative:{" "}
                    {item.commentSentiment.comparative}, Magnitude:{" "}
                    {item.commentSentiment.magnitude}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Positive Words: {item.commentSentiment.positive?.join(", ") || "None"} | Negative Words:{" "}
                    {item.commentSentiment.negative?.join(", ") || "None"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No feedback submitted under this category.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default SubmittedFeedback;
