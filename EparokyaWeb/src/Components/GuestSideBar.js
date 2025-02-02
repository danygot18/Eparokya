import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaPray, FaBook, FaCog, FaRegFileAlt, FaWpforms } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

const GuestSideBar = () => {
  // const [users, setUser] = useState({
  //   name: 'Guest',
  //   avatar: 'default-profile-icon.png',
  // });
  const { user } = useSelector(state => state.auth);
  const location = useLocation();

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

        <h2 style={styles.welcomeText}>Hello {user?.name || "Guest"}!</h2>
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
            to="/events"
            style={{
              ...styles.link,
              ...(location.pathname === '/events' ? styles.activeLink : {}),
            }}
          >
            <FaCalendarAlt style={styles.icon} /> Events
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
            to="/user/NavigationForms"
            style={{
              ...styles.link,
              ...(location.pathname === "/user/NavigationForms" ? styles.activeLink : {}),
            }}
          >
            <FaWpforms style={styles.icon} /> Forms
          </Link>
        </li>


        {/* <li style={styles.menuItem}>
          <Link
            to="/resources"
            style={{
              ...styles.link,
              ...(location.pathname === "/resources" ? styles.activeLink : {}),
            }}
          >
            <FaRegFileAlt style={styles.icon} /> Resources
          </Link>
        </li> */}

      </ul>

      <ul style={styles.settingsList}>
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