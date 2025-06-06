import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTheme, useMediaQuery } from '@mui/material';
import { CircularProgress, Box, Typography, Paper, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, Today } from '@mui/icons-material';
import Loader from '../../../../Layout/Loader';

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
        {['month', 'agenda'].map(v => (
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

const WeddingCalendar = () => {
  const [weddings, setWeddings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [view, setView] = useState('month');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchWeddings = useCallback(async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedWedding`);
      const formatted = data.map(event => ({
        id: event._id,
        title: `${event.brideName} & ${event.groomName} Wedding`,
        start: new Date(event.weddingDate),
        end: new Date(event.weddingDate),
        bride: event.brideName,
        groom: event.groomName,
        type: "Wedding"
      }));
      setWeddings(formatted);
    } catch (err) {
      console.error('Failed to load weddings:', err);
      setErrorMessage("Failed to load weddings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeddings();
  }, [fetchWeddings]);

  const eventPropGetter = () => ({
    style: {
      backgroundColor: '#FFD700',
      color: 'black',
      borderRadius: '4px',
      border: 'none',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontSize: isMobile ? '0.7rem' : '0.8rem',
      padding: isMobile ? '1px 3px' : '2px 5px'
    },
  });

  if (loading) return <Loader />;

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
        overflow: 'auto'
      }}>
        
        <Typography variant="h4" sx={{
          mb: 2,
          fontWeight: 'bold',
          color: 'success.main',
          fontSize: isMobile ? '1.5rem' : '2rem'
        }}>
          Wedding Calendar
        </Typography>
        <Typography sx={{mb: 2}}>
          See the available dates for weddings. If you have any questions, please contact the parish office.
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
            events={weddings}
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
              Wedding Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Bride:</strong> {selectedEvent.bride || 'N/A'}
              </Typography>
              <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Groom:</strong> {selectedEvent.groom || 'N/A'}
              </Typography>
              <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Date:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY')}
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default WeddingCalendar;