import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaPray, FaBook, FaCog, FaRegFileAlt, FaWpforms, MdFeedback } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
  Modal, Box, Button, Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,

} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import axios from 'axios';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { ModalTitle } from 'react-bootstrap';

const GuestSideBar = () => {
  // const [users, setUser] = useState({
  //   name: 'Guest',
  //   avatar: 'default-profile-icon.png',
  // });
  const { user } = useSelector(state => state.auth);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [activeFeedback, setActiveFeedback] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    checkForActiveFeedbackForm();
  }, []);

  const checkForActiveFeedbackForm = async () => {

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin-selections/active`
      );

      console.log("API Response:", response.data);

      if (response.data && response.data.isActive) {
        setActiveFeedback(response.data);
        console.log("Active feedback found:", response.data);

        // TEMP FIX: Force show modal for debugging
        console.log("Forcing modal to open...");

      }
    } catch (error) {
      console.error("Error fetching active feedback form:", error);
    }
  };

  const handleNavigateToSentiment = () => {
    console.log("Navigating with activeFeedback:", activeFeedback);
    if (activeFeedback) {
      let path = "";
      switch (activeFeedback.category) {
        case "priest":
          path = "/user/PriestSentiment";
          break;
        case "event":
          path = "/user/EventSentiment";
          break;
        case "activity":
          path = "/user/ActivitySentiment";
          break;
        default:
          console.error("Invalid feedback category:", activeFeedback.category);
          return;
      }
      navigate(path, { state: { activeFeedback } });
    }
  };

  // useEffect(() => {
  //   const fetchUserData = async (token) => {
  //     try {
  //       const response = await fetch(`${process.env.REACT_APP_API}/api/v1/profile`, {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': `Bearer ${token}`
  //         },
  //         credentials: 'include', // Include cookies if necessary
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch user data');
  //       }

  //       const data = await response.json();
  //       const userData = data.user;
  //       setUser({
  //         name: userData.name || 'Guest',
  //         avatar: userData.avatar.url || 'default-profile-icon.png',
  //       });
  //     } catch (error) {
  //       console.log("Token in localStorage:", localStorage.getItem('token'));
  //       console.error('Failed to fetch user data:', error.message);
  //     }
  //   };
  //       fetchUserData();
  // }, []);
  const config = {

    withCredentials: true,
  };

  // const fetchUserData = async () => {
  //   try {
  //     // const token = sessionStorage.getItem('token'); // Fetch the token from sessionStorage
  //     // if (!token) {
  //     //   console.error('Token not found');
  //     //   return;
  //     // }

  //     const response = await fetch(`${process.env.REACT_APP_API}/api/v1/profile`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       credentials: 'include',
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       const userData = data.user;
  //       setUser({
  //         name: userData.name || 'Guest',
  //         avatar: userData.avatar.url || 'default-profile-icon.png',
  //       });
  //     } else {
  //       console.error("Failed to fetch user data:", response.status);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch user data:', error);
  //   }
  // };


  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  return (
    <div style={styles.sidebarContainer}>
      <div style={styles.profileContainer}>
        <img
          src={user && user.avatar ? user.avatar.url : `${process.env.PUBLIC_URL}/public/../EPAROKYA-SYST.png`}
          alt={`${user && user.name ? user.name : "Guest"}'s profile`}
          style={styles.profilePicture}
        />

        <h2 style={styles.welcomeText}>Hello {user && user.name ? user.name : "Guest"}!</h2>
      </div>

      {/* Menu */}
      <ul style={styles.menuList}>
        <li style={styles.menuItem}>
          <Link
            to="/"
            style={{
              ...styles.link,
              ...(location.pathname === '/' ? styles.activeLink : {}),
            }}
          >
            <FaHome style={styles.icon} /> Home
          </Link>
        </li>


        <li style={styles.menuItem}>
          <Link
            to="/resourcePage"
            style={{
              ...styles.link,
              ...(location.pathname === '/resourcePage' ? styles.activeLink : {}),
            }}
          >
            <FaCalendarAlt style={styles.icon} /> Resources
          </Link>
        </li>

        {/* <li style={styles.menuItem}>
          <Link
            to="/sermons"
            style={{
              ...styles.link,
              ...(location.pathname === "/sermons" ? styles.activeLink : {}),
            }}
          >
            <FaBook style={styles.icon} /> Sermon
          </Link> 
        </li> */}

        <li style={styles.menuItem}>
          <Link
            to="/user/prayerWall"
            style={{
              ...styles.link,
              ...(location.pathname === "/user/prayerWall" ? styles.activeLink : {}),
            }}
          >
            <FaPray style={styles.icon} /> Prayers
          </Link>
        </li>


        <li style={styles.menuItem}>
          <Link
            to="/user/calendar"
            style={{
              ...styles.link,
              ...(location.pathname === "/user/calendar" ? styles.activeLink : {}),
            }}
          >
            <FaCalendarAlt style={styles.icon} /> Calendar
          </Link>
        </li>

        <li style={styles.menuItem}>
          <Link
            to="/weddingWall"
            style={{
              ...styles.link,
              ...(location.pathname === "/weddingWall" ? styles.activeLink : {}),
            }}
          >
            <FaPray style={styles.icon} /> Wedding
          </Link>
        </li>

        <li style={styles.menuItem}>
          <Link
            to="/user/NavigationForms"
            style={{
              ...styles.link,
              ...(location.pathname === "/user/NavigationForms" ? styles.activeLink : {}),
            }}
          >
            <FaWpforms style={styles.icon} />Forms
          </Link>
        </li>


        <li style={styles.menuItem}>
          <Link
            to="/user/FormGuides"
            style={{
              ...styles.link,
              ...(location.pathname === "/user/FormGuides" ? styles.activeLink : {}),
            }}
          >
            <FaRegFileAlt style={styles.icon} /> Form Guide
          </Link>
        </li>

        {/* <li style={styles.menuItem}>
          <Link
            to="/user/live"
            style={{
              ...styles.link,
              ...(location.pathname === "/user/FormGuides" ? styles.activeLink : {}),
            }}
          >
            <FaRegFileAlt style={styles.icon} /> Live
          </Link>
        </li> */}

      </ul>

      <ul style={styles.settingsList}>
        <li style={styles.menuItem}>
          <Button
            color='success'
            onClick={handleOpen}

          > <RateReviewIcon style={styles.icon} />
            Open Feedback
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styles.modal}>
              <Typography id="modal-modal-title" variant="h6" component="h2" align='center' marginBottom={2} fontWeight="bold" color='success'>
                Active Feedback Form
              </Typography>
              {activeFeedback ? (
                <>
                  <Typography style={styles.modalText}>
                    <strong>Category:</strong> {activeFeedback.category || "N/A"}
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
            to="/settings"
            style={{
              ...styles.link,
              ...(location.pathname === '/settings' ? styles.activeLink : {}),
            }}
          >
            <FaCog style={styles.icon} /> Settings
          </Link>
        </li>
      </ul>

    </div>
  );
};

const styles = {
  sidebarContainer: {
    backgroundColor: '#d6e7c6',
    width: '220px',
    height: '100vh', // Full viewport height
    position: 'sticky', // Ensures the sidebar sticks while scrolling
    top: '0', // Anchors the sidebar at the top
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px',
    boxSizing: 'border-box',
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 350,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },
  modalText: {
    marginBottom: '10px', 

  },


  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  profilePicture: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
    border: '2px solid #FFFFFF',
  },
  welcomeText: {
    color: '#26562e',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
  },
  menuList: {
    listStyleType: 'none',
    padding: 0,
  },
  menuItem: {
    marginBottom: '10px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    color: '#26562e',
    textDecoration: 'none',
    fontSize: '16px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  activeLink: {
    backgroundColor: '#93c47d',
    color: '#26562e',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: '10px',
    fontSize: '18px',
  },
  settingsList: {
    listStyleType: 'none',
    padding: 0,
    marginTop: 'auto',
  },
};

export default GuestSideBar;
