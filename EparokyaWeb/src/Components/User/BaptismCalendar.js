import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import Loader from '../Layout/Loader';

const localizer = momentLocalizer(moment);

const BaptismCalendar = () => {
  const [baptisms, setBaptisms] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchBaptisms = useCallback(async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedBaptism`);
      const formatted = data.map(event => ({
        id: event._id,
        title: `${event.childName} Baptism`,
        start: new Date(event.baptismDate),
        end: new Date(event.baptismDate),
        childName: event.childName,
        fatherName: event.fatherName,
        motherName: event.motherName,
      }));
      setBaptisms(formatted);
    } catch (err) {
      console.error('Failed to load baptisms:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBaptisms();
  }, [fetchBaptisms]);

  const eventPropGetter = () => ({
    style: {
      backgroundColor: '#90caf9',
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
        sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}
      >
        Baptism Calendar
      </Typography>

      <Paper elevation={2} sx={{ p: 1, borderRadius: 2 }}>
        <Calendar
          localizer={localizer}
          events={baptisms}
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
            Baptism Details
          </Typography>
          <Typography><strong>Child:</strong> {selectedEvent.childName}</Typography>
          <Typography><strong>Father:</strong> {selectedEvent.fatherName}</Typography>
          <Typography><strong>Mother:</strong> {selectedEvent.motherName}</Typography>
          <Typography>
            <strong>Date:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY')}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default BaptismCalendar;