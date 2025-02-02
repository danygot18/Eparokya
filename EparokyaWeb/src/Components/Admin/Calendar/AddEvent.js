import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEvent = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleAddEvent = async (e) => {
    e.preventDefault();
  
    if (!title || !date) {
      setErrorMessage('Title and Date are required.');
      return;
    }
  
    const newEvent = { title, customeventDate: date };
    console.log("New Event Data:", newEvent);
  
    try {
      await axios.post(`${process.env.REACT_APP_API}/api/v1/addEvent`, newEvent, {
        withCredentials: true,
      });
  
      navigate('/calendar', { state: { newEvent } });
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
        <button type="submit" style={{ marginRight: '10px' }}>
          Add Event
        </button>
        <button type="button" onClick={() => navigate('/')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
