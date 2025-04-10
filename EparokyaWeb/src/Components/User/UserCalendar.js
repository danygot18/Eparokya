import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import GuestSideBar from '../GuestSideBar'; 
import Metadata from '../Layout/MetaData';
import { CircularProgress } from '@mui/material';

const localizer = momentLocalizer(moment);

const UserCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);


  const fetchAllEvents = useCallback(async () => {
    try {
      const [weddingEvents, baptismEvents, funeralEvents, customEvents] = await Promise.all([
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
          type: 'Wedding',
          bride: event.brideName,
          groom: event.groomName,
        })),
        ...baptismEvents.data.map((event) => ({
          id: `baptism-${event._id}`,
          title: `Baptism of ${event.child.fullName || "Unknown"}`,
          start: new Date(event.baptismDate),
          end: new Date(event.baptismDate),
          type: 'Baptism',
          child: event.child,
        })),
        ...funeralEvents.data.map((event) => ({
          id: `funeral-${event._id}`,
          title: `Funeral for ${event.name|| ""}`,
          start: new Date(event.funeralDate),
          end: new Date(event.funeralDate),
          type: 'Funeral',
          name: event.name,
        })),
        ...customEvents.data.map((event) => ({
          id: `custom-${event._id}`,
          title: event.title,
          start: new Date(event.customeventDate),
          end: new Date(event.customeventDate),
          type: 'Custom',
        })),
      ];

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setErrorMessage('Failed to load events. Please try again.');
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
        event.type === 'Wedding' ? 'gold' :
        event.type === 'Baptism' ? 'green' :
        event.type === 'Funeral' ? 'red' : 'purple',
      color: 'white',
    },
  });

  if (loading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </div>
      );
    }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <GuestSideBar style={{ width: '20%', minWidth: '200px' }} /> 
      <div style= {{ fontFamily: 'Helvetica, sans-serif', flex: 1, padding: '20px' }}>
        <Metadata title="User Calendar" />
        <h1>Calendar</h1>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <div style={{ height: '700px', marginTop: '20px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            views={['month', 'week', 'day', 'agenda']}
            eventPropGetter={eventPropGetter}
            onSelectEvent={handleEventClick}
            style={{ height: '100%' }}
          />
        </div>

        {selectedEvent && (
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <h2>Event Details</h2>
            <p><strong>Type:</strong> {selectedEvent.type}</p>
            {selectedEvent.type === 'Wedding' && (
              <>
                <p><strong>Bride:</strong> {selectedEvent.bride || 'N/A'}</p>
                <p><strong>Groom:</strong> {selectedEvent.groom || 'N/A'}</p>
                <p><strong>Date:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY')}</p>
              </>
            )}
            {selectedEvent.type === 'Baptism' && (
              <>
                <p><strong>Child:</strong> {selectedEvent.child.fullName || 'N/A'}</p>
                <p><strong>Date:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY')}</p>
              </>
            )}
            {selectedEvent.type === 'Funeral' && (
              <>
                <p><strong>Name:</strong> {selectedEvent.name ? `${selectedEvent.name.firstName || ''} ${selectedEvent.name.lastName || ''}` : 'N/A'}</p>
                <p><strong>Date:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY')}</p>
              </>
            )}
            {selectedEvent.type === 'Custom' && (
              <>
                <p><strong>Title:</strong> {selectedEvent.title || 'N/A'}</p>
                <p><strong>Date:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY')}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCalendar;
