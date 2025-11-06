import React, { useEffect, useState, useMemo } from "react";
import GuestSideBar from "./GuestSideBar";
import MetaData from "./Layout/MetaData";
import axios from "axios";
import { FaHeart, FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "./Layout/Loader";
import MassReadingsCard from "./MassReadingsCard";
import MassIntentionCard from "./MassIntentionCard";
import { Button, useMediaQuery } from "@mui/material"; // Import for responsive check

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

const PinnedAnnouncements = ({
  pinnedAnnouncements,
  goPrev,
  goNext,
  currentPinnedIndex,
}) => {
  const startIdx = currentPinnedIndex * 4;
  const endIdx = startIdx + 4;
  const announcementsToDisplay = pinnedAnnouncements.slice(startIdx, endIdx);

  return (
    <div style={styles.pinnedContainer}>
      <button onClick={goPrev} style={styles.arrowButton}>
        &lt;
      </button>
      <div style={styles.pinnedWrapper}>
        {announcementsToDisplay.length > 0 ? (
          announcementsToDisplay.map((announcement) => (
            <div key={announcement._id} style={styles.pinnedBox}>
              <img
                src={announcement.image || "/placeholder.png"}
                alt={announcement.name}
                style={styles.pinnedImage}
              />
              <div style={styles.pinnedTitle}>{announcement.name}</div>
            </div>
          ))
        ) : (
          <p>No pinned announcements available.</p>
        )}
      </div>
      <button onClick={goNext} style={styles.arrowButton}>
        &gt;
      </button>
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
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);


  const navigate = useNavigate();
  const itemsPerPage = 4;

  // Check if screen is mobile (max-width 768px)
  const isMobile = useMediaQuery("(max-width: 768px)");

  const bannerImages = [
    `${process.env.PUBLIC_URL}/Eparokya_UpdatedBanner.png`,
    `${process.env.PUBLIC_URL}/EParokya2-SampleBanner.png`,
  ];
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const pinnedAnnouncements = useMemo(
    () => announcements.filter((a) => a.isFeatured),
    [announcements]
  );

  useEffect(() => {
    fetchAnnouncements();
    fetchCategories();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllAnnouncements`
      );
      const fetched = response.data.announcements || [];
      const sorted = fetched.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setAnnouncements(sorted);
      setFilteredAnnouncements(sorted);
    } catch (err) {
      console.error("Error fetching announcements:", err);
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
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const goNext = () => {
    const totalPages = Math.ceil(pinnedAnnouncements.length / itemsPerPage);
    setCurrentPinnedIndex((prev) => (prev + 1) % totalPages);
  };

  const goPrev = () => {
    const totalPages = Math.ceil(pinnedAnnouncements.length / itemsPerPage);
    setCurrentPinnedIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredAnnouncements(announcements);
      return;
    }
    const filtered = announcements.filter(
      (a) =>
        a.name.toLowerCase().includes(term.toLowerCase()) ||
        (a.tags &&
          a.tags.some((t) => t.toLowerCase().includes(term.toLowerCase())))
    );
    setFilteredAnnouncements(filtered);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleCardClick = (id) => {
    navigate(`/announcementDetails/${id}`);
  };

  const displayedAnnouncements = filteredAnnouncements.filter((a) => {
    const matchesCategory = selectedCategory
      ? a.announcementCategory?._id === selectedCategory
      : true;
    const matchesSearch = searchTerm
      ? a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.tags &&
        a.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())))
      : true;
    return matchesCategory && matchesSearch;
  });

  if (loading) return <Loader />;

  return (
    <div style={styles.homeContainer}>
      <MetaData title="Home" />
      {/* Mobile Header Menu Button */}
      {isMobile && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "10px",
          }}
        >
          {/* Left-side button (existing) */}
          <button
            onClick={() => setShowSidePanel(!showSidePanel)}
            style={{
              background: "none",
              border: "none",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            ☰
          </button>

          {/* Right-side new button */}
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            style={{
              background: "none",
              border: "none",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            📖
          </button>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && showSidePanel && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowSidePanel(false)} // close when clicking outside
        >
          <div>

            <div>
              <GuestSideBar />
            </div>
          </div>
        </div>
      )}
      {/* Mobile Right Overlay */}
      {isMobile && showRightPanel && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowRightPanel(false)} // close when clicking outside
        >
          <div
            style={{
              backgroundColor: "#fff",
              width: "90%",
              maxWidth: "400px",
              borderRadius: "10px",
              padding: "20px",
              overflowY: "auto",
              maxHeight: "80vh",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRightPanel(false)}
              style={{
                position: "absolute",
                top: "1px",
                right: "5px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>

            {/* Right side content */}
            <MassReadingsCard />
            <MassIntentionCard />
          </div>
        </div>
      )}




      <div style={styles.contentContainer}>
        {/* Conditionally render sidebar only on desktop */}
        {!isMobile && (
          <div style={styles.sidebarContainer}>
            <GuestSideBar />
          </div>
        )}

        {/* Main + Right Section */}
        <div style={styles.mainAndRightContainer}>
          <div style={styles.mainContent}>
            {/* Banner */}
            <div style={styles.bannerContainer}>
              <img
                src={bannerImages[currentBannerIndex]}
                alt="Banner"
                style={styles.bannerImage}
              />
            </div>


            {/* Search */}
            <div style={styles.searchBarContainer}>
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {/* Pinned */}
            {pinnedAnnouncements.length > 0 && (
              <PinnedAnnouncements
                pinnedAnnouncements={pinnedAnnouncements}
                goPrev={goPrev}
                goNext={goNext}
                currentPinnedIndex={currentPinnedIndex}
              />
            )}

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
              {categories.map((c) => (
                <span
                  key={c._id}
                  style={{
                    ...styles.category,
                    backgroundColor:
                      selectedCategory === c._id ? "#2c3e50" : "#3a5a40",
                  }}
                  onClick={() => handleCategoryClick(c._id)}
                >
                  {c.name}
                </span>
              ))}
            </div>

            {/* Announcements */}
            <div style={styles.announcementsContainer}>
              {displayedAnnouncements.length > 0 ? (
                displayedAnnouncements.map((a) => (
                  <div
                    key={a._id}
                    style={{
                      ...styles.announcementCard,
                      border: a.isFeatured ? "3px solid gold" : "none",
                    }}
                    onClick={() => handleCardClick(a._id)}
                  >
                    <div style={styles.cardContent}>
                      <div style={styles.userInfo}>
                        <img
                          src="/public/../../../../EPAROKYA-SYST.png"
                          alt="Saint Joseph Parish"
                          style={styles.profileImage}
                        />
                        <span style={styles.userName}>Saint Joseph Parish</span>
                      </div>

                      <h2 style={styles.announcementTitle}>{a.name}</h2>
                      <p style={styles.announcementDescription}>
                        {a.description}
                      </p>

                      {a.images?.length ? (
                        <ImageSlider images={a.images} />
                      ) : a.image ? (
                        <img
                          src={a.image}
                          alt={a.name}
                          style={styles.announcementImage}
                        />
                      ) : null}

                      <p style={styles.announcementCategory}>
                        Category: {a.announcementCategory?.name || "Uncategorized"}
                      </p>
                      <p style={styles.tags}>Tags: {a.tags.join(", ")}</p>

                      <div style={styles.reactionsContainer}>
                        <span style={styles.reaction}>
                          <FaHeart color="red" /> {a.likedBy.length || 0}
                        </span>
                        <span style={styles.reaction}>
                          <FaComment color="blue" /> {a.comments.length || 0}
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

          {/* Right side */}
          {!isMobile && (
            <div style={styles.rightSidebar}>
              <MassReadingsCard />
              <MassIntentionCard />
            </div>)}
        </div>
      </div>
    </div>
  );
};

const styles = {
  homeContainer: { display: "flex", flexDirection: "column", alignItems: "center" },
  contentContainer: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  sidebarContainer: { width: "100%", maxWidth: "300px", flex: 1 },
  mainAndRightContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "center",
    padding: "10px",
  },
  mainContent: {
    flex: 1,
    minWidth: "300px",
    padding: "10px",
    maxWidth: "900px",
  },
  bannerContainer: { display: "flex", justifyContent: "center" },
  bannerImage: {
    width: "100%",
    maxWidth: "1200px",
    borderRadius: "8px",
    objectFit: "cover",
    display: "block",
    margin: "0 auto",
  },
  searchBarContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "15px 0",
  },
  searchInput: {
    width: "90%",
    maxWidth: "600px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  rightSidebar: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "300px",
    flex: 1,
    alignItems: "center",
  },
  categoriesContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  category: {
    padding: "8px 12px",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  announcementsContainer: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    width: "100%",
    justifyItems: "center",
  },
  announcementCard: {
    backgroundColor: "#e9ecef",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "15px",
    textAlign: "left",
    margin: "10px auto",
    width: "100%",
    maxWidth: "800px",
  },
  userInfo: { display: "flex", alignItems: "center", marginBottom: "10px" },
  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  userName: { fontWeight: "bold" },
  announcementTitle: { fontSize: "20px" },
  announcementDescription: { fontSize: "16px" },
  announcementImage: { width: "100%", borderRadius: "6px", objectFit: "cover" },
  reactionsContainer: { display: "flex", gap: "10px", marginTop: "10px" },
  reaction: { display: "flex", alignItems: "center", gap: "5px" },
  arrowButton: {
    backgroundColor: "#3a5a40",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
  },
  // Add missing styles for slider, pinned, etc.
  sliderWrapper: { position: "relative", width: "100%", },
  sliderButtonLeft: {
    position: "absolute",
    left: "10px",
    top: "50%",
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
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
  },
  pinnedContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    justifyContent: "center",
    width: "100%",
  },
  pinnedWrapper: {
    display: "flex",
    gap: "10px",
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  pinnedBox: { flex: "0 0 22%", textAlign: "center" },
  pinnedImage: { width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px" },
  pinnedTitle: { marginTop: "5px", fontSize: "14px" },
  cardContent: {}, // Add if needed
  announcementCategory: { fontSize: "14px", color: "#666" },
  tags: { fontSize: "14px", color: "#666" },
};

export default Home;
