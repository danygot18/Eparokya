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
    <Container maxWidth="xl" sx={{ mt: 10 }}>
      <Grid container spacing={3}>
       
        <Grid item xs={12} md={8}>
          {/* Pinned Announcements */}
          {pinnedAnnouncements.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Pinned Announcements
              </Typography>
              {pinnedAnnouncements.map((announcement) => {
                const isAcknowledged = hasUserAcknowledged(announcement);
                return (
                  <Card key={announcement._id} sx={{ my: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{announcement.title}</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {announcement.description}
                      </Typography>

                      {announcement.images?.length > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          {announcement.images.map((image, index) => (
                            <Box
                              key={index}
                              component="img"
                              src={image.url}
                              alt={`Announcement ${index}`}
                              sx={{
                                width: "100%",
                                maxWidth: 400,
                                borderRadius: 2,
                                objectFit: "cover",
                              }}
                            />
                          ))}
                        </Box>
                      )}

                      {announcement.tags?.length > 0 && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
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
                          { month: "long", day: "numeric", year: "numeric" }
                        )}
                      </Typography>

                      <Button
                        variant="contained"
                        fullWidth
                        disabled={isAcknowledged}
                        onClick={() => handleAcknowledgeClick(announcement)}
                        sx={{
                          mt: 1.5,
                          backgroundColor: isAcknowledged
                            ? "#ccc"
                            : "primary.main",
                          color: isAcknowledged ? "#666" : "#fff",
                          cursor: isAcknowledged ? "not-allowed" : "pointer",
                        }}
                      >
                        {isAcknowledged ? "Acknowledged" : "Acknowledge"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}

          {/* Other Announcements */}
          <Typography variant="h6" fontWeight="bold">
            Announcements
          </Typography>
          {announcements.map((announcement) => {
            const isAcknowledged = hasUserAcknowledged(announcement);
            return (
              <Card key={announcement._id} sx={{ my: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      component="img"
                      src={eparokyaLogo}
                      alt="Saint Joseph Parish - Taguig"
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        mr: 2,
                        objectFit: "cover",
                      }}
                    />
                    <Typography variant="h6">{announcement.title}</Typography>
                  </Box>

                  {announcement.images?.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: "center",
                        mb: 1,
                      }}
                    >
                      {announcement.images.map((image, index) => (
                        <Box
                          key={index}
                          component="img"
                          src={image.url}
                          alt={`Announcement ${index}`}
                          sx={{
                            width: "100%",
                            maxWidth: 400,
                            borderRadius: 2,
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Description:</strong> {announcement.description}
                  </Typography>

                  {announcement.tags?.length > 0 && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Tags:</strong> {announcement.tags.join(", ")}
                    </Typography>
                  )}

                  <Typography variant="body2">
                    <strong>Ministry Category:</strong>{" "}
                    {announcement.ministryCategory?.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Acknowledge Count:</strong>{" "}
                    {announcement.acknowledgeCount}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Date Created:</strong>{" "}
                    {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isAcknowledged}
                    onClick={() => handleAcknowledgeClick(announcement)}
                    fullWidth
                    sx={{ mt: 1.5 }}
                  >
                    {isAcknowledged ? "Acknowledged" : "Acknowledge"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Grid>

        {/* ================= SIDEBAR ================= */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#fafafa",
              boxShadow: 1,
            }}
          >
            <Typography variant="h5" sx={{ mb: 1 }}>
              Your Ministries
            </Typography>
            <List>
              {ministryCategory.map((ministry) => (
                <ListItem
                  key={ministry.ministryId}
                  button
                  selected={ministryCategoryId === ministry.ministryId}
                  onClick={() => handleMinistryClick(ministry.ministryId)}
                  sx={{
                    backgroundColor:
                      ministryCategoryId === ministry.ministryId
                        ? "#e3f2fd"
                        : "transparent",
                    mb: 1,
                    borderRadius: 1,
                  }}
                >
                  {ministry.ministryName}
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" sx={{ mt: 3 }}>
              Ministry Members
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />
            <List>
              {filteredUsers.map((user) => (
                <ListItem key={user._id}>
                  <Avatar src={user.avatar} alt={user.name} />
                  <Box sx={{ ml: 1 }}>
                    <Typography>{user.name}</Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {user.ministryRoles?.length > 0
                        ? user.ministryRoles
                          .map((role) =>
                            role.role === "Others"
                              ? role.customRole || "Others"
                              : role.role || "Member"
                          )
                          .join(", ")
                        : "Member"}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>

      {/* MODAL */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "white",
            boxShadow: 3,
            maxWidth: 400,
            mx: "auto",
            mt: "20vh",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Are you sure you have read the announcement?
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmAcknowledge}
            sx={{ mr: 1 }}
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