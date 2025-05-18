import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  List,
  ListItem,
  Typography,
  Card,
  CardContent,
  Button,
  Modal,
  Box,
  Grid,
  Avatar,
  TextField,
} from "@mui/material";
import GuestSideBar from "../../GuestSideBar";
import "./MinistryAnnouncementLayout/ministryAnnouncement.css";
import eparokyaLogo from "../../../assets/images/EPAROKYA-SYST.png";
import { useSelector } from "react-redux";

const MinistryAnnouncement = () => {
  const [ministryCategoryId, setMinistryCategoryId] = useState(null);
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [ministryCategory, setMinistryCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const config = { withCredentials: true };

  // Helper function to check if user has acknowledged a post
  const hasUserAcknowledged = (announcement) => {
    if (!user || !announcement.acknowledgedBy) return false;
    return announcement.acknowledgedBy.some(
      (userObj) => userObj._id.toString() === user._id.toString()
    );
  };

  useEffect(() => {
    const fetchUserMinistries = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/userMinistries`,
          config
        );
        console.log("Fetched user ministries:", response.data);

        if (response.data.length > 0 && response.data[0].ministryId) {
          setMinistryCategories(response.data);
          console.log("Ministry categories:", response.data);
          setMinistryCategoryId(response.data[0].ministryId);
        } else {
          console.warn("No ministries found or invalid data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user ministries:", error);
      }
    };

    fetchUserMinistries();
  }, []);

  useEffect(() => {
    if (!ministryCategoryId || ministryCategoryId === "undefined") {
      console.warn("Invalid ministryCategoryId", ministryCategoryId);
      return;
    }

    const fetchAll = async () => {
      await fetchPinnedAnnouncements(ministryCategoryId);
      await fetchAnnouncements(ministryCategoryId);
      await fetchMinistryUsers(ministryCategoryId);
    };

    fetchAll();
  }, [ministryCategoryId, user]);

  const fetchMinistryUsers = async (id) => {
    if (!id || id === "undefined") return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/${id}/getUsers`
      );
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPinnedAnnouncements = async (id) => {
    if (!id || id === "undefined") return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/pinnedMinistryAnnouncement/${id}`
      );
      setPinnedAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching pinned announcements:", error);
    }
  };

  const fetchAnnouncements = async (id) => {
    if (!id || id === "undefined") return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getMinistryAnnouncements/${id}`
      );
      setAnnouncements(response.data.filter((ann) => !ann.isPinned));
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleAcknowledgeClick = (announcement) => {
    if (hasUserAcknowledged(announcement)) return;
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleConfirmAcknowledge = async () => {
    if (!selectedAnnouncement || !user?._id) {
      setIsModalOpen(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/acknowledgeMinistryAnnouncement/${selectedAnnouncement._id}`,
        { user: user._id },
        config
      );

      // Refresh the announcements to get updated data
      await fetchPinnedAnnouncements(ministryCategoryId);
      await fetchAnnouncements(ministryCategoryId);
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error acknowledging announcement:", error);
    }
  };

  const handleMinistryClick = (id) => {
    setMinistryCategoryId(id);
  };

  const filteredUsers = users.filter((user) => {
    const lowerSearch = searchTerm.toLowerCase();
    const nameMatch = user.name.toLowerCase().includes(lowerSearch);
    const roleMatch = user.ministryRoles?.some((ministryRole) => {
      const role =
        ministryRole.role === "Others"
          ? ministryRole.customRole || "others"
          : ministryRole.role || "member";
      return role.toLowerCase().includes(lowerSearch);
    });
    return nameMatch || roleMatch;
  });

  return (
    <Container>
      <div className="content-container">
        {/* Left Section: Announcements and Pinned Announcements */}
        <div className="main-content">
          {/* Pinned Announcements */}
          {pinnedAnnouncements.length > 0 && (
            <div className="pinned-container">
              <Typography variant="h6">Pinned Announcements</Typography>
              {pinnedAnnouncements.map((announcement) => {
                const isAcknowledged = hasUserAcknowledged(announcement);
                return (
                  <Card key={announcement._id} className="announcement">
                    <CardContent>
                      <Typography variant="h6">{announcement.title}</Typography>
                      <Typography variant="body2">
                        {announcement.description}
                      </Typography>

                      {announcement.images?.length > 0 && (
                        <div className="announcement-images">
                          {announcement.images.map((image, index) => (
                            <img
                              key={index}
                              src={image.url}
                              alt={`Announcement Image ${index}`}
                              className="announcement-image-slider"
                            />
                          ))}
                        </div>
                      )}

                      {announcement.tags?.length > 0 && (
                        <Typography variant="body2" className="announcement-tags">
                          <strong>Tags:</strong> {announcement.tags.join(", ")}
                        </Typography>
                      )}

                      <Typography variant="body2">
                        <strong>Ministry Category:</strong>{" "}
                        {announcement.ministryCategory?.name || "N/A"}
                      </Typography>

                      <Typography variant="body2">
                        <strong>Acknowledge Count:</strong>{" "}
                        {announcement.acknowledgeCount}
                      </Typography>

                      {announcement.notedBy?.length > 0 && (
                        <Typography variant="body2">
                          <strong>Noted By:</strong>{" "}
                          {announcement.notedBy.join(", ")}
                        </Typography>
                      )}

                      <Typography variant="body2">
                        <strong>Date Created:</strong>{" "}
                        {new Date(announcement.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </Typography>

                      <Button
                        variant="contained"
                        fullWidth
                        style={{
                          backgroundColor: isAcknowledged ? "#ccc" : "#1976d2",
                          color: isAcknowledged ? "#666" : "#fff",
                          cursor: isAcknowledged ? "not-allowed" : "pointer",
                        }}
                        disabled={isAcknowledged}
                        onClick={() => handleAcknowledgeClick(announcement)}
                      >
                        {isAcknowledged ? "Already Acknowledged" : "Acknowledge"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Other Announcements */}
          <div className="other-announcements">
            <Typography variant="h6">Announcements</Typography>
            {announcements.map((announcement) => {
              const isAcknowledged = hasUserAcknowledged(announcement);
              return (
                <Card key={announcement._id} className="announcement">
                  <CardContent>
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
                      {announcement.images?.length > 0 && (
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
                      )}

                      <p>
                        <strong>Description:</strong> {announcement.description}
                      </p>
                      {announcement.tags?.length > 0 && (
                        <p className="announcement-tags">
                          <strong>Tags:</strong> {announcement.tags.join(", ")}
                        </p>
                      )}
                      <p>
                        <strong>Ministry Category:</strong>{" "}
                        {announcement.ministryCategory?.name}
                      </p>
                      <p>
                        <strong>Acknowledge Count:</strong>{" "}
                        {announcement.acknowledgeCount}
                      </p>
                      {announcement.notedBy?.length > 0 && (
                        <p>
                          <strong>Noted By:</strong>{" "}
                          {announcement.notedBy.join(", ")}
                        </p>
                      )}
                      <p>
                        <strong>Date Created:</strong>{" "}
                        {new Date(announcement.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>

                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isAcknowledged}
                        onClick={() => handleAcknowledgeClick(announcement)}
                        fullWidth
                      >
                        {isAcknowledged ? "Acknowledged" : "Acknowledge"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Ministry List & Ministry Members */}
        <div className="right-sidebar">
          {/* Ministry List */}
          <div className="ministry-list">
            <Typography variant="h5">Your Ministries</Typography>
            <List>
              {ministryCategory.map((ministry) => (
                <ListItem
                  key={ministry._id}
                  button
                  onClick={() => handleMinistryClick(ministry._id)}
                >
                  {ministry.ministryName}
                </ListItem>
              ))}
            </List>
          </div>

          {/* Ministry Members */}
          <div className="usersMinistry-container">
            <Typography variant="h6">Ministry Members</Typography>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: "10px" }}
            />

            <List>
              {filteredUsers.map((user) => (
                <ListItem key={user._id} className="userMinistry-item">
                  <Avatar src={user.avatar} alt={user.name} />
                  <div style={{ marginLeft: "10px" }}>
                    <Typography>{user.name}</Typography>
                    {user.ministryRoles?.length > 0 ? (
                      user.ministryRoles.map((ministryRole, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          color="textSecondary"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {ministryRole.role === "Others"
                            ? ministryRole.customRole || "Others"
                            : ministryRole.role || "Member"}
                        </Typography>
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Member
                      </Typography>
                    )}
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div>

      {/* Acknowledge Confirmation Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box className="modal-content">
          <Typography variant="h6">
            Are you sure you have read the announcement?
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmAcknowledge}
          >
            Yes
          </Button>
          <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
            Read Again
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default MinistryAnnouncement;