import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SideBar from "../SideBar";
import "./ministryCategoryDetails.css";
import eparokyaLogo from "../../../assets/images/EPAROKYA-SYST.png";
import { FaEdit, FaTrash } from "react-icons/fa";

const MinistryCategoryDetails = () => {
  const { id: ministryCategoryId } = useParams();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    title: "",
    description: "",
    tags: "",
    notedBy: "",
    isPinned: false,
    images: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const config = {
    withCredentials: true,
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!ministryCategoryId) return;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/${ministryCategoryId}/getUsers`
        );
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [ministryCategoryId]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getMinistryAnnouncements/${ministryCategoryId}`
        );
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAnnouncementData({ ...announcementData, images: file });
    setImagePreview(URL.createObjectURL(file));
  };

const handleDelete = async (announcementId) => {
  if (!window.confirm("Are you sure you want to delete this announcement?")) return;

  try {
    await axios.delete(
      `${process.env.REACT_APP_API}/api/v1/deleteMinistryAnnouncement/${announcementId}`, 
      config
    );

    setAnnouncements((prev) => prev.filter((a) => a._id !== announcementId));

  } catch (error) {
    console.error("Error deleting announcement:", error);
  }
};

const handleEdit = (announcement) => {
  setAnnouncementData({
    title: announcement.title,
    description: announcement.description,
    tags: announcement.tags.join(", "),     
    notedBy: announcement.notedBy.join(", "), 
    isPinned: announcement.isPinned,
    images: null,
  });

  setSelectedAnnouncement(announcement);
  setIsEditMode(true);
  setIsModalOpen(true);
};



  const confirmPinToggle = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsPinModalOpen(true);
  };

  const togglePin = async () => {
    if (!selectedAnnouncement) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/${selectedAnnouncement._id}/togglePin`
      );

      setAnnouncements((prev) =>
        prev.map((ann) =>
          ann._id === selectedAnnouncement._id
            ? { ...ann, isPinned: response.data.isPinned }
            : ann
        )
      );

      setIsPinModalOpen(false);
      setSelectedAnnouncement(null);
    } catch (error) {
      console.error("Error updating pin status:", error);
    }
  };


   const handleSubmit = async () => {
    if (
      !announcementData.title ||
      !announcementData.description ||
      !announcementData.tags.length ||
      !announcementData.notedBy.length
    ) {
      alert("All fields are required.");
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(announcementData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, value);
        }
      });

      formData.append("ministryCategory", ministryCategoryId);
      if (announcementData.images) {
        formData.append("images", announcementData.images);
      }

      if (isEditMode && selectedAnnouncement) {
      
        await axios.put(
          `${process.env.REACT_APP_API}/api/v1/updateMinistryAnnouncement/${selectedAnnouncement._id}`,
          formData,
          { withCredentials: true }
        );

        setAnnouncements((prev) =>
          prev.map((ann) =>
            ann._id === selectedAnnouncement._id
              ? {
                  ...ann,
                  title: announcementData.title,
                  description: announcementData.description,
                  tags: announcementData.tags.split(",").map((tag) => tag.trim()),
                  notedBy: announcementData.notedBy.split(",").map((noted) => noted.trim()),
                  isPinned: announcementData.isPinned,
                }
              : ann
          )
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API}/api/v1/ministryAnnouncementCreate/${ministryCategoryId}`,
          formData,
          { withCredentials: true }
        );
       
      }

      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedAnnouncement(null);
      setAnnouncementData({
        title: "",
        description: "",
        tags: "",
        notedBy: "",
        isPinned: false,
        images: null,
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Error submitting announcement:", error);
    }
  };


  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
     <div className="ministry-category-details">
      <SideBar />

      <div className="ministryCategoryDetails-middlePane">
        <button className="add-announcement-btn" onClick={() => {
          setIsModalOpen(true);
          setIsEditMode(false);
          setAnnouncementData({
            title: "",
            description: "",
            tags: "",
            notedBy: "",
            isPinned: false,
            images: null,
          });
          setImagePreview(null);
          setSelectedAnnouncement(null);
        }}>
          Add Announcement
        </button>

        {isModalOpen && (
          <div className="announcement-modal">
            <h3>{isEditMode ? "Edit Announcement" : "Announcement"}</h3>
            <input
              type="text"
              placeholder="Title"
              value={announcementData.title}
              onChange={(e) =>
                setAnnouncementData({
                  ...announcementData,
                  title: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Description"
              value={announcementData.description}
              onChange={(e) =>
                setAnnouncementData({
                  ...announcementData,
                  description: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={announcementData.tags}
              onChange={(e) =>
                setAnnouncementData({
                  ...announcementData,
                  tags: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Noted By"
              value={announcementData.notedBy}
              onChange={(e) =>
                setAnnouncementData({
                  ...announcementData,
                  notedBy: e.target.value,
                })
              }
            />
            <button
              className={`pin-btn ${
                announcementData.isPinned ? "pinned" : "unpinned"
              }`}
              onClick={() =>
                setAnnouncementData({
                  ...announcementData,
                  isPinned: !announcementData.isPinned,
                })
              }
            >
              {announcementData.isPinned ? "Pinned" : "Unpinned"}
            </button>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            )}
            <div className="modal-buttons">
              <button className="submit-btn" onClick={handleSubmit}>
                {isEditMode ? "Update" : "Submit"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setSelectedAnnouncement(null);
                  setAnnouncementData({
                    title: "",
                    description: "",
                    tags: "",
                    notedBy: "",
                    isPinned: false,
                    images: null,
                  });
                  setImagePreview(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="announcements-list">
          {announcements
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((announcement) => (
              <div
                key={announcement._id}
                className={`announcement-item ${
                  announcement.isPinned ? "pinned" : ""
                }`}
                style={{ position: "relative" }}
              >
                {/* Edit & Delete icons at upper right */}
                <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: "8px", cursor: "pointer" }}>
                  <FaEdit
                    title="Edit"
                    onClick={() => handleEdit(announcement)}
                    style={{ fontSize: "1.1rem" }}
                  />
                  <FaTrash
                    title="Delete"
                    onClick={() => handleDelete(announcement._id)}
                    style={{ fontSize: "1.1rem" }}
                  />
                </div>

                <div className="announcement-header">
                  <img
                    src={eparokyaLogo}
                    alt="Saint Joseph Parish - Taguig"
                    className="announcement-image"
                  />
                  <div className="announcement-title">
                    <strong>{announcement.title}</strong>
                  </div>
                </div>
                <div className="announcement-body">
                  <div className="announcement-images">
                    {announcement.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Announcement ${index}`}
                        className="announcement-image-slider"
                      />
                    ))}
                  </div>
                  <p>
                    <strong>Description:</strong> {announcement.description}
                  </p>
                  <p className="announcement-tags">
                    <strong>Tags:</strong> {announcement.tags.join(", ")}
                  </p>
                  <p>
                    <strong>Ministry Category:</strong>{" "}
                    {announcement.ministryCategory.name}
                  </p>
                  <p>
                    <strong>Acknowledge Count:</strong>{" "}
                    {announcement.acknowledgeCount}
                  </p>
                  <p>
                    <strong>Noted By:</strong> {announcement.notedBy.join(", ")}
                  </p>
                  <button
                    className={`pin-btn ${
                      announcement.isPinned ? "pinned" : "unpinned"
                    }`}
                    onClick={() => confirmPinToggle(announcement)}
                  >
                    {announcement.isPinned ? "Unpin" : "Pin"}
                  </button>
                  {announcement.isPinned && (
                    <span className="pinned-indicator">Pinned</span>
                  )}

                  <p>
                    <strong>Date Created:</strong>{" "}
                    {new Date(announcement.createdAt).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" }
                    )}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {isPinModalOpen && selectedAnnouncement && (
        <div className="pin-modal">
          <div className="pin-modal-content">
            <h3>Pin this announcement?</h3>
            <p>
              "{selectedAnnouncement.title}" -{" "}
              {selectedAnnouncement.ministryCategory.name}
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={togglePin}>
                Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsPinModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="user-list-container">
        <h3 className="user-list-title">Members</h3>
        <input
          type="text"
          placeholder="Search user..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="user-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="user-item">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                />
                <span className="user-name">{user.name}</span>
              </div>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinistryCategoryDetails;
