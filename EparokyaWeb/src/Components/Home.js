import React, { useEffect, useState } from "react";
import GuestSideBar from "./GuestSideBar";
import MetaData from "./Layout/MetaData";
import axios from "axios";
import { FaHeart, FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 < 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div style={styles.sliderWrapper} onClick={(e) => e.stopPropagation()}>
      <img
        src={images[currentIndex].url}
        alt={`Slide ${currentIndex}`}
        style={styles.announcementImage}
      />
      {images.length > 1 && (
        <>
          <button onClick={goPrev} style={styles.sliderButtonLeft}>
            &lt;
          </button>
          <button onClick={goNext} style={styles.sliderButtonRight}>
            &gt;
          </button>
        </>
      )}
    </div>
  );
};

export const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [activeFeedback, setActiveFeedback] = useState(null); // State to store active feedback form
  const [modalLoading, setModalLoading] = useState(true);
  const navigate = useNavigate();

  const bannerImages = [
    `${process.env.PUBLIC_URL}/EParokya-SampleBanner.png`,
    `${process.env.PUBLIC_URL}/EParokya2-SampleBanner.png`,
  ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(
        (prevIndex) => (prevIndex + 1) % bannerImages.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchAnnouncements();
    fetchCategories();
    checkForActiveFeedbackForm(); // Check for active feedback form on component mount
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllAnnouncements`
      );
      setAnnouncements(response.data.announcements || []);
      setFilteredAnnouncements(response.data.announcements || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncements([]);
      setFilteredAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllannouncementCategory`
      );
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const checkForActiveFeedbackForm = async () => {
    setModalLoading(true); // Show loading state
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin-selections/active`
      );
  
      if (response.data && response.data.isActive) {
        setActiveFeedback(response.data);
        setTimeout(() => {
          setShowModal(true); // Ensure state update before rendering modal
        }, 100); // Small delay to ensure proper state update
      }
    } catch (error) {
      console.error("Error fetching active feedback form:", error);
    } finally {
      setModalLoading(false);
    }
  };
  
  
  const handleNavigateToSentiment = () => {
    console.log("Navigating with activeFeedback:", activeFeedback);
    if (activeFeedback) {
      let path = "";
      switch (activeFeedback.category) {
        case "priest":
          path = "/user/PriestSentiment";
          break;
        case "event":
          path = "/user/EventSentiment";
          break;
        case "activity":
          path = "/user/ActivitySentiment";
          break;
        default:
          console.error("Invalid feedback category:", activeFeedback.category);
          return;
      }
      navigate(path, { state: { activeFeedback } });
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredAnnouncements(announcements);
      return;
    }

    const filtered = announcements.filter(
      (announcement) =>
        announcement.name.toLowerCase().includes(term.toLowerCase()) ||
        (announcement.tags &&
          announcement.tags.some((tag) =>
            tag.toLowerCase().includes(term.toLowerCase())
          ))
    );
    setFilteredAnnouncements(filtered);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleCardClick = (announcementId) => {
    navigate(`/announcementDetails/${announcementId}`);
  };

  const displayedAnnouncements = announcements.filter((announcement) => {
    const matchesCategory = selectedCategory
      ? announcement.announcementCategory?._id === selectedCategory
      : true;

    const matchesSearch = searchTerm
      ? announcement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (announcement.tags &&
          announcement.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      : true;

    return matchesCategory && matchesSearch;
  });

  return (
    <div style={styles.homeContainer}>
      <MetaData title="Home" />
      <div style={styles.contentContainer}>
        <GuestSideBar />

        <div style={styles.mainContent}>
          {/* Banner */}
          <div style={styles.bannerContainer}>
            <img
              src={bannerImages[currentBannerIndex]}
              alt="Banner"
              style={styles.bannerImage}
            />
          </div>

          {/* Search Bar */}
          <div style={styles.searchBarContainer}>
            <input
              type="text"
              placeholder="Search announcements by name or tags"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Categories */}
          <div style={styles.categoriesContainer}>
            <span
              style={{
                ...styles.category,
                backgroundColor:
                  selectedCategory === null ? "#2c3e50" : "#3a5a40",
              }}
              onClick={() => handleCategoryClick(null)}
            >
              All
            </span>

            {categories.map((category) => (
              <span
                key={category._id}
                style={{
                  ...styles.category,
                  backgroundColor:
                    selectedCategory === category._id ? "#2c3e50" : "#3a5a40",
                }}
                onClick={() => handleCategoryClick(category._id)}
              >
                {category.name}
              </span>
            ))}
          </div>

          {/* Announcements */}
          <div style={styles.announcementsContainer}>
            {loading ? (
              <p>Loading announcements...</p>
            ) : displayedAnnouncements.length > 0 ? (
              displayedAnnouncements.map((announcement) => (
                <div
                  key={announcement._id}
                  style={styles.announcementCard}
                  onClick={() => handleCardClick(announcement._id)}
                >
                  {/* Content */}
                  <div style={styles.cardContent}>
                    {/* User Info */}
                    <div style={styles.userInfo}>
                      <img
                        src="/public/../../../../EPAROKYA-SYST.png"
                        alt="Saint Joseph Parish"
                        style={styles.profileImage}
                      />
                      <span style={styles.userName}>Saint Joseph Parish</span>
                    </div>

                    <h2 style={styles.announcementTitle}>
                      {announcement.name}
                    </h2>
                    <p style={styles.announcementDescription}>
                      {announcement.description}
                    </p>

                    {/* Image / Slider */}
                    <div style={styles.imageSliderContainer}>
                      {announcement.images && announcement.images.length > 0 ? (
                        <ImageSlider images={announcement.images} />
                      ) : announcement.image ? (
                        <img
                          src={announcement.image}
                          alt={announcement.name}
                          style={styles.announcementImage}
                        />
                      ) : null}
                    </div>

                    <p style={styles.announcementCategory}>
                      Category:{" "}
                      {announcement.announcementCategory?.name ||
                        "Uncategorized"}
                    </p>
                    <p style={styles.tags}>
                      Tags: {announcement.tags.join(", ")}
                    </p>

                    {/* Like & Comment Section */}
                    <div style={styles.reactionsContainer}>
                      <span style={styles.reaction}>
                        <FaHeart color="red" />{" "}
                        {announcement.likedBy.length || 0}
                      </span>
                      <span style={styles.reaction}>
                        <FaComment color="blue" />{" "}
                        {announcement.comments.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No announcements available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Active Feedback Form */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static" // Prevent closing on backdrop click
        keyboard={false} // Prevent closing on pressing the Esc key
        style={styles.modal} // Apply z-index to the modal
        backdropClassName="custom-backdrop" // Optional: Add a custom class for the backdrop
      >
        <Modal.Header closeButton>
          <Modal.Title>Active Feedback Form</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          {modalLoading ? (
            <p>Loading feedback details...</p> // Show a loading message or spinner
          ) : activeFeedback ? (
            <>
              <p>
                <strong>Category:</strong> {activeFeedback.category || "N/A"}
              </p>
              <p>
                <strong>Date:</strong> {activeFeedback.date || "N/A"}
              </p>
              <p>
                <strong>Time:</strong> {activeFeedback.time || "N/A"}
              </p>
              <Button
                variant="primary"
                onClick={handleNavigateToSentiment}
                style={styles.modalButton}
              >
                Go to Feedback Form
              </Button>
            </>
          ) : (
            <p>No active feedback form available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const styles = {
  homeContainer: {
    display: "flex",
  },
  contentContainer: {
    display: "flex",
    width: "100%",
    backgroundColor: "#f9f9f9",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
  },
  bannerContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  bannerImage: {
    width: "100%",
    maxWidth: "1200px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  searchBarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  searchInput: {
    width: "60%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  categoriesContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  category: {
    padding: "8px 12px",
    backgroundColor: "#3a5a40",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  announcementsContainer: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    alignItems: "flex-start",
    paddingLeft: "20px",
  },
  announcementCard: {
    backgroundColor: "#e9ecef",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "800px",
    padding: "15px",
    textAlign: "left",
    margin: "20px auto",
  },

  layoutContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },

  notificationsContainer: {
    width: "300px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },

  imageSliderContainer: {
    width: "100%",
    height: "300px", // Increased for better visibility
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },

  sliderWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  announcementImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  sliderButtonLeft: {
    position: "absolute",
    top: "50%",
    left: "10px",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
  },
  sliderButtonRight: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
  },
  cardContent: {
    padding: "15px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  userName: {
    fontWeight: "bold",
    fontSize: "14px",
  },
  announcementTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  announcementDescription: {
    fontSize: "14px",
    marginBottom: "10px",
  },
  announcementCategory: {
    fontSize: "12px",
    marginBottom: "5px",
    fontStyle: "italic",
  },
  tags: {
    fontSize: "12px",
    color: "#555",
  },
  reactionsContainer: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    marginTop: "10px",
  },
  reaction: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "14px",
  },
  modalBody: {
    padding: "20px",
    textAlign: "center",
  },
  modalButton: {
    marginTop: "10px",
  },
  modal: {
    zIndex: 1050, // Ensure the modal is above the backdrop
  },
  backdrop: {
    zIndex: 1040, // Ensure the backdrop is below the modal
  },
};

export default Home;
