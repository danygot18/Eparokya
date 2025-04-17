import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import MetaData from '../../Layout/MetaData';
import SideBar from '../SideBar';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../Layout/styles/style.css'
import { Button } from '@mui/material';
const localizer = momentLocalizer(moment);

const Calendars = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const config = { withCredentials: true };

  const fetchAllEvents = useCallback(async () => {
    try {
      const [weddingEvents, baptismEvents, funeralEvents, customEvents] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedWedding`, config),
        axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedBaptism`, config),
        axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedFuneral`, config),
        axios.get(`${process.env.REACT_APP_API}/api/v1/getAllCustomEvents`, config),
      ]);

      // console.log('Wedding Events:', weddingEvents.data);
      console.log('Baptism Events:', baptismEvents.data);
      // console.log('Funeral Events:', funeralEvents.data);
      console.log('Custom Events:', customEvents.data);
      // console.log('Selected Event:', selectedEvent);


      const formattedEvents = [
        ...weddingEvents.data.map((event) => ({
          id: `wedding-${event._id}`,
          title: `${event.bride} & ${event.groom} Wedding`,
          start: new Date(event.weddingDate),
          end: new Date(event.weddingDate),
          type: 'Wedding',
        })),
        ...baptismEvents.data.map((event) => ({
          id: `baptism-${event._id}`,
          title: `Baptism of ${event.child.fullName || "Unknown"}`,
          start: new Date(event.baptismDate),
          end: new Date(event.baptismDate),
          type: 'Baptism',
        })),
        ...funeralEvents.data.map((event) => ({
          id: `funeral-${event._id}`,
          title: `Funeral for ${event.name || ""} `,
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

      if (location.state && location.state.newEvent) {
        const newEvent = location.state.newEvent;
        formattedEvents.push({
          id: `custom-new-${newEvent.title}`,
          title: newEvent.title,
          start: new Date(newEvent.customeventDate),
          end: new Date(newEvent.customeventDate),
          type: 'Custom',
        });
      }

      setEvents((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(formattedEvents)) {
          return formattedEvents;
        }
        return prev;
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      setErrorMessage('Failed to load events. Please try again.');
    }
  }, [config, location.state]);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);


  const formatEvent = (event) => {
    if (event.bride && event.groom) {
      return {
        id: `wedding-${event._id}`,
        title: `${event.brideName} & ${event.groomName} Wedding`,
        start: new Date(event.weddingDate),
        end: new Date(event.weddingDate),
        type: 'Wedding',
      };
    } else if (event.child) {
      return {
        id: `baptism-${event._id}`,
        title: `Baptism of ${event.child.fullName || 'Unknown'}`,
        start: new Date(event.baptismDate),
        end: new Date(event.baptismDate),
        type: 'Baptism',
      };
    } else if (event.name) {
      return {
        id: `funeral-${event._id}`,
        title: `Funeral for ${event.name.firstName || ''} ${event.name.lastName || ''}`,
        start: new Date(event.funeralDate),
        end: new Date(event.funeralDate),
        type: 'Funeral',
      };
    }
    return null;
  };

  const formatCustomEvent = (customEvent) => ({
    id: `custom-${customEvent._id}`,
    title: customEvent.title,
    start: new Date(customEvent.date),
    end: new Date(customEvent.date),
    type: 'Custom',
  });

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
        event.type === 'Wedding' ? 'blue' :
          event.type === 'Baptism' ? 'green' :
            event.type === 'Funeral' ? 'red' : 'purple',
      color: 'white',
    },
  });

  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div style={{ flex: 1, padding: '20px' }}>
        <MetaData title="Calendar" />
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
                <p><strong>Date:</strong> {new Date(selectedEvent.weddingDate).toLocaleDateString()}</p>
              </>
            )}
            {selectedEvent.type === 'Baptism' && (
              <>
                <p><strong>Child:</strong> {selectedEvent.child.fullName || 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(selectedEvent.baptismDate).toLocaleDateString()}</p>
              </>
            )}
            {selectedEvent.type === 'Funeral' && (
              <>
                <p><strong>Name:</strong> {selectedEvent.name ? `${selectedEvent.name.firstName || ''} ${selectedEvent.name.lastName || ''}` : 'N/A'}</p>
                <p><strong>Date:</strong> {selectedEvent.funeralDate ? new Date(selectedEvent.funeralDate).toLocaleDateString() : 'N/A'}</p>
              </>
            )}
            {selectedEvent.type === 'Custom' && (
              <>
                <p><strong>Title:</strong> {selectedEvent.title || 'N/A'}</p>
                {/* <p><strong>Description:</strong> {selectedEvent.description || 'N/A'}</p> */}
                <p><strong>Date:</strong> {moment(selectedEvent.customeventDate).isValid()
                  ? moment(selectedEvent.customeventDate).format('MMMM Do YYYY')
                  : 'Invalid Date'}</p>
              </>
            )}
          </div>
        )}

        <Button
        variant='contained'
        color='success'
        style={{ marginTop: '20px' }}
          onClick={() => {
            navigate('/admin/addEvent');
          }}

        
        >
          Add Event
        </Button>

      </div>
    </div>


  );
};

export default Calendars;
