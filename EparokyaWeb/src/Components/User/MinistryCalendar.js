import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GuestSideBar from '../GuestSideBar';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MinistryCalendar = () => {
  const [ministries, setMinistries] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarTitle, setCalendarTitle] = useState('General Calendar');

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

    fetchMinistries();
  }, []);

  const handleMinistryClick = async (ministry) => {
    setSelectedMinistry(ministry);
    setCalendarTitle(`${ministry.name} Calendar`);
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
    } catch (error) {
      console.error('Error fetching ministry events:', error);
      setEvents([]);
    }
  };


  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Left Column: GuestSideBar */}
      <div style={{ flex: '0 0 200px' }}>
        <GuestSideBar />
      </div>

      {/* Center Column: Calendar Display */}
      <div style={{ flex: 1, padding: '10px' }}>
        <h2>{calendarTitle}</h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleEventClick}
        />
        {/* Event Details Display */}
        {selectedEvent && (
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Event Details</h3>
            <p><strong>Ministry:</strong> {selectedMinistry ? selectedMinistry.name : 'General'}</p>
            <p><strong>Event Title:</strong> {selectedEvent.title}</p>
            <p><strong>Event Description:</strong> {selectedEvent.description || 'No description provided.'}</p>
            <p><strong>Event Date:</strong> {moment(selectedEvent.customeventDate).format('MMMM D, YYYY')}</p>
            {selectedEvent.customeventTime && (
              <p><strong>Event Time:</strong> {moment(selectedEvent.customeventTime, 'h:mm A').format('h:mm A')}</p>
            )}
          </div>
        )}
      </div>


      {/* Right Column: Ministry List */}
      <div
        style={{
          flex: '0 0 200px',
          padding: '10px',
          borderLeft: '1px solid #ccc',
        }}
      >
        <h3>Ministries</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {ministries.map((ministry) => (
            <li
              key={ministry._id}
              onClick={() => handleMinistryClick(ministry)}
              style={{
                cursor: 'pointer',
                padding: '5px',
                borderBottom: '1px solid #eee',
              }}
            >
              {ministry.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MinistryCalendar;
