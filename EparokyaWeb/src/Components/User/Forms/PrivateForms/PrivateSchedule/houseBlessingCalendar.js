import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTheme, useMediaQuery } from '@mui/material';
import { CircularProgress, Box, Typography, Paper, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const localizer = momentLocalizer(moment);

const config = {
  withCredentials: true,
}

const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      mb: 2,
      p: 2,
      backgroundColor: 'background.paper',
      borderRadius: 1,
      boxShadow: 1,
      gap: isMobile ? 1 : 2
    }}>
      <Typography variant="h6" sx={{
        fontWeight: 'bold',
        color: 'primary.main',
        minWidth: isMobile ? '100%' : '200px',
        mb: isMobile ? 1 : 0,
        textAlign: isMobile ? 'center' : 'left'
      }}>
        {label}
      </Typography>

      <Box sx={{
        display: 'flex',
        order: isMobile ? 2 : 1,
        width: isMobile ? '100%' : 'auto',
        justifyContent: 'center',
        gap: 1
      }}>
        <IconButton
          onClick={() => onNavigate("PREV")}
          color="primary"
          size={isMobile ? 'medium' : 'small'}
          sx={{
            borderRadius: 1,
            padding: "4px",
            "&:hover": {
              backgroundColor: "primary.light",
            },
          }}
        >
          <ChevronLeft />
        </IconButton>
        <Button
          variant="outlined"
          onClick={() => onNavigate('TODAY')}
          color='primary'
          size={isMobile ? 'medium' : 'small'}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            color: "primary.main",
            borderRadius: 1,
            padding: isMobile ? '6px 16px' : '4px 12px',
            minHeight: isMobile ? '40px' : '32px',
            '&:hover': {
              backgroundColor: 'primary.light',
              borderColor: 'primary.main',
            }
          }}
        >
          Today
        </Button>
        <IconButton
          onClick={() => onNavigate("NEXT")}
          color="primary"
          size={isMobile ? 'medium' : 'small'}
          sx={{
            borderRadius: 1,
            padding: "4px",
            "&:hover": {
              backgroundColor: "primary.light",
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      <Box sx={{
        display: 'flex',
        order: isMobile ? 1 : 2,
        width: isMobile ? '100%' : 'auto',
        justifyContent: 'center',
        gap: isMobile ? 1 : 0.5,
        mb: isMobile ? 1 : 0
      }}>
        {['month', 'agenda'].map(v => (
          <Button
            key={v}
            onClick={() => onView(v)}
            variant={view === v ? 'contained' : 'outlined'}
            color="primary"
            size={isMobile ? 'small' : 'small'}
            sx={{
              textTransform: 'capitalize',
              minWidth: isMobile ? '60px' : 'auto',
              padding: isMobile ? '6px 8px' : '4px 8px',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              '&:hover': {
                backgroundColor: 'primary.light',
              }
            }}
          >
            {v}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

const HouseBlessingCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [view, setView] = useState('month');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchHouseBlessings = useCallback(async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/houseBlessing/getConfirmedHouseBlessing`, config);
      const formatted = data.map(event => {
        let start = moment(event.blessingDate).toDate();
        if (event.blessingTime) {
          const time = moment(event.blessingTime, ["h:mmA", "h:mm A", "HH:mm"]);
          if (time.isValid()) {
            start.setHours(time.hours());
            start.setMinutes(time.minutes());
          }
        }
        let end = new Date(start);
        end.setHours(start.getHours() + 1);

        return {
          id: event._id,
          title: `${event.fullName || "Unknown"} House Blessing`,
          start,
          end,
          fullName: event.fullName || "N/A",
          contactNumber: event.contactNumber || "N/A",
          address: event.address,
          blessingTime: event.blessingTime || "N/A",
          blessingStatus: event.blessingStatus || "N/A",
          comments: event.comments || [],
          confirmedAt: event.confirmedAt,
        };
      });
      setEvents(formatted);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load house blessings:', err);
      setErrorMessage("Failed to load house blessings. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHouseBlessings();
  }, [fetchHouseBlessings]);

  const eventPropGetter = () => ({
    style: {
      backgroundColor: '#90caf9',
      color: 'black',
      borderRadius: '4px',
      border: 'none',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontSize: isMobile ? '0.7rem' : '0.8rem',
      padding: isMobile ? '1px 3px' : '2px 5px'
    },
  });

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      <Box sx={{
        fontFamily: 'Helvetica, sans-serif',
        flex: 1,
        p: isMobile ? 2 : 3,
        // overflow: 'auto'
      }}>

        <Typography variant="h4" sx={{
          mb: 2,
          fontWeight: 'bold',
          color: 'primary.main',
          fontSize: isMobile ? '1.5rem' : '2rem'
        }}>
          House Blessing Calendar
        </Typography>
        <Typography sx={{ mb: 2 }}>
          See the available dates for house blessings. If you have any questions, please contact the parish office.
          (Mondays not available)
        </Typography>

        {errorMessage && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <Paper elevation={3} sx={{
          height: isMobile ? '500px' : '700px',
          p: isMobile ? 1 : 2,
          borderRadius: 2
        }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView={isMobile ? 'agenda' : 'month'}
            view={view}
            onView={setView}
            views={["month", "agenda"]}
            eventPropGetter={eventPropGetter}
            onSelectEvent={setSelectedEvent}
            components={{
              toolbar: CustomToolbar,
            }}
            style={{
              height: '100%',
              minHeight: isMobile ? '400px' : '600px'
            }}
          />
        </Paper>

        {selectedEvent && (
          <Paper elevation={3} sx={{
            mt: 3,
            p: isMobile ? 2 : 3,
            borderRadius: 2
          }}>
            <Typography variant="h6" sx={{
              mb: 2,
              fontWeight: 'bold',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              House Blessing Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Name:</strong> {selectedEvent.fullName}
              </Typography>
              <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Contact:</strong> {selectedEvent.contactNumber}
              </Typography>
              <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Date:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY')}
              </Typography>
              <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Time:</strong> {selectedEvent.blessingTime}
              </Typography>
              <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Status:</strong> {selectedEvent.blessingStatus}
              </Typography>
              <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Address:</strong> {Object.values(selectedEvent.address || {}).filter(Boolean).join(', ')}
              </Typography>
              {selectedEvent.comments && selectedEvent.comments.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <strong>Comments:</strong>
                  {selectedEvent.comments.map((c, idx) => (
                    <Typography key={idx} sx={{ fontSize: isMobile ? '0.85rem' : '0.95rem', ml: 1 }}>
                      - {c.selectedComment} {c.additionalComment ? `(${c.additionalComment})` : ""}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default HouseBlessingCalendar;