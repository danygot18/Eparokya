import React, { useEffect, useState } from "react";
import GuestSideBar from "./GuestSideBar";
import MetaData from "./Layout/MetaData";
import axios from "axios";
import { FaStar, FaBookmark, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
        style={styles.resourceImage}
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

const ResourcePage = () => {
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const navigate = useNavigate();
  const config = { withCredentials: true };

  useEffect(() => {
    fetchUser();
    fetchResources();
    fetchCategories();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/profile`,
        config
      );
      setUser(response.data.user);
      const bookmarksResponse = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/userBookmarks/${response.data.user._id}`,
        config
      );

      const bookmarkedIds = bookmarksResponse.data.bookmarks.map(
        (bookmark) => bookmark._id
      );
      setBookmarkedResources(bookmarkedIds);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllResource`
      );
      setResources(response.data.data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResources([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllResourceCategory`
      );
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleBookmark = async (resourceId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/toggleBookmark/${resourceId}`,
        { userId: user._id },
        config
      );

      if (response.data.success) {
        setBookmarkedResources((prev) =>
          prev.includes(resourceId)
            ? prev.filter((id) => id !== resourceId)
            : [...prev, resourceId]
        );
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleOpenModal = (link) => {
    setModalContent(link);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalContent("");
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const displayedResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory
      ? resource.resourceCategory?._id === selectedCategory
      : true;

    const matchesSearch = searchTerm
      ? resource.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  return (
    <div style={styles.homeContainer}>
      <MetaData title="Resources" />
      <div style={styles.contentContainer}>
        <GuestSideBar />
        <div style={styles.mainContent}>
          {/* Search Bar */}
          <div style={styles.searchBarContainer}>
            <input
              type="text"
              placeholder="Search resources by title"
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

          {/* Resources */}
          <div style={styles.resourcesContainer}>
            {displayedResources.map((resource) => (
              <div key={resource._id} style={styles.resourceCard}>
                {/* Bookmark Icon */}
                <FaBookmark
                  style={{
                    color: bookmarkedResources.includes(resource._id)
                      ? "yellow"
                      : "gray",
                    cursor: "pointer",
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                  onClick={() => handleBookmark(resource._id)}
                />

                <h2 style={styles.resourceTitle}>{resource.title}</h2>
                <p style={styles.resourceDescription}>{resource.description}</p>
                <p style={styles.resourceLink}>
                  <span
                    style={styles.linkButton}
                    onClick={() => handleOpenModal(resource.link)}
                  >
                    Link
                  </span>
                </p>

                {/* Resource Image or Slider */}
                {resource.images && resource.images.length > 0 ? (
                  <ImageSlider images={resource.images} />
                ) : resource.image ? (
                  <img
                    src={resource.image.url}
                    alt={resource.title}
                    style={styles.resourceImage}
                  />
                ) : resource.file ? (
                  <button
                    onClick={() =>
                      window.open(
                        resource.file.url,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#d5edd9",
                      color: "black",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    View File
                  </button>
                ) : null}

         
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <FaTimes style={styles.closeIcon} onClick={handleCloseModal} />
            <p>{modalContent}</p>
          </div>
        </div>
      )}
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
  resourcesContainer: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    alignItems: "flex-start",
  },
  resourceCard: {
    backgroundColor: "#e9ecef",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "15px",
    width: "60%",
    alignItems: "center",
    position: "relative",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    position: "relative",
  },

  resourceTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  resourceDescription: {
    fontSize: "14px",
    marginBottom: "10px",
  },
  resourceLink: {
    fontSize: "14px",
    marginBottom: "10px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    position: "relative",
    width: "300px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  modalBody: {
    maxWidth: "100%",
    wordBreak: "break-word",
  },
  modalText: {
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },
  closeIcon: {
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
    fontSize: "20px",
  },
  resourceImage: {
    width: "50%",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  starRatings: {
    display: "flex",
    gap: "5px",
  },
  sliderWrapper: {
    width: "100%",
    height: "300px",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
    borderRadius: "8px",
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
};

export default ResourcePage;
