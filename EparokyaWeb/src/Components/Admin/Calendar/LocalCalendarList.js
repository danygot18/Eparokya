// src/components/Calendar/LocalCalendarList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import moment from "moment";

const LocalCalendarList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchCustomEvents = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getAllCustomEvents`
        );
        setEvents(res.data || []);
      } catch (error) {
        console.error("Failed to fetch local events", error);
      }
    };

    fetchCustomEvents();
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        maxHeight: "600px",
        overflowY: "auto",
        minWidth: "300px",
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
        Local Church Events
      </Typography>
      <List dense>
        {events.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No events found.
          </Typography>
        ) : (
          events.map((event) => (
            <Box key={event._id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={event.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {moment(event.customeventDate).format("MMMM Do YYYY")}
                        {event.customeventTime ? ` at ${event.customeventTime}` : ""}
                      </Typography>
                      {event.description && (
                        <Typography variant="body2" color="text.secondary">
                          {event.description}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </Box>
          ))
        )}
      </List>
    </Paper>
  );
};

export default LocalCalendarList;
