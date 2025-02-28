import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, List, ListItem, Typography, Card, CardContent, Button, Modal, Box, Grid, Avatar, TextField, } from "@mui/material";
import GuestSideBar from "../../GuestSideBar";
import "./MinistryAnnouncementLayout/ministryAnnouncement.css";
import eparokyaLogo from "../../../assets/images/EPAROKYA-SYST.png";


const MinistryAnnouncement = () => {
  const [ministryCategoryId, setMinistryCategoryId] = useState(null);
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [ministryCategory, setMinistryCategories] = useState([]);
  const [acknowledged, setAcknowledged] = useState(new Set());  // Using Set for better performance
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [userId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const config = { withCredentials: true };


  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getUser`, config);
  //       setUserId(response.data._id);
  //     } catch (error) {
  //       console.error("Error fetching user ID:", error);
  //     }
  //   };

  //   fetchUserId();
  // }, []);


  // const fetchMinistryUsers = async (id) => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/${id}/getUsers`);
  //     console.log("Fetched users:", response.data);
  //     setUsers(Array.isArray(response.data) ? response.data : []);
  //   } catch (error) {
  //     console.error("Error fetching ministry users:", error);
  //     setUsers([]); // Set to empty array in case of error
  //   }
  // };

  const fetchMinistryUsers = async () => {
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
  

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const fetchPinnedAnnouncements = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/pinnedMinistryAnnouncement/${id}`);
      setPinnedAnnouncements(response.data);

      const acknowledgedSet = new Set(response.data.filter(a => a.acknowledgedBy.includes(userId)).map(a => a._id));
      setAcknowledged(acknowledgedSet);
    } catch (error) {
      console.error("Error fetching pinned announcements:", error);
    }
  };

  const fetchAnnouncements = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getMinistryAnnouncements/${id}`);
      setAnnouncements(response.data.filter((ann) => !ann.isPinned));

      const acknowledgedSet = new Set(response.data.filter(a => a.acknowledgedBy.includes(userId)).map(a => a._id));
      setAcknowledged(acknowledgedSet);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    const fetchUserMinistries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/userMinistries`, config);
        if (response.data.length > 0) {
          setMinistryCategories(response.data);
          setMinistryCategoryId(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching user ministries:", error);
      }
    };
    fetchUserMinistries();
  }, []);

  useEffect(() => {
    if (!ministryCategoryId) return;
    fetchPinnedAnnouncements(ministryCategoryId);
    fetchAnnouncements(ministryCategoryId);
    fetchMinistryUsers(ministryCategoryId);
  }, [ministryCategoryId, userId]);

  const handleAcknowledgeClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleConfirmAcknowledge = async () => {
    if (!selectedAnnouncement || !userId) return;
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/acknowledgeMinistryAnnouncement/${selectedAnnouncement._id}`,
        { userId },
        config
      );
      setAcknowledged((prev) => new Set(prev).add(selectedAnnouncement._id));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error acknowledging announcement:", error);
    }
  };

  const handleMinistryClick = (id) => {
    setMinistryCategoryId(id);
  };



  return (
    <Container className="ministry-announcement">
    <div className="content-container">
      {/* Left Section: Announcements and Pinned Announcements */}
      <div className="main-content">
        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div className="pinned-container">
            <Typography variant="h6">Pinned Announcements</Typography>
            {pinnedAnnouncements.map((announcement) => (
             <Card key={announcement._id} className="announcement">
             <CardContent>
               {/* Announcement Title and Description */}
               <Typography variant="h6">{announcement.title}</Typography>
               <Typography variant="body2">{announcement.description}</Typography>
           
               {/* Images (Optional) */}
               {announcement.images && announcement.images.length > 0 && (
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
           
               {/* Other Details */}
               {announcement.tags.length > 0 && (
                 <Typography variant="body2" className="announcement-tags">
                   <strong>Tags:</strong> {announcement.tags.join(", ")}
                 </Typography>
               )}
           
               <Typography variant="body2">
                 <strong>Ministry Category:</strong> {announcement.ministryCategory?.name || "N/A"}
               </Typography>
           
               <Typography variant="body2">
                 <strong>Acknowledge Count:</strong> {announcement.acknowledgeCount}
               </Typography>
           
               {announcement.notedBy.length > 0 && (
                 <Typography variant="body2">
                   <strong>Noted By:</strong> {announcement.notedBy.join(", ")}
                 </Typography>
               )}
           
               <Typography variant="body2">
                 <strong>Date Created:</strong>{" "}
                 {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                   month: "long",
                   day: "numeric",
                   year: "numeric",
                 })}
               </Typography>
           
               {/* Acknowledge Button */}
               <Button
                 variant="contained"
                 color="primary"
                 disabled={acknowledged.has(announcement._id)}
                 onClick={() => handleAcknowledgeClick(announcement)}
                 fullWidth
               >
                 {acknowledged.has(announcement._id) ? "Acknowledged" : "Acknowledge"}
               </Button>
             </CardContent>
           </Card>
           
            ))}
          </div>
        )}
  
        {/* Other Announcements */}
        <div className="other-announcements">
          <Typography variant="h6">Announcements</Typography>
          {announcements.map((announcement) => (
            <Card key={announcement._id} className="announcement">
              <CardContent>
                {/* Announcement Header */}
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
  
                {/* Announcement Body */}
                <div className="announcement-body">
                  {/* Image Slider */}
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
  
                  {/* Details */}
                  <p>
                    <strong>Description:</strong> {announcement.description}
                  </p>
                  <p className="announcement-tags">
                    <strong>Tags:</strong> {announcement.tags.join(", ")}
                  </p>
                  <p>
                    <strong>Ministry Category:</strong> {announcement.ministryCategory.name}
                  </p>
                  <p>
                    <strong>Acknowledge Count:</strong> {announcement.acknowledgeCount}
                  </p>
                  <p>
                    <strong>Noted By:</strong> {announcement.notedBy.join(", ")}
                  </p>
                  <p>
                    <strong>Date Created:</strong>{" "}
                    {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
  
                {/* Acknowledge Button */}
                <Button
                  variant="contained"
                  color="primary"
                  disabled={acknowledged.has(announcement._id)}
                  onClick={() => handleAcknowledgeClick(announcement)}
                  fullWidth
                >
                  {acknowledged.has(announcement._id) ? "Acknowledged" : "Acknowledge"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  
      {/* Right Sidebar: Ministry List & Ministry Members */}
      <div className="right-sidebar">
        {/* Ministry List */}
        <div className="ministry-list">
          <Typography variant="h5">Your Ministries</Typography>
          <List>
            {ministryCategory.map((ministry) => (
              <ListItem key={ministry._id} button onClick={() => handleMinistryClick(ministry._id)}>
                {ministry.name}
              </ListItem>
            ))}
          </List>
        </div>
  
        {/* Ministry Members */}
        <div className="usersMinistry-container">
          <Typography variant="h6">Ministry Members</Typography>
  
          {/* Search Bar */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
  
          {/* User List */}
          <List>
            {filteredUsers.map((user) => (
              <ListItem key={user._id} className="userMinistry-item">
                <Avatar src={user.avatar} alt={user.name} />
                <Typography>{user.name}</Typography>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  
    {/* Acknowledge Confirmation Modal */}
    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <Box className="modal-content">
        <Typography variant="h6">Are you sure you have read the announcement?</Typography>
        <Button variant="contained" color="success" onClick={handleConfirmAcknowledge}>Yes</Button>
        <Button variant="outlined" onClick={() => setIsModalOpen(false)}>Read Again</Button>
      </Box>
    </Modal>
  </Container>
  
  );
  
};

export default MinistryAnnouncement;
