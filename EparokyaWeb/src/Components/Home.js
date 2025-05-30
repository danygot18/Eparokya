import React, { useEffect, useState } from "react";
import GuestSideBar from "./GuestSideBar";
import MetaData from "./Layout/MetaData";
import axios from "axios";
import { FaHeart, FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useMemo } from "react";
import Loader from "./Layout/Loader";
import MassReadingsCard from "./MassReadingsCard";

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

const ParishPriests = ({ priests }) => {
  const [currentPriestIndex, setCurrentPriestIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPriestIndex(
        (prev) => (prev + 1) % Math.ceil(priests.length / itemsPerPage)
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [priests]);

  const startIdx = currentPriestIndex * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const priestsToDisplay = priests.slice(startIdx, endIdx);

  return (
    <div style={styles.priestsContainer}>
      <h2 style={styles.priestsTitle}>Parish Priests</h2>
      <div style={styles.priestsGrid}>
        {priestsToDisplay.map((priest) => (
          <div key={priest._id} style={styles.priestBox}>
            <img
              src={priest.image?.url || "/placeholder-priest.png"}
              alt={priest.nickName || "Priest"}
              style={styles.priestImage}
            />
            <div style={styles.priestName}>{priest.nickName || "Unknown"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priests, setPriests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);
  const [currentPinnedPage, setCurrentPinnedPage] = useState(0);
  const itemsPerPage = 4;
  const navigate = useNavigate();

  const bannerImages = [
    `${process.env.PUBLIC_URL}/EParokya-SampleBanner.png`,
    `${process.env.PUBLIC_URL}/EParokya2-SampleBanner.png`,
  ];
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const pinnedAnnouncements = useMemo(
    () => announcements.filter((a) => a.isFeatured),
    [announcements]
  );

  useEffect(() => {
    if (pinnedAnnouncements.length <= itemsPerPage) return;

    const totalPages = Math.ceil(pinnedAnnouncements.length / itemsPerPage);

    const interval = setInterval(() => {
      setCurrentPinnedPage((prev) => (prev + 1) % totalPages);
    }, 4000);

    return () => clearInterval(interval);
  }, [pinnedAnnouncements]);

  useEffect(() => {
    fetchAnnouncements();
    fetchCategories();
    fetchPriests();
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
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  const fetchPriests = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllPriest`
      );
      console.log("Priests API Response:", response.data);
      setPriests(response.data.priests || []);
    } catch (err) {
      console.error("Error fetching priests:", err);
      setPriests([]);
    }
  };

  const goNext = () => {
    const totalPages = Math.ceil(pinnedAnnouncements.length / itemsPerPage);
    setCurrentPinnedPage((prev) => (prev + 1) % totalPages);
  };

  const goPrev = () => {
    const totalPages = Math.ceil(pinnedAnnouncements.length / itemsPerPage);
    setCurrentPinnedPage((prev) => (prev - 1 + totalPages) % totalPages);
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

  const displayedAnnouncements = filteredAnnouncements.filter(
    (announcement) => {
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
    }
  );

 if (loading) {
  return <Loader />;
}


 return (
  <div style={styles.homeContainer}>
    <MetaData title="Home" />
    <div style={styles.contentContainer}>
      <GuestSideBar />

      {/* Main content and right sidebar */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Main Content */}
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

          {/* Pinned Announcements */}
          {pinnedAnnouncements.length > 0 && (
            <PinnedAnnouncements
              pinnedAnnouncements={pinnedAnnouncements}
              goPrev={goPrev}
              goNext={goNext}
              currentPinnedIndex={currentPinnedIndex}
            />
          )}

          {/* Parish Priests */}
          {priests.length > 0 && <ParishPriests priests={priests} />}

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
            {displayedAnnouncements.length > 0 ? (
              displayedAnnouncements.map((announcement) => (
                <div
                  key={announcement._id}
                  style={{
                    ...styles.announcementCard,
                    border: announcement.isFeatured ? "3px solid gold" : "none",
                  }}
                  onClick={() => handleCardClick(announcement._id)}
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

                    <h2 style={styles.announcementTitle}>
                      {announcement.name}
                    </h2>
                    <p style={styles.announcementDescription}>
                      {announcement.description}
                    </p>

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

        {/* Right side: Mass Readings */}
        <div>
          <MassReadingsCard />
        </div>
      </div>
    </div>
  </div>
);
};

const styles = {
  homeContainer: { display: "flex" },
  contentContainer: {
    display: "flex",
    width: "100%",
    backgroundColor: "#f9f9f9",
  },
  mainContent: { flex: 1, padding: "20px" },
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
  cardContent: {},
  userInfo: { display: "flex", alignItems: "center", marginBottom: "10px" },
  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  userName: { fontWeight: "bold" },
  announcementTitle: { margin: "10px 0", fontSize: "24px" },
  announcementDescription: { margin: "10px 0", fontSize: "16px" },
  imageSliderContainer: {
    width: "100%",
    height: "300px",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },
  sliderWrapper: { width: "100%", height: "100%", position: "relative" },
  announcementImage: { width: "100%", height: "100%", objectFit: "cover" },
  announcementCategory: { marginTop: "10px", fontWeight: "bold" },
  tags: { color: "#666", fontSize: "14px" },
  reactionsContainer: { display: "flex", gap: "10px", marginTop: "10px" },
  reaction: { display: "flex", alignItems: "center", gap: "5px" },
  sliderButtonLeft: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
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
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
  },
  pinnedContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },

  pinnedWrapper: {
    display: "flex",
    overflow: "hidden",
    justifyContent: "flex-start",
    gap: "15px",
    maxWidth: "80%",
    position: "relative",
  },
  pinnedBox: {
    position: "relative",
    width: "250px",
    height: "180px",
    borderRadius: "8px",
    overflow: "hidden",
    textAlign: "left",
    cursor: "pointer",
    flexShrink: 0,
  },

  pinnedImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.8,
  },

  pinnedTitle: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
  },

  arrowButton: {
    backgroundColor: "#3a5a40",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    margin: "0 15px",
  },
  priestsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },

  priestBox: {
    textAlign: "center",
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },

  priestImage: {
    width: "100%",
    maxWidth: "200px",
    aspectRatio: "1",
    objectFit: "cover",
    borderRadius: "10px",
  },

  priestName: {
    marginTop: "10px",
    fontWeight: "bold",
  },
};

export default Home;
