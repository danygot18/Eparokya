import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import Loader from '../Layout/Loader';

const localizer = momentLocalizer(moment);

const WeddingCalendar = () => {
  const [weddings, setWeddings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
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
      }));
      setWeddings(formatted);
    } catch (err) {
      console.error('Failed to load weddings:', err);
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
      fontSize: isMobile ? '0.7rem' : '0.8rem',
    },
  });

  if (loading) return <Loader />;

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold', color: 'success.main' }}
      >
        Wedding Calendar
      </Typography>

      <Paper elevation={2} sx={{ p: 1, borderRadius: 2 }}>
        <Calendar
          localizer={localizer}
          events={weddings}
          startAccessor="start"
          endAccessor="end"
          defaultView={isMobile ? 'agenda' : 'month'}
          eventPropGetter={eventPropGetter}
          onSelectEvent={setSelectedEvent}
          style={{ height: isMobile ? 500 : 700 }}
        />
      </Paper>

      {selectedEvent && (
        <Paper elevation={2} sx={{ mt: 2, p: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Wedding Details
          </Typography>
          <Typography><strong>Bride:</strong> {selectedEvent.bride}</Typography>
          <Typography><strong>Groom:</strong> {selectedEvent.groom}</Typography>
          <Typography>
            <strong>Date:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY')}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default WeddingCalendar;
