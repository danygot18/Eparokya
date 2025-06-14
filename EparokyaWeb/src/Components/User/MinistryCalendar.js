import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import GuestSideBar from '../GuestSideBar';
import { Box, Typography, Paper, Button, IconButton, CircularProgress, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight, Today } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const localizer = momentLocalizer(moment);

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
        color: 'success.main',
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
          color="success"
          size={isMobile ? 'medium' : 'small'}
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
          onClick={() => onNavigate('TODAY')}
          color='success'
          size={isMobile ? 'medium' : 'small'}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            color: "success.main",
            borderRadius: 1,
            padding: isMobile ? '6px 16px' : '4px 12px',
            minHeight: isMobile ? '40px' : '32px',
            '&:hover': {
              backgroundColor: 'success.light',
              borderColor: 'success.main',
            }
          }}
        >
          Today
        </Button>
        <IconButton
          onClick={() => onNavigate("NEXT")}
          color="success"
          size={isMobile ? 'medium' : 'small'}
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

      <Box sx={{
        display: 'flex',
        order: isMobile ? 1 : 2,
        width: isMobile ? '100%' : 'auto',
        justifyContent: 'center',
        gap: isMobile ? 1 : 0.5,
        mb: isMobile ? 1 : 0
      }}>
        {['month', 'week', 'day', 'agenda'].map(v => (
          <Button
            key={v}
            onClick={() => onView(v)}
            variant={view === v ? 'contained' : 'outlined'}
            color="success"
            size={isMobile ? 'small' : 'small'}
            sx={{
              textTransform: 'capitalize',
              minWidth: isMobile ? '60px' : 'auto',
              padding: isMobile ? '6px 8px' : '4px 8px',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              '&:hover': {
                backgroundColor: 'success.light',
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

const MinistryCalendar = () => {
  const [ministries, setMinistries] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarTitle, setCalendarTitle] = useState('General Calendar');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`,
          { withCredentials: true }
        );
        setMinistries(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching ministries:', error);
      }
    };

    const fetchGeneralEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryEvents`,
          { withCredentials: true }
        );
        const formattedEvents = response.data.map((event) => ({
          ...event,
          start: new Date(event.customeventDate),
          end: new Date(event.customeventDate),
          title: event.title,
          customeventTime: event.customeventTime || null,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMinistries();
    fetchGeneralEvents();
  }, []);

  const handleMinistryClick = async (ministry) => {
    setSelectedMinistry(ministry);
    setCalendarTitle(`${ministry.name} Calendar`);
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/ministryCategory/ministryEvents/${ministry._id}`,
        { withCredentials: true }
      );
      const formattedEvents = response.data.map((event) => ({
        ...event,
        start: new Date(event.customeventDate),
        end: new Date(event.customeventDate),
        title: event.title,
        customeventTime: event.customeventTime || null,
      }));
      setEvents(formattedEvents);
      console.log(formattedEvents)
    } catch (error) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: '#388e3c',
      color: 'white',
      borderRadius: '4px',
      border: 'none',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontSize: isMobile ? '0.7rem' : '0.8rem',
      padding: isMobile ? '1px 3px' : '2px 5px'
    },
  });

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      minHeight: '100vh',
      backgroundColor: '#f7f7f7'
    }}>
      {/* Left Column: GuestSideBar */}
      {!isMobile && (
        <Box sx={{ flex: '0 0 220px', backgroundColor: '#fff', borderRight: '1px solid #e0e0e0', minHeight: '100vh' }}>
          <GuestSideBar />
        </Box>
      )}

      {/* Center Column: Calendar Display */}
      <Box sx={{
        flex: 1,
        p: isMobile ? 1 : 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#f7f7f7'
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 'bold',
          color: 'success.main',
          mb: 2,
          fontSize: isMobile ? '1.3rem' : '2rem',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          {calendarTitle}
        </Typography>
        <Paper elevation={3} sx={{
          p: isMobile ? 1 : 2,
          borderRadius: 2,
          mb: 2,
          minHeight: isMobile ? '350px' : '500px',
          backgroundColor: '#fff'
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
              <CircularProgress color="success" />
            </Box>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView={isMobile ? 'agenda' : 'month'}
              view={view}
              onView={setView}
              views={["month", "week", "day", "agenda"]}
              eventPropGetter={eventPropGetter}
              onSelectEvent={handleEventClick}
              components={{
                toolbar: CustomToolbar,
              }}
              style={{
                height: isMobile ? 350 : 500,
                minHeight: isMobile ? 300 : 400,
                backgroundColor: '#fff'
              }}
            />
          )}
        </Paper>
        {/* Event Details Display */}
        {selectedEvent && (
          <Paper elevation={2} sx={{
            mt: 2,
            p: isMobile ? 1.5 : 2.5,
            borderRadius: 2,
            backgroundColor: '#f9fbe7'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.dark', mb: 1 }}>
              Event Details
            </Typography>
            <Typography><strong>Ministry:</strong> {selectedMinistry ? selectedMinistry.name : 'General'}</Typography>
            <Typography><strong>Event Title:</strong> {selectedEvent.title}</Typography>
            <Typography><strong>Event Description:</strong> {selectedEvent.description || 'No description provided.'}</Typography>
            <Typography><strong>Event Date:</strong> {moment(selectedEvent.customeventDate).format('MMMM D, YYYY')}</Typography>
            {selectedEvent.customeventTime && (
              <Typography><strong>Event Time:</strong> {moment(selectedEvent.customeventTime, 'h:mm A').format('h:mm A')}</Typography>
            )}
          </Paper>
        )}
      </Box>

      {/* Right Column: Ministry List */}
      {!isMobile && (
        <Box sx={{
          flex: '0 0 220px',
          p: 2,
          borderLeft: '1px solid #e0e0e0',
          backgroundColor: '#fff',
          minHeight: '100vh'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main', mb: 2 }}>
            Ministries
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {ministries.map((ministry) => (
              <Box
                component="li"
                key={ministry._id}
                onClick={() => handleMinistryClick(ministry)}
                sx={{
                  cursor: 'pointer',
                  p: 1.2,
                  mb: 1,
                  borderRadius: 1,
                  backgroundColor: selectedMinistry && selectedMinistry._id === ministry._id ? 'success.light' : 'transparent',
                  color: selectedMinistry && selectedMinistry._id === ministry._id ? 'success.dark' : 'text.primary',
                  fontWeight: selectedMinistry && selectedMinistry._id === ministry._id ? 'bold' : 'normal',
                  transition: 'background 0.2s',
                  '&:hover': {
                    backgroundColor: 'success.lighter',
                  }
                }}
              >
                {ministry.name}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MinistryCalendar;