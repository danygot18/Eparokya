import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  CssBaseline,
  Toolbar,
  IconButton,
  Box,
  Modal,
  Button,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import RateReviewIcon from "@mui/icons-material/RateReview";
import {
  FaHome,
  FaCalendarAlt,
  FaPray,
  FaCog,
  FaRegFileAlt,
  FaWpforms,
  FaBook,
  FaHeart,
} from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";

const drawerWidth = 240;
const collapsedWidth = 72;

const GuestSideBar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState(null);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    checkForActiveFeedbackForm();
  }, []);

  const checkForActiveFeedbackForm = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin-selections/active`
      );
      if (response.data && response.data.isActive) {
        setActiveFeedback(response.data);
      }
    } catch (error) {
      console.error("Error fetching active feedback form:", error);
    }
  };

  const handleNavigateToSentiment = () => {
    if (activeFeedback) {
      let path = "";
      switch (activeFeedback.category) {
        case "priest":
          path = "/user/PriestSentiment";
          break;
        case "event":
          path = "/user/EventSentiment";
          break;
        case "activities":
          path = "/user/ActivitySentiment";
          break;
        default:
          console.error("Invalid feedback category:", activeFeedback.category);
          return;
      }
      navigate(path, { state: { activeFeedback } });
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* This Toolbar pushes the Drawer below the header (fixes overlap) */}
      <Toolbar />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerOpen ? drawerWidth : collapsedWidth,
            transition: "width 0.3s",
            overflowX: "hidden",
            boxSizing: "border-box",
            backgroundColor: "#d6e7c6",
            p: 2,
            marginTop: "70px", 
            height: "calc(100% - 64px)", 
            zIndex: 1, 
          },
        }}
      >
        {/* Drawer Toggle Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            {drawerOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Profile Section */}
          <div style={styles.profileContainer}>
            <img
              src={
                user && user.avatar
                  ? user.avatar.url
                  : `${process.env.PUBLIC_URL}/EPAROKYA-SYST.png`
              }
              alt={`${user && user.name ? user.name : "Guest"}'s profile`}
              style={styles.profilePicture}
            />
            {drawerOpen && (
              <h2 style={styles.welcomeText}>
                Hello {user && user.name ? user.name : "Guest"}!
              </h2>
            )}
          </div>

          {/* Menu */}
          <ul style={styles.menuList}>
            <li style={styles.menuItem}>
              <Link
                to="/"
                style={{
                  ...styles.link,
                  ...(location.pathname === "/" ? styles.activeLink : {}),
                  justifyContent: drawerOpen ? "flex-start" : "center", // Center icon when collapsed
                }}
              >
                <FaHome style={styles.icon} /> {drawerOpen && "Home"}
              </Link>
            </li>

            <li style={styles.menuItem}>
              <Link
                to="/resourcePage"
                style={{
                  ...styles.link,
                  ...(location.pathname === "/resourcePage"
                    ? styles.activeLink
                    : {}),
                  justifyContent: drawerOpen ? "flex-start" : "center",
                }}
              >
                <FaBook style={styles.icon} /> {drawerOpen && "Resources"}
              </Link>
            </li>

            <li style={styles.menuItem}>
              <Link
                to="/user/prayerWall"
                style={{
                  ...styles.link,
                  ...(location.pathname === "/user/prayerWall"
                    ? styles.activeLink
                    : {}),
                  justifyContent: drawerOpen ? "flex-start" : "center",
                }}
              >
                <FaPray style={styles.icon} /> {drawerOpen && "Prayers"}
              </Link>
            </li>

            <li style={styles.menuItem}>
              <Link
                to="/user/calendar"
                style={{
                  ...styles.link,
                  ...(location.pathname === "/user/calendar"
                    ? styles.activeLink
                    : {}),
                  justifyContent: drawerOpen ? "flex-start" : "center",
                }}
              >
                <FaCalendarAlt style={styles.icon} /> {drawerOpen && "Calendar"}
              </Link>
            </li>

            <li style={styles.menuItem}>
              <Link
                to="/weddingWall"
                style={{
                  ...styles.link,
                  ...(location.pathname === "/weddingWall"
                    ? styles.activeLink
                    : {}),
                  justifyContent: drawerOpen ? "flex-start" : "center",
                }}
              >
                <FaHeart style={styles.icon} /> {drawerOpen && "Wedding"}
              </Link>
            </li>

            <li style={styles.menuItem}>
              <Link
                to="/user/NavigationForms"
                style={{
                  ...styles.link,
                  ...(location.pathname === "/user/NavigationForms"
                    ? styles.activeLink
                    : {}),
                  justifyContent: drawerOpen ? "flex-start" : "center",
                }}
              >
                <FaWpforms style={styles.icon} /> {drawerOpen && "Request"}
              </Link>
            </li>

            <li style={styles.menuItem}>
              <Link
                to="/user/FormGuides"
                style={{
                  ...styles.link,
                  ...(location.pathname === "/user/FormGuides"
                    ? styles.activeLink
                    : {}),
                  justifyContent: drawerOpen ? "flex-start" : "center",
                }}
              >
                <FaRegFileAlt style={styles.icon} /> {drawerOpen && "Guide"}
              </Link>
            </li>
          </ul>

          {/* Bottom Section */}
          <ul style={{ ...styles.menuList, marginTop: "auto" }}>
            <li style={styles.menuItem}>
              <Button 
                color="success" 
                onClick={handleOpen}
                style={{
                  ...styles.button,
                  justifyContent: drawerOpen ? "flex-start" : "center", // Center icon when collapsed
                }}
              >
                <RateReviewIcon style={styles.icon} />
                {drawerOpen && "Feedback"}
              </Button>
              <Modal open={open} onClose={handleClose}>
                <Box sx={styles.modal}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    align="center"
                    marginBottom={2}
                    fontWeight="bold"
                    color="success"
                  >
                    Active Feedback Form
                  </Typography>
                  {activeFeedback ? (
                    <>
                      <Typography style={styles.modalText}>
                        <strong>Category:</strong>{" "}
                        {activeFeedback.category || "N/A"}
                      </Typography>
                      <Typography style={styles.modalText}>
                        <strong>Date:</strong> {activeFeedback.date || "N/A"}
                      </Typography>
                      <Typography style={styles.modalText}>
                        <strong>Time:</strong> {activeFeedback.time || "N/A"}
                      </Typography>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<FaRegFileAlt />}
                        onClick={handleNavigateToSentiment}
                        sx={{
                          mt: 2,
                          px: 3,
                          py: 1,
                          fontWeight: "bold",
                          textTransform: "none",
                        }}
                      >
                        Go to Feedback Form
                      </Button>
                    </>
                  ) : (
                    <Typography>No active feedback form available.</Typography>
                  )}
                </Box>
              </Modal>
            </li>

            <li style={styles.menuItem}>
              <Link
                to="/sentimentReports"
                style={{
                  ...styles.link,
                  ...(location.pathname === "/sentimentReports"
                    ? styles.activeLink
                    : {}),
                  justifyContent: drawerOpen ? "flex-start" : "center",
                }}
              >
                <FaCog style={styles.icon} /> {drawerOpen && "Reports"}
              </Link>
            </li>
          </ul>
        </Box>
      </Drawer>
    </Box>
  );
};

