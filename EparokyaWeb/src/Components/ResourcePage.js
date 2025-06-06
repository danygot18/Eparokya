import React, { useEffect, useState } from "react";
import GuestSideBar from "./GuestSideBar";
import MetaData from "./Layout/MetaData";
import axios from "axios";
import { FaStar, FaBookmark, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import ResourceDetails from "../Components/ResourceDetails";

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
  // const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const navigate = useNavigate();
  const config = { withCredentials: true };

  const { user } = useSelector((state) => state.auth);
  // console.log("user", user._id);
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/profile`,
        config
      );
      // setUser(response.data.user._id);
      console.log("User data:", response.data.user._id);
      const bookmarksResponse = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/userBookmarks/${user._id}`
      );

      const bookmarkedIds = bookmarksResponse.data.bookmarks.map(
        (bookmark) => bookmark._id
      );
      setBookmarkedResources(bookmarkedIds);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  // const fetchResources = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/api/v1/getAllResource`
  //     );
  //     setResources(response.data.data || []);
  //   } catch (error) {
  //     console.error("Error fetching resources:", error);
  //     setResources([]);
  //   }
  // };
  const fetchResources = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getResourcesWithBookmarkCount`
      );
      console.log("Fetched resources:", response.data.data);
      const fetchedResources = response.data.data || [];

      const enrichedResources = fetchedResources.map((resource) => ({
        ...resource,
        isBookmarked: bookmarkedResources.includes(resource._id),
      }));

      setResources(enrichedResources);
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
      // console.log("Categories response:", response.data);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // const handleBookmark = async (resourceId) => {
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API}/api/v1/toggleBookmark/${resourceId}`,
  //       { userId: user._id },
  //       config
  //     );

  //     if (response.data.success) {
  //       setBookmarkedResources((prev) =>
  //         prev.includes(resourceId)
  //           ? prev.filter((id) => id !== resourceId)
  //           : [...prev, resourceId]
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error toggling bookmark:", error);
  //   }
  // };

  const handleBookmark = async (resourceId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/toggleBookmark/${resourceId}`,
        { userId: user._id },
        config
      );

      if (response.data.success) {
        const updatedResource = response.data.resource;

        // Update bookmarked resource IDs
        setBookmarkedResources((prev) =>
          prev.includes(resourceId)
            ? prev.filter((id) => id !== resourceId)
            : [...prev, resourceId]
        );

        // Update the resource in the main resource list
        setResources((prevResources) =>
          prevResources.map((resource) =>
            resource._id === updatedResource._id
              ? {
                  ...resource,
                  bookmarkCount: updatedResource.bookmarkCount,
                  isBookmarked: !resource.isBookmarked,
                }
              : resource
          )
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
  const openResourceModal = (resource) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
  };

  const closeResourceModal = () => {
    setSelectedResource(null);
    setShowResourceModal(false);
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

  useEffect(() => {
    fetchUser();
    fetchResources();
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }
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

          {/* ARTICLES */}
          <h2 style={{ ...styles.sectionTitle, marginTop: "20px" }}>
            Articles
          </h2>
          <div style={styles.resourcesContainer}>
            {displayedResources
              .filter((r) => r.file)
              .map((resource) => (
                <div
                  key={resource._id}
                  style={styles.resourceCard}
                  onClick={() => openResourceModal(resource)} 
                >
                  <FaBookmark
                    style={{
                      ...styles.bookmarkIcon,
                      color: bookmarkedResources.includes(resource._id)
                        ? "yellow"
                        : "gray",
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleBookmark(resource._id);
                    }}
                  />

                  <div style={styles.cardHeader}>
                    <h2 style={styles.resourceTitle}>{resource.title}</h2>
                    <p style={styles.resourceDate}>
                      Created on:{" "}
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <p style={styles.resourceDescription}>
                    {resource.description}
                  </p>

                  <p style={styles.resourceLink}>
                    <strong>Reference Link:</strong>{" "}
                    <span
                      style={styles.linkButton}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering modal
                        handleOpenModal(resource.link);
                      }}
                    >
                      Click for the reference link
                    </span>
                  </p>

                  <div style={styles.previewContainer}>
                    <iframe
                      src={`${resource.file.url}#toolbar=0&navpanes=0&scrollbar=0`}
                      title="File Preview"
                      style={styles.filePreview}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering modal
                        window.open(
                          resource.file.url,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      style={styles.viewButton}
                    >
                      View Full File
                    </button>
                  </div>

                  <p style={styles.bookmarkCount}>
                    Number of users who bookmarked this post:{" "}
                    {resource.bookmarkCount || 0}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Resource Details Modal */}
      {showResourceModal && (
        <ResourceDetails
          open={showResourceModal}
          onClose={closeResourceModal}
          resource={selectedResource}
        />
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  searchBarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  searchInput: {
    width: "500%",
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
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    justifyItems: "center",
  },
  resourceCard: {
    backgroundColor: "#e9ecef",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "350px",
    height: "600px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },

  resourceTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "6px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },
  resourceDescription: {
    fontSize: "13px",
    marginBottom: "8px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
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
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "10px",
  },
  starRatings: {
    display: "flex",
    gap: "5px",
  },
  sliderWrapper: {
    width: "100%",
    height: "120px",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#000",
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
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  bookmarkIcon: {
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "29px",
    transition: "color 0.3s",
  },
  cardHeader: {
    textAlign: "left",
    width: "100%",
  },
  resourceDate: {
    fontSize: "12px",
    color: "gray",
    marginBottom: "8px",
  },

  previewContainer: {
    textAlign: "center",
  },

  filePreview: {
    width: "100%",
    height: "300px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  viewButton: {
    padding: "8px 16px",
    backgroundColor: "#d5edd9",
    color: "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },

  linkButton: {
    marginLeft: "8px",
    textDecoration: "underline",
    color: "#0645AD",
    cursor: "pointer",
  },

  bookmarkCount: {
    fontSize: "12px",
    color: "gray",
    marginTop: "10px",
    textAlign: "left",
    width: "100%",
  },

  modalText: {
    border: "1px solid #ccc",
    padding: "12px",
    borderRadius: "6px",
    backgroundColor: "#f5f5f5",
    wordWrap: "break-word",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  },
};

export default ResourcePage;
