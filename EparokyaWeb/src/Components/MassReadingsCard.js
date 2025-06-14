import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress,
  Divider,
  IconButton,
  Collapse
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const ExpandButton = styled(IconButton)({
  marginLeft: "auto",
  transition: "transform 0.3s",
});

const formatDate = (date) =>
  date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getSunday = (offsetWeeks = 0) => {
  const date = new Date();
  const day = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() + (((7 - day) % 7) + offsetWeeks * 7));
  return sunday;
};

const MassReadingsCard = () => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({
    current: true,
    upcoming: false
  });

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllreadings`);
        setReadings(response.data.readings || []);
      } catch (err) {
        setError("Failed to load mass readings. Please try again later.");
        console.error("Error fetching readings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  const toggleExpand = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const thisSunday = getSunday();
  const nextSunday = getSunday(1);

  const findReading = (date) =>
    readings.find(
      (r) => new Date(r.date).toDateString() === date.toDateString()
    );

  const renderReading = (reading) => (
    <>
      {reading.Title && (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1.5, color: "primary.main" }}>
            {reading.Title}
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </>
      )}
      
      {reading.firstReading && (
        <>
          <Typography variant="overline" sx={{ display: "block", color: "text.secondary" }}>
            First Reading
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 2.5 }}>
            {reading.firstReading}
          </Typography>
        </>
      )}
      
      {reading.responsorialPsalm && (
        <>
          <Typography variant="overline" sx={{ display: "block", color: "text.secondary" }}>
            Responsorial Psalm
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 2.5 }}>
            {reading.responsorialPsalm}
          </Typography>
        </>
      )}
      
      {reading.response && (
        <>
          <Typography variant="overline" sx={{ display: "block", color: "text.secondary" }}>
            Response
          </Typography>
          <Typography variant="body1" sx={{ 
            whiteSpace: "pre-line", 
            mb: 2.5,
            fontStyle: "italic",
            color: "secondary.main"
          }}>
            {reading.response}
          </Typography>
        </>
      )}
      
      {reading.secondReading && (
        <>
          <Typography variant="overline" sx={{ display: "block", color: "text.secondary" }}>
            Second Reading
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 2.5 }}>
            {reading.secondReading}
          </Typography>
        </>
      )}
      
      {reading.gospel && (
        <>
          <Typography variant="overline" sx={{ display: "block", color: "text.secondary" }}>
            Gospel
          </Typography>
          <Typography variant="body1" sx={{ 
            whiteSpace: "pre-line",
            fontStyle: "italic",
            fontWeight: 500
          }}>
            {reading.gospel}
          </Typography>
        </>
      )}
    </>
  );

  const currentReading = findReading(thisSunday);
  const upcomingReading = findReading(nextSunday);

  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        minHeight: 200
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minWidth: 320, 
        maxWidth: 400, 
        p: 2,
        textAlign: "center",
        color: "error.main"
      }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

return (
  <Box sx={{ width: "100%", px: 2 }}>
    {[{ date: thisSunday, reading: currentReading, color: "primary" }, { date: nextSunday, reading: upcomingReading, color: "secondary" }]
      .map(({ date, reading, color }, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{
            mb: 3,
            borderRadius: 3,
            p: 2,
            maxWidth: 520, 
            textAlign: "left", 
            mx: "auto" 
          }}
        >
          {/* Date heading */}
          <Typography
            variant="subtitle1"
            sx={{
              color: `${color}.main`,
              fontWeight: 600,
              mb: 1,
              textAlign: "center"
            }}
          >
            {formatDate(date)} Mass Readings
          </Typography>

          {reading ? (
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 3 }}>
                {reading.Title}
              </Typography>

              <Typography variant="body2" sx={{ whiteSpace: "pre-line", mb: 2 }}>
                {reading.firstReading}
              </Typography>

              <Typography variant="body2" sx={{ whiteSpace: "pre-line", mb: 3 }}>
                {reading.responsorialPsalm}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-line",
                  mb: 4,
                  fontStyle: "italic",
                  color: "secondary.main"
                }}
              >
                {reading.response}
              </Typography>

              {reading.secondReading && (
                <Typography variant="body2" sx={{ whiteSpace: "pre-line", mb: 2 }}>
                  {reading.secondReading}
                </Typography>
              )}

              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-line",
                  fontStyle: "italic",
                  fontWeight: 500
                }}
              >
                {reading.gospel}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No readings found.
            </Typography>
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 4, display: "block" }}
          >
            Source:{" "}
            <a
              href="https://www.awitatpapuri.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#666", textDecoration: "none" }}
            >
              Awit at Papuri
            </a>
          </Typography>
        </Card>
      ))}
  </Box>
);



};

export default MassReadingsCard;