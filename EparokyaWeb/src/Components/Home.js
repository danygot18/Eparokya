import React, { useEffect, useState } from 'react';
import GuestSideBar from './GuestSideBar';
import MetaData from './Layout/MetaData';

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [currentIndexes, setCurrentIndexes] = useState({});
  const [currentIndexess, setCurrentIndexess] = useState({});
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const bannerImages = [
    `${process.env.PUBLIC_URL}/EParokya-SampleBanner.png`,
    `${process.env.PUBLIC_URL}/EParokya2-SampleBanner.png`
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API}/api/v1/posts`);
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts || []);
        const initialIndexes = {};
        data.posts.forEach((post) => {
          initialIndexes[post._id] = 0;
        });
        setCurrentIndexes(initialIndexes);
      } else {
        console.error("Failed to load posts:", data.message);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API}/api/v1/eventpost`);
      const data = await response.json();

      console.log(data)
      if (data.success) {
        setEvents(data.events || []);
        const initialIndexes = {};
        data.events.forEach((event) => {
          initialIndexes[event._id] = 0;
        });
        setCurrentIndexess(initialIndexes);
      } else {
        console.error("Failed to load events:", data.message);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchEvents();
  }, []);

  const handleNextImage = (postId) => {
    const post = posts.find(post => post._id === postId);
    if (post?.images?.length) {
      setCurrentIndexes((prevIndexes) => ({
        ...prevIndexes,
        [postId]: (prevIndexes[postId] + 1) % post.images.length,
      }));
    }
  };

  const handlePreviousImage = (postId) => {
    const post = posts.find(post => post._id === postId);
    if (post?.images?.length) {
      setCurrentIndexes((prevIndexes) => ({
        ...prevIndexes,
        [postId]: (prevIndexes[postId] - 1 + post.images.length) % post.images.length,
      }));
    }
  };

  const handleNextImageEvent = (eventId) => {
    setCurrentIndexess((prevIndexes) => ({
      ...prevIndexes,
      [eventId]: (prevIndexes[eventId] + 1) % events.find(event => event._id === eventId).images.length,
    }));
  };

  const handlePreviousImageEvent = (eventId) => {
    setCurrentIndexess((prevIndexes) => ({
      ...prevIndexes,
      [eventId]: (prevIndexes[eventId] - 1 + events.find(event => event._id === eventId).images.length) %
        events.find(event => event._id === eventId).images.length,
    }));
  };

  return (
    <div style={styles.homeContainer}>
      <MetaData title="Home" />

      <div style={styles.contentContainer}>
        <GuestSideBar />

        <div style={styles.mainContent}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search"
              style={styles.searchInput}
            />
          </div>

          <div style={styles.bannerContainer}>
            <img
              src={bannerImages[currentBannerIndex]}
              alt="Banner"
              style={styles.bannerImage}
            />
          </div>
          <div style={styles.homediv}>
            <h1 style={styles.sectionTitle}>Featured Posts</h1>

            {loading ? (
              <p>Loading posts...</p>
            ) : (
              <div style={styles.postsGrid}>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post._id} style={styles.postCard}>
                      <h2 style={styles.postTitle}>{post.name}</h2>
                      <p style={styles.postDescription}>{post.description}</p>

                      {post.images?.length > 0 && (
                        <div style={styles.imageCarousel}>
                          <img
                            src={post.images[currentIndexes[post._id] || 0].url}
                            alt={post.name || 'Post image'}
                            style={styles.postImage}
                          />
                          <div style={styles.carouselControls}>
                            <button
                              onClick={() => handlePreviousImage(post._id)}
                              style={styles.carouselButton}
                            >
                              Previous
                            </button>
                            <span style={styles.carouselCounter}>
                              {(currentIndexes[post._id] || 0) + 1} / {post.images.length}
                            </span>
                            <button
                              onClick={() => handleNextImage(post._id)}
                              style={styles.carouselButton}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No posts available</p>
                )}
              </div>
            )}

            <h1 style={styles.sectionTitle}>Featured Events</h1>

            {eventsLoading ? (
              <p>Loading events...</p>
            ) : (
              <div style={styles.eventsGrid}>
                {events.length > 0 ? (
                  events.map((event) => (
                    <div key={event._id} style={styles.eventCard}>
                      <h2 style={styles.eventTitle}>{event.title}</h2>
                      <p style={styles.eventDescription}>{event.description}</p>
                      {event.images?.length > 0 && (
                        <div style={styles.imageCarousel}>
                          <img
                            src={event.images[currentIndexess[event._id] || 0].url}
                            alt={event.name || 'Event image'}
                            style={styles.postImage}
                          />
                          <div style={styles.carouselControls}>
                            <button
                              onClick={() => handlePreviousImageEvent(event._id)}
                              style={styles.carouselButton}
                            >
                              <span style={styles.carouselButtonIcon}>←</span>
                            </button>
                            <span style={styles.carouselCounter}>
                              {(currentIndexess[event._id] || 0) + 1} / {event.images.length}
                            </span>
                            <button
                              onClick={() => handleNextImageEvent(event._id)}
                              style={styles.carouselButton}
                            >
                             <span style={styles.carouselButtonIcon}>→</span>
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
    </div>
  );
};

const styles = {
  homeContainer: {
    display: 'flex',
  },
  homediv: {
    padding: "15px",
    backgroundColor: '#c2d8be',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  mainContent: {
    flex: 1,
    padding: '40px',
    backgroundColor: '#f9f9f9',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '10px',
  },
  searchInput: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '200px',
  },
  bannerContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  bannerImage: {
    width: '100%',
    maxWidth: '1500px',
    height: '500px',
    borderRadius: '10px',
    objectFit: 'cover',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '32px',
    color: '#333',
    textAlign: 'left',
    marginBottom: '20px',
    marginTop: "20px"
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
    borderRadius: '10px',
  },
  postCard: {
    padding: '20px',
    backgroundColor: '#4a6a57',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#fff',
  },
  postTitle: {
    fontSize: '20px',
    color: '#fff',
    marginBottom: '10px',
  },
  postDescription: {
    color: '#ddd',
    marginBottom: '10px',
  },
  imageCarousel: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '150px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  carouselControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
  },
  carouselButton: {
    // backgroundColor: '#007bff',
    // color: '#fff',
    border: 'none',
    padding: '10px 15px',
    margin: '0 5px',
    cursor: 'pointer',
    borderRadius: '50%',
    fontSize: '16px',  
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselButtonIcon: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  carouselCounter: {
    fontSize: '14px',
    color: '#fff',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '30px',
    borderRadius: '10px',
  },
  eventCard: {
    padding: '20px',
    backgroundColor: '#3a5a40',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#fff',
  },
  eventTitle: {
    fontSize: '20px',
    color: '#fff',
    marginBottom: '10px',
  },
  eventDescription: {
    color: '#ddd',
    marginBottom: '10px',
  },
  eventDate: {
    color: '#ccc',
  },
};


export default Home;
