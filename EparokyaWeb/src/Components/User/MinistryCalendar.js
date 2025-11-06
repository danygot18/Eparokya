import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import GuestSideBar from '../GuestSideBar';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { ChevronLeft, ChevronRight, ArrowDropDown } from '@mui/icons-material';

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate, onView, view }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'stretch', sm: 'center' },
      mb: 2,
      p: 2,
      backgroundColor: 'background.paper',
      borderRadius: 1,
      boxShadow: 1,
      gap: 1,
    }}
  >
    <Typography
      variant="h6"
      sx={{ fontWeight: 'bold', color: 'success.main', textAlign: { xs: 'center', sm: 'left' } }}
    >
      {label}
    </Typography>

    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
      <IconButton onClick={() => onNavigate('PREV')} color="success">
        <ChevronLeft />
      </IconButton>
      <Button onClick={() => onNavigate('TODAY')} color="success" variant="outlined" size="small">
        Today
      </Button>
      <IconButton onClick={() => onNavigate('NEXT')} color="success">
        <ChevronRight />
      </IconButton>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0.5 }}>
      {['month', 'week', 'day', 'agenda'].map((v) => (
        <Button
          key={v}
          onClick={() => onView(v)}
          variant={view === v ? 'contained' : 'outlined'}
          color="success"
          size="small"
          sx={{ textTransform: 'capitalize' }}
        >
          {v}
        </Button>
      ))}
    </Box>
  </Box>
);

const MinistryCalendar = () => {
  const [ministries, setMinistries] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarTitle, setCalendarTitle] = useState('General Calendar');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month');
  const [anchorEl, setAnchorEl] = useState(null);

  const isMobile = useMediaQuery('(max-width: 768px)');

  // === KEEPING YOUR ORIGINAL FETCH LOGIC ===
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

        const eventsArray = response.data?.data || [];

        const formattedEvents = eventsArray.map((event) => ({
          ...event,
          start: new Date(event.customeventDate),
          end: new Date(event.customeventDate),
          title: event.title,
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching general events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMinistries();
    fetchGeneralEvents();
    console.log(fetchGeneralEvents());
  }, []);

  const handleMinistryClick = async (ministry) => {
    setSelectedMinistry(ministry);
    setCalendarTitle(`${ministry.name} Calendar`);
    setAnchorEl(null);
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
      }));
      setEvents(formattedEvents);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event) => setSelectedEvent(event);

  const eventPropGetter = () => ({
    style: {
      backgroundColor: '#388e3c',
      color: 'white',
      borderRadius: '4px',
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
      }}
    >
      {!isMobile && <GuestSideBar />}

      <Box
        sx={{
          flex: 1,
          p: isMobile ? 1.5 : 3,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f7f7f7',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: 'success.main',
            mb: 2,
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          {calendarTitle}
        </Typography>

        {isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button
              variant="contained"
              color="success"
              endIcon={<ArrowDropDown />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              {selectedMinistry ? selectedMinistry.name : 'Select Ministry'}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              {ministries.map((ministry) => (
                <MenuItem key={ministry._id} onClick={() => handleMinistryClick(ministry)}>
                  {ministry.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}

        <Paper
          elevation={3}
          sx={{
            p: isMobile ? 1 : 2,
            borderRadius: 2,
            mb: 2,
            backgroundColor: '#fff',
          }}
        >
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
              views={['month', 'week', 'day', 'agenda']}
              eventPropGetter={eventPropGetter}
              onSelectEvent={handleEventClick}
              components={{ toolbar: CustomToolbar }}
              style={{ height: isMobile ? 400 : 600 }}
            />
          )}
        </Paper>

        {/* ✅ Event Details Section */}
        {selectedEvent && (
          <Paper
            elevation={2}
            sx={{
              mt: 2,
              p: isMobile ? 1.5 : 2.5,
              borderRadius: 2,
              backgroundColor: '#f9fbe7',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.dark', mb: 1 }}>
              Event Details
            </Typography>
            <Typography>
              <strong>Ministry:</strong> {selectedMinistry ? selectedMinistry.name : 'General'}
            </Typography>
            <Typography>
              <strong>Event Title:</strong> {selectedEvent.title}
            </Typography>
            <Typography>
              <strong>Event Description:</strong>{' '}
              {selectedEvent.description || 'No description provided.'}
            </Typography>
            <Typography>
              <strong>Event Date:</strong>{' '}
              {moment(selectedEvent.customeventDate).format('MMMM D, YYYY')}
            </Typography>
            {selectedEvent.customeventTime && (
              <Typography>
                <strong>Event Time:</strong>{' '}
                {moment(selectedEvent.customeventTime, 'h:mm A').format('h:mm A')}
              </Typography>
            )}
          </Paper>
        )}
      </Box>

      {!isMobile && (
        <Box
          sx={{
            flex: '0 0 220px',
            p: 2,
            borderLeft: '1px solid #e0e0e0',
            backgroundColor: '#fff',
            minHeight: '100vh',
          }}
        >
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
                  backgroundColor:
                    selectedMinistry && selectedMinistry._id === ministry._id
                      ? 'success.light'
                      : 'transparent',
                  color:
                    selectedMinistry && selectedMinistry._id === ministry._id
                      ? 'success.dark'
                      : 'text.primary',
                  fontWeight:
                    selectedMinistry && selectedMinistry._id === ministry._id
                      ? 'bold'
                      : 'normal',
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
