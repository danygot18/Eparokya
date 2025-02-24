import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./MinistryAnnouncementLayout/ministryAnnouncement.css";

const MinistryAnnouncement = () => {
  const [ministryCategoryId, setMinistryCategoryId] = useState(null);
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [ministryCategory, setMinistryCategories] = useState([]); // Store user's ministries
  const [acknowledged, setAcknowledged] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const navigate = useNavigate();
  const config = {
    withCredentials: true,
  };

  console.log("Ministry Category ID:", ministryCategoryId);

  useEffect(() => {
    const fetchUserMinistries = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/userMinistries`,
          config
        );
        console.log("User Ministries:", response.data);

        if (response.data.length > 0) {
          setMinistryCategories(response.data); // Store all ministries
          setMinistryCategoryId(response.data[0]._id); // Set first ministry ID
        }
      } catch (error) {
        console.error("Error fetching user ministries:", error);
      }
    };

    fetchUserMinistries();
  }, []); // Fetch user ministries once when the component mounts

  useEffect(() => {
    if (!ministryCategoryId) return; // Ensure ministryCategoryId is set before fetching

    const fetchPinnedAnnouncements = async () => {
      try {
        console.log("Fetching pinned announcements for:", ministryCategoryId);
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/pinnedMinistryAnnouncement/${ministryCategoryId}`
        );
        console.log("Pinned Announcements:", response.data);
        setPinnedAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching pinned announcements:", error);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getMinistryAnnouncements/${ministryCategoryId}`
        );
        setAnnouncements(response.data.filter((ann) => !ann.isPinned));
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchPinnedAnnouncements();
    fetchAnnouncements();
  }, [ministryCategoryId]);

  const handleAcknowledgeClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleConfirmAcknowledge = () => {
    if (selectedAnnouncement) {
      setAcknowledged((prev) => ({
        ...prev,
        [selectedAnnouncement._id]: true,
      }));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="ministry-announcement">
      {/* Ministries List */}
      <div className="ministry-list">
        <h2>Your Ministries</h2>
        <ul>
          {ministryCategory.map((ministryCategory) => (
            <li
              key={ministryCategory._id}
              onClick={() => navigate(`/ministry/${ministryCategory._id}`)}
            >
              {ministryCategory.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="pinned-container">
          <h2>Pinned Announcements</h2>
          {pinnedAnnouncements.map((announcement) => (
            <div key={announcement._id} className="announcement pinned">
              <span className="pinned-label">Pinned</span>
              <h3>{announcement.title}</h3>
              <p>
                <strong>Description:</strong> {announcement.description}
              </p>
              <div className="announcement-images">
                {announcement.images.map((img, index) => (
                  <img key={index} src={img.url} alt={`Pinned ${index}`} />
                ))}
              </div>
              <p>
                <strong>Noted By:</strong> {announcement.notedBy}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(announcement.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Other Announcements */}
      <div className="userMinistryAnnouncement">
        <h2>Other Announcements</h2>
        {announcements.map((announcement) => (
          <div key={announcement._id} className="announcement">
            <h3>{announcement.title}</h3>
            <p>
              <strong>Description:</strong> {announcement.description}
            </p>
            <div className="announcement-images">
              {announcement.images.map((img, index) => (
                <img key={index} src={img.url} alt={`Announcement ${index}`} />
              ))}
            </div>
            <p>
              <strong>Noted By:</strong> {announcement.notedBy}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(announcement.createdAt).toLocaleDateString()}
            </p>
            <button
              className={`acknowledge-btn ${
                acknowledged[announcement._id] ? "disabled" : ""
              }`}
              onClick={() => handleAcknowledgeClick(announcement)}
              disabled={acknowledged[announcement._id]}
            >
              {acknowledged[announcement._id] ? "Acknowledged" : "Acknowledge"}
            </button>
          </div>
        ))}
      </div>

      {/* Acknowledge Confirmation Modal */}
      {isModalOpen && selectedAnnouncement && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you have read the announcement?</h3>
            <p>
              Sigurado ka ba na iyong nabasa na ang announcement at iyong
              iaacknowledge?
            </p>
            <div className="modal-buttons">
              <button className="yes-btn" onClick={handleConfirmAcknowledge}>
                Yes
              </button>
              <button
                className="read-again-btn"
                onClick={() => setIsModalOpen(false)}
              >
                Read Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinistryAnnouncement;
