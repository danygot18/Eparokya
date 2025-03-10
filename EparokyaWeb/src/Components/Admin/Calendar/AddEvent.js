import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const AddEvent = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [ministryCategories, setMinistryCategories] = useState([]);
  const [selectedMinistries, setSelectedMinistries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`,
          { withCredentials: true }
        );
        setMinistryCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching ministry categories:', error);
      }
    };

    fetchMinistries();
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedMinistries((prev) => [...prev, value]);
    } else {
      setSelectedMinistries((prev) => prev.filter((id) => id !== value));
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!title || !date) {
      setErrorMessage('Title and Date are required.');
      return;
    }

    const formattedTime = time ? moment(time, 'HH:mm').format('h:mm A') : '';
    const newEvent = {
      title,
      customeventDate: date,
      customeventTime: formattedTime,
      description,
      ministryCategory: selectedMinistries,
    };
    console.log('New Event Data:', newEvent);

    try {
      await axios.post(`${process.env.REACT_APP_API}/api/v1/addEvent`, newEvent, {
        withCredentials: true,
      });

      navigate('/admin/calendar', { state: { newEvent } });
    } catch (error) {
      console.error('Error adding event:', error);
      setErrorMessage('Failed to add event. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add Event</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleAddEvent}>
        <label>
          Event Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginLeft: '10px', marginBottom: '10px', display: 'block' }}
          />
        </label>
        <label>
          Event Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ marginLeft: '10px', marginBottom: '10px', display: 'block' }}
          />
        </label>
        <label>
          Event Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ marginLeft: '10px', marginBottom: '10px', display: 'block' }}
          />
        </label>
        <label>
          Event Time (optional):
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ marginLeft: '10px', marginBottom: '10px', display: 'block' }}
          />
        </label>
        <div style={{ marginBottom: '10px' }}>
          <p>Select Ministry Categories (optional):</p>
          {ministryCategories.map((ministry) => (
            <label key={ministry._id} style={{ display: 'block' }}>
              <input
                type="checkbox"
                value={ministry._id}
                onChange={handleCheckboxChange}
              />
              {ministry.name}
            </label>
          ))}
        </div>
        <button type="submit" style={{ marginRight: '10px' }}>
          Add Event
        </button>
        <button type="button" onClick={() => navigate('/')}>Cancel</button>
      </form>
    </div>
  );
};

export default AddEvent;
