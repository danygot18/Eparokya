import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../SideBar';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EventPostLists = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const config = {
    withCredentials: true,
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/eventpost`, config);
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/eventpost/${eventId}`, config);
      setEvents(events.filter(event => event._id !== eventId));
      toast.success('Event Deleted.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Error Deleting Event.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleEdit = (eventId) => {
    console.log(`/admin/event/${eventId}`);
    navigate(`/admin/editevent/${eventId}`);
  };

  const handleCreate = () => {
    navigate('/admin/eventpost/create');
  };

  return (
    <div style={styles.wrapper}>
      <SideBar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>All Events</h2>
          <button onClick={handleCreate} style={styles.createButton}>Create</button>
        </div>

        {events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          <div style={styles.eventList}>
            {events.map(event => (
              <div key={event._id} style={styles.eventCard}>
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <div style={styles.images}>
                  {event.images.map((image, index) => (
                    <img key={index} src={image.url} alt={event.name} style={styles.image} />
                  ))}
                </div>
                <div style={styles.buttons}>
                  <button onClick={() => handleEdit(event._id)} style={styles.editButton}>Edit</button>
                  <button onClick={() => handleDelete(event._id)} style={styles.deleteButton}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
  },
  container: {
    padding: '20px',
    flex: 1,
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  eventList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  eventCard: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    textAlign: 'left',
  },
  images: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  image: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  buttons: {
    marginTop: '10px',
  },
  editButton: {
    padding: '5px 10px',
    marginRight: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default EventPostLists;