// Updated styles for better collapsed state
const styles = {
  profileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "24px",
    gap: "8px",
  },
  profilePicture: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
    border: "3px solid #93c47d",
  },
  welcomeText: {
    color: "#26562e",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    color: "#26562e",
    textDecoration: "none",
    borderRadius: "8px",
    transition: "background-color 0.3s, justify-content 0.3s", // Added justify-content transition
    width: "100%", // Ensure full width for centering
  },
  activeLink: {
    backgroundColor: "#93c47d",
    color: "#154314",
    fontWeight: "bold",
  },
  icon: {
    marginRight: "12px",
    fontSize: "15px",
    color: "#154314",
    flexShrink: 0, // Prevent icon from shrinking
  },
  menuList: {
    listStyleType: "none",
    padding: 0,
  },
  menuItem: {
    marginBottom: "12px",
    display: "flex",
    justifyContent: "center", // Center the link/button when collapsed
  },
  button: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    color: "#26562e",
    textDecoration: "none",
    borderRadius: "8px",
    transition: "background-color 0.3s, justify-content 0.3s",
    width: "100%",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: 300, sm: 400 },
    bgcolor: "background.paper",
    border: "2px solid #93c47d",
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
  },
  modalText: {
    marginBottom: "12px",
    color: "#26562e",
    fontSize: "15px",
  },
};

export default GuestSideBar;
