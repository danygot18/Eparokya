import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import GuestSideBar from "../GuestSideBar";
import Metadata from "../Layout/MetaData";
import Loader from "../Layout/Loader";

import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today,
  ViewModule,
  ViewWeek,
  ViewDay,
  ViewAgenda,
} from "@mui/icons-material";

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        p: 2,
        backgroundColor: "background.paper",
        borderRadius: 1,
        boxShadow: 1,
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "success.main",
          minWidth: "200px",
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          display: "flex",

          order: { xs: 3, sm: 2 },
          width: { xs: "100%", sm: "auto" },
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        <IconButton
          onClick={() => onNavigate("PREV")}
          color="success"
          sx={{
            borderRadius: 1,
            padding: "4px",
            "&:hover": {
              backgroundColor: "success.light",
            },
          }}
        >
          <ChevronLeft />
        </IconButton>
        <Button
          variant="outlined"
          onClick={() => onNavigate("TODAY")}
          color="success"
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            color: "success.main",
            borderRadius: 1,
            padding: "4px 12px",
            minHeight: "32px",
            "&:hover": {
              backgroundColor: "success.light",
              borderColor: "success.main",
            },
          }}
        >
          Today
        </Button>
        <IconButton
          onClick={() => onNavigate("NEXT")}
          color="success"
          sx={{
            borderRadius: 1,
            padding: "4px",
            "&:hover": {
              backgroundColor: "success.light",
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",

          order: { xs: 2, sm: 3 },
          justifyContent: { xs: "center", sm: "flex-end" },
        }}
      >
        <IconButton
          onClick={() => onView("month")}
          color={view === "month" ? "success" : "default"}
          size="small"
          sx={{
            borderRadius: 1,
            padding: "4px",
            "&:hover": {
              backgroundColor: "success.light",
            },
          }}
        >
          {/* <ViewModule fontSize="small" /> */}
          Month
        </IconButton>
        <IconButton
          onClick={() => onView("week")}
          color={view === "week" ? "success" : "default"}
          size="small"
          sx={{
            borderRadius: 1,
            padding: "4px",
            "&:hover": {
              backgroundColor: "success.light",
            },
          }}
        >
          {/* <ViewWeek fontSize="small" /> */}
          Week
        </IconButton>
        <IconButton
          onClick={() => onView("day")}
          color={view === "day" ? "success" : "default"}
          size="small"
          sx={{
            borderRadius: 1,
            padding: "4px",
            "&:hover": {
              backgroundColor: "success.light",
            },
          }}
        >
          Day
        </IconButton>
        <IconButton
          onClick={() => onView("agenda")}
          color={view === "agenda" ? "success" : "default"}
          size="small"
          sx={{
            borderRadius: 1,
            padding: "4px",
            "&:hover": {
              backgroundColor: "success.light",
            },
          }}
        >
          Agenda
        </IconButton>
      </Box>
    </Box>
  );
};

const UserCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("month");

  const fetchAllEvents = useCallback(async () => {
    try {
      const [weddingEvents, baptismEvents, funeralEvents, customEvents] =
        await Promise.all([
          axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedWedding`),
          axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedBaptism`),
          axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedFuneral`),
          axios.get(`${process.env.REACT_APP_API}/api/v1/getAllCustomEvents`),
        ]);

      const formattedEvents = [
        ...weddingEvents.data.map((event) => ({
          id: `wedding-${event._id}`,
          title: `${event.brideName} & ${event.groomName} Wedding`,
          start: new Date(event.weddingDate),
          end: new Date(event.weddingDate),
          type: "Wedding",
          bride: event.brideName,
          groom: event.groomName,
        })),
        ...baptismEvents.data.map((event) => ({
          id: `baptism-${event._id}`,
          title: `Baptism of ${event.child.fullName || "Unknown"}`,
          start: new Date(event.baptismDate),
          end: new Date(event.baptismDate),
          type: "Baptism",
          child: event.child,
        })),
        ...funeralEvents.data.map((event) => ({
          id: `funeral-${event._id}`,
          title: `Funeral for ${event.name || ""}`,
          start: new Date(event.funeralDate),
          end: new Date(event.funeralDate),
          type: "Funeral",
          name: event.name,
        })),
        ...customEvents.data.map((event) => ({
          id: `custom-${event._id}`,
          title: event.title,
          start: new Date(event.customeventDate),
          end: new Date(event.customeventDate),
          type: "Custom",
        })),
      ];

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setErrorMessage("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const eventPropGetter = (event) => ({
    style: {
      backgroundColor:
        event.type === "Wedding"
          ? "#FFD700"
          : event.type === "Baptism"
          ? "#4CAF50"
          : event.type === "Funeral"
          ? "#F44336"
          : "#9C27B0",
      color: "white",
    },
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <GuestSideBar style={{ width: "20%", minWidth: "200px" }} />
      <Box sx={{ fontFamily: "Helvetica, sans-serif", flex: 1, p: 3 }}>
        <Metadata title="User Calendar" />
        <Typography
          variant="h4"
          sx={{ mb: 2, fontWeight: "bold", color: "success.main" }}
        >
          Church Events Calendar
        </Typography>

        {errorMessage && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <Paper elevation={3} sx={{ height: "700px", p: 2, borderRadius: 2 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            view={view}
            onView={setView}
            views={["month", "week", "day", "agenda"]}
            eventPropGetter={eventPropGetter}
            onSelectEvent={handleEventClick}
            components={{
              toolbar: CustomToolbar,
            }}
            style={{
              height: "100%",
              minHeight: "600px",
            }}
          />
        </Paper>

        {selectedEvent && (
          <Paper elevation={3} sx={{ mt: 3, p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Event Details
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography>
                <strong>Type:</strong> {selectedEvent.type}
              </Typography>
              {selectedEvent.type === "Wedding" && (
                <>
                  <Typography>
                    <strong>Bride:</strong> {selectedEvent.bride || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Groom:</strong> {selectedEvent.groom || "N/A"}
                  </Typography>
                </>
              )}
              {selectedEvent.type === "Baptism" && (
                <Typography>
                  <strong>Child:</strong>{" "}
                  {selectedEvent.child.fullName || "N/A"}
                </Typography>
              )}
              {selectedEvent.type === "Funeral" && (
                <Typography>
                  <strong>Name:</strong>{" "}
                  {selectedEvent.name
                    ? `${selectedEvent.name.firstName || ""} ${
                        selectedEvent.name.lastName || ""
                      }`
                    : "N/A"}
                </Typography>
              )}
              {selectedEvent.type === "Custom" && (
                <Typography>
                  <strong>Title:</strong> {selectedEvent.title || "N/A"}
                </Typography>
              )}
              <Typography>
                <strong>Date:</strong>{" "}
                {moment(selectedEvent.start).format("MMMM Do YYYY")}
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default UserCalendar;
