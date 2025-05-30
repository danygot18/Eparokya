import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Box } from "@mui/material";

const formatDate = (date) =>
  date.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });

const getSunday = (offsetWeeks = 0) => {
  const date = new Date();
  const day = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() + ((7 - day) % 7 + offsetWeeks * 7));
  return sunday;
};

const MassReadingsCard = () => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/api/v1/getAllreadings`)
      .then((res) => setReadings(res.data.readings || []))
      .catch(() => setReadings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  const thisSunday = getSunday();
  const nextSunday = getSunday(1);

  const findReading = (date) =>
    readings.find((r) => new Date(r.date).toDateString() === date.toDateString());

  const renderReading = (reading) => (
    <>
      <Typography variant="body2" sx={{ whiteSpace: "pre-line", mb: 1 }}>
         {reading.firstReading}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: "pre-line", mb: 1 }}>
        {reading.responsorialPsalm}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: "pre-line", mb: 1 }}>
         {reading.response}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: "pre-line", mb: 1 }}>
        {reading.secondReading}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
        {reading.gospel}
      </Typography>
    </>
  );

  const currentReading = findReading(thisSunday);
  const upcomingReading = findReading(nextSunday);

  return (
    <Box sx={{ minWidth: 320, maxWidth: 400, marginLeft: 2 }}>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            Sunday ({formatDate(thisSunday)}) Mass Readings
          </Typography>
          {currentReading ? (
            renderReading(currentReading)
          ) : (
            <Typography>No readings found for this Sunday.</Typography>
          )}
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" color="secondary" gutterBottom>
            Upcoming Sunday ({formatDate(nextSunday)}) Mass Readings
          </Typography>
          {upcomingReading ? (
            renderReading(upcomingReading)
          ) : (
            <Typography>No readings found for next Sunday.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default MassReadingsCard;
