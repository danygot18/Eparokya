import React, { useEffect, useState } from 'react';
import GuestSideBar from '../GuestSideBar';
import MetaData from '../Layout/MetaData';

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndexes, setCurrentIndexes] = useState({}); // Track the current image index per event

  // Fetch events function
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API}/api/v1/eventpost`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.events || []);
        const initialIndexes = {};
        data.events.forEach((event) => {
          initialIndexes[event._id] = 0; // Initialize each event's image index to 0
        });
        setCurrentIndexes(initialIndexes);
      } else {
        console.error("Failed to load events:", data.message);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle navigation for each event's image carousel
  const handleNextImage = (eventId) => {
    setCurrentIndexes((prevIndexes) => ({
      ...prevIndexes,
      [eventId]: (prevIndexes[eventId] + 1) % events.find(event => event._id === eventId).images.length,
    }));
  };

  const handlePreviousImage = (eventId) => {
    setCurrentIndexes((prevIndexes) => ({
      ...prevIndexes,
      [eventId]: (prevIndexes[eventId] - 1 + events.find(event => event._id === eventId).images.length) %
        events.find(event => event._id === eventId).images.length,
    }));
  };

  return (
    <div style={styles.container}>
      <MetaData title="Events" />
      <div style={styles.contentContainer}>
        <GuestSideBar />
        <div style={styles.mainContent}>
          <h1>Featured Events</h1>
          {loading ? (
            <p>Loading events...</p>
          ) : (
            <div style={styles.eventsContainer}>
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event._id} style={styles.carouselItem}>
                    <h2 style={styles.carouselItemTitle}>{event.name}</h2>
                    <p style={styles.carouselItemDescription}>{event.description}</p>
                    
                    {event.images.length > 0 && (
                      <div style={styles.imageCarousel}>
                        <img
                          src={event.images[currentIndexes[event._id] || 0].url}
                          alt={event.name || 'Event image'}
                          style={styles.carouselImage}
                        />
                        <div style={styles.carouselImageControls}>
                          <button
                            onClick={() => handlePreviousImage(event._id)}
                            style={styles.carouselImageButton}
                          >
                            Previous
                          </button>
                          <span style={styles.carouselImageSpan}>
                            {((currentIndexes[event._id] || 0) + 1)} / {event.images.length}
                          </span>
                          <button
                            onClick={() => handleNextImage(event._id)}
                            style={styles.carouselImageButton}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No events available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  mainContent: {
    flex: 1,
    padding: '40px',
    backgroundColor: '#f9f9f9',
  },
  eventsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
    alignItems: 'center',
  },
  carouselItem: {
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  carouselItemTitle: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '10px',
  },
  carouselItemDescription: {
    color: '#555',
    marginBottom: '15px',
  },
  imageCarousel: {
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '400px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  carouselImageControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
  },
  carouselImageButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    margin: '0 5px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  carouselImageSpan: {
    fontSize: '16px',
    color: '#333',
  },
};

export default Events;
