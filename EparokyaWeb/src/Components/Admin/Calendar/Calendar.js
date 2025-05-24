import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import MetaData from '../../Layout/MetaData';
import SideBar from '../SideBar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import { Box, Typography, Paper, Button, IconButton, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight, Today, ViewModule, ViewWeek, ViewDay, ViewAgenda } from '@mui/icons-material';

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

const Calendars = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [view, setView] = useState('month');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const config = { withCredentials: true };

  const fetchAllEvents = useCallback(async () => {
    try {
      setLoading(true);
      const [weddingEvents, baptismEvents, funeralEvents, customEvents] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedWedding`, config),
        axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedBaptism`, config),
        axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedFuneral`, config),
        axios.get(`${process.env.REACT_APP_API}/api/v1/getAllCustomEvents`, config),
      ]);

      const formattedEvents = [
        ...weddingEvents.data.map((event) => ({
          id: `wedding-${event._id}`,
          title: `${event.bride} & ${event.groom} Wedding`,
          start: new Date(event.weddingDate),
          end: new Date(event.weddingDate),
          type: 'Wedding',
          bride: event.bride,
          groom: event.groom,
          weddingDate: event.weddingDate
        })),
        ...baptismEvents.data.map((event) => ({
          id: `baptism-${event._id}`,
          title: `Baptism of ${event.child.fullName || "Unknown"}`,
          start: new Date(event.baptismDate),
          end: new Date(event.baptismDate),
          type: 'Baptism',
          child: event.child,
          baptismDate: event.baptismDate
        })),
        ...funeralEvents.data.map((event) => ({
          id: `funeral-${event._id}`,
          title: `Funeral for ${event.name || ""} `,
          start: new Date(event.funeralDate),
          end: new Date(event.funeralDate),
          type: 'Funeral',
          name: event.name,
          funeralDate: event.funeralDate
        })),
        ...customEvents.data.map((event) => ({
          id: `custom-${event._id}`,
          title: event.title,
          start: new Date(event.customeventDate),
          end: new Date(event.customeventDate),
          type: 'Custom',
          customeventDate: event.customeventDate
        })),
      ];

      if (location.state && location.state.newEvent) {
        const newEvent = location.state.newEvent;
        formattedEvents.push({
          id: `custom-new-${newEvent.title}`,
          title: newEvent.title,
          start: new Date(newEvent.customeventDate),
          end: new Date(newEvent.customeventDate),
          type: 'Custom',
          customeventDate: newEvent.customeventDate
        });
      }

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setErrorMessage('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [config, location.state]);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    const eventId = event.id.split('-')[1];
    fetchEventDetails(eventId, event.type);
  };

  const fetchEventDetails = async (id, type) => {
    const apiMapping = {
      Wedding: `getWeddingById/${id}`,
      Baptism: `getBaptism/${id}`,
      Funeral: `getFuneral/${id}`,
      Custom: `getCustomEventById/${id}`, 
    };

    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/${apiMapping[type]}`, config);
      setSelectedEvent({ ...response.data, type });
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
      setErrorMessage(`Failed to fetch details for ${type}.`);
    }
  };

  const eventPropGetter = (event) => ({
    style: {
      backgroundColor:
        event.type === 'Wedding' ? '#FFD700' :
        event.type === 'Baptism' ? '#4CAF50' :
        event.type === 'Funeral' ? '#F44336' : '#9C27B0',
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
      height: '100vh',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      <SideBar />
      
      <Box sx={{ 
        fontFamily: 'Helvetica, sans-serif', 
        flex: 1, 
        p: isMobile ? 2 : 3,
        overflow: 'auto'
      }}>
        <MetaData title="Calendar" />
        <Typography variant="h4" sx={{ 
          mb: 2, 
          fontWeight: 'bold', 
          color: 'success.main',
          fontSize: isMobile ? '1.5rem' : '2rem'
        }}>
          Church Events Calendar
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
            views={["month", "week", "day", "agenda"]}
            eventPropGetter={eventPropGetter}
            onSelectEvent={handleEventClick}
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
              Event Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Type:</strong> {selectedEvent.type}
              </Typography>
              {selectedEvent.type === 'Wedding' && (
                <>
                  <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <strong>Bride:</strong> {selectedEvent.bride || 'N/A'}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <strong>Groom:</strong> {selectedEvent.groom || 'N/A'}
                  </Typography>
                </>
              )}
              {selectedEvent.type === 'Baptism' && (
                <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  <strong>Child:</strong> {selectedEvent.child?.fullName || 'N/A'}
                </Typography>
              )}
              {selectedEvent.type === 'Funeral' && (
                <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  <strong>Name:</strong> {selectedEvent.name ? `${selectedEvent.name.firstName || ''} ${selectedEvent.name.lastName || ''}` : 'N/A'}
                </Typography>
              )}
              {selectedEvent.type === 'Custom' && (
                <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  <strong>Title:</strong> {selectedEvent.title || 'N/A'}
                </Typography>
              )}
              <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Date:</strong> {moment(
                  selectedEvent.weddingDate || 
                  selectedEvent.baptismDate || 
                  selectedEvent.funeralDate || 
                  selectedEvent.customeventDate
                ).format('MMMM Do YYYY')}
              </Typography>
            </Box>
          </Paper>
        )}

        <Button
          variant='contained'
          color='success'
          sx={{ mt: 3 }}
          onClick={() => navigate('/admin/addEvent')}
        >
          Add Event
        </Button>
      </Box>
    </Box>
  );
};

export default Calendars;