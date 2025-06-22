import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import MetaData from '../../Layout/MetaData';
import SideBar from '../SideBar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Today, ViewModule, ViewWeek, ViewDay, ViewAgenda } from '@mui/icons-material';
import { ArrowBack, ArrowForward } from "@mui/icons-material";

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
  // const [liturgical, setLiturgicalData] = useState({ today: null, tomorrow: null, upcoming: [] });
  const [liturgical, setLiturgical] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const config = { withCredentials: true };

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setLoading(true);
        const [weddingEvents, baptismEvents, funeralEvents, customEvents, liturgicalRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedWedding`, config),
          axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedBaptism`, config),
          axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedFuneral`, config),
          axios.get(`${process.env.REACT_APP_API}/api/v1/getAllCustomEvents`, config),
          axios.get(`${process.env.REACT_APP_API}/api/v1/liturgical/year/${new Date().getFullYear()}`),
        ]);

        const liturgicalEvents = liturgicalRes.data.map(item => ({
          id: `liturgical-${item.event_key}-${item.date}`,
          title: item.name,
          start: new Date(item.date * 1000),
          end: new Date(item.date * 1000),
          type: 'Liturgical',
        }));

        const formattedEvents = [
          ...weddingEvents.data.map((event) => ({
            id: `wedding-${event._id}`,
            title: `${event.bride} & ${event.groom} Wedding`,
            start: new Date(event.weddingDate),
            end: new Date(event.weddingDate),
            type: 'Wedding',
            brideName: event.bride,
            groomName: event.groom,
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
            title: `Funeral for ${event.name?.firstName || ""} ${event.name?.lastName || ""}`,
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
          ...liturgicalEvents,
        ];

        if (location.state?.newEvent) {
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
    };

    fetchAllEvents();
  }, []);



  useEffect(() => {
    const fetchLiturgicalYear = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/liturgical/year/${year}`);
        setLiturgical(res.data);
      } catch (err) {
        console.error("Liturgical fetch error", err);
      }
    };

    fetchLiturgicalYear();
  }, [year]);


  useEffect(() => {
    // console.log("Updated liturgical data:", liturgical);
  }, [liturgical]);

  const groupedByMonth = liturgical.reduce((acc, item) => {
    const month = new Date(item.date * 1000).toLocaleString('default', { month: 'long' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(item);
    return acc;
  }, {});


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

  const eventPropGetter = (event) => {
    let backgroundColor = '#3174ad'; // default
    if (event.type === 'Liturgical') backgroundColor = '#9c27b0'; // purple
    if (event.type === 'Wedding') backgroundColor = '#4caf50';
    if (event.type === 'Funeral') backgroundColor = '#f44336';
    if (event.type === 'Baptism') backgroundColor = '#2196f3';
    if (event.type === 'Custom') backgroundColor = '#ff9800';

    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '4px',
      },
    };
  };


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

        {/* Default Liturgical Calendar  */}
        <Paper elevation={3} sx={{ p: 2, ml: isMobile ? 0 : 2, mt: isMobile ? 2 : 0, maxHeight: 400, overflowY: 'auto', mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <IconButton onClick={() => setYear(prev => prev - 1)}><ArrowBack /></IconButton>
            <Typography variant="h6">Liturgical Calendar ({year})</Typography>
            <IconButton onClick={() => setYear(prev => prev + 1)}><ArrowForward /></IconButton>
          </Box>

          {Object.entries(groupedByMonth).map(([month, items]) => (
            <Box key={month} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>{month}</Typography>
              <Table size="small">
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{new Date(item.date * 1000).toLocaleDateString()}</TableCell>
                      <TableCell>{item.day_of_the_week_long}</TableCell>
                      <TableCell>{item.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ))}
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
                    <strong>Bride:</strong> {selectedEvent.brideName || 'N/A'}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <strong>Groom:</strong> {selectedEvent.groomName || 'N/A'}
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

              {selectedEvent.type === 'Liturgical' && (
                <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  <strong>Liturgical Event:</strong> {selectedEvent.title}
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