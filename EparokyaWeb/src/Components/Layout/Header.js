import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Button, Nav, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Redux/actions/userActions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/images/EparokyaHomeLogo.png';
import NotificationBell from "../Notification/NotificationBell";

import NotificationUser from "../Notification/NotificationUser";


const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [isHovered, setIsHovered] = React.useState(false);
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
    toast.success('Log Out Success', {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  return (
    <Container fluid style={styles.header}>
      {/* Left: Logo */}
      <Link to="/" style={styles.logo}>
        Eparokya
      </Link>

      {/* <header style={{ height: "80px", display: "flex", alignItems: "center" }}>
        <Link to="/">
          <img src={logo} alt="Eparokya Logo" style={{ maxHeight: "50px", width: "auto" }} />
        </Link>
      </header> */}


      {/* Right: Navigation Links (Including Home Button & User Menu) */}
      <div style={styles.navContainer}>
      
        <Link
          to="/"
          style={{
            ...styles.homeButton,
            ...(isHovered ? styles.homeButtonHover : {}),
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Home
        </Link>

        <Link
          to="/user/live"
          style={{ ...styles.navDropdownTitle, textDecoration: 'none' }}
        >
          Live
        </Link>

        <Link
          to="/user/prayerRequestIntention"
          style={{ ...styles.navDropdownTitle, textDecoration: 'none' }}
        >
          Send Prayer
        </Link>
        
        
        <NotificationUser user={user} />

        {/* {user?.isAdmin && (
          <NotificationBell />
        )} */}
        
        <NavDropdown
          title={<span style={styles.navDropdownTitle}>Parish Info</span>}
          id="parish-info-dropdown"
          align="end"
          menuVariant="light"
        >
          <NavDropdown.Item as={Link} to="/memberHistory" style={styles.dropdownItem}>
            Members
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/parishPriests" style={styles.dropdownItem}>
            Parish History
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/parishPriests" style={styles.dropdownItem}>
            Parish Priests
          </NavDropdown.Item>
        </NavDropdown>


        {/* User Navigation Section */}
        <Nav className="d-flex align-items-center">
          {isAuthenticated ? (
            
            <NavDropdown
              title={<span style={styles.navDropdownTitle}>{user?.name}</span>}
              id="user-nav-dropdown"
              align="end"
              menuVariant="light"
            >
              <NavDropdown.Item as={Link} to="/profile" style={styles.dropdownItem}>
                Profile
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/user/ministryCalendar" style={styles.dropdownItem}>
                Ministry Calendar
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/user/ministryAnnouncement" style={styles.dropdownItem}>
                Ministry Announcements
              </NavDropdown.Item>
             
              {user?.isAdmin && (
                <NavDropdown.Item as={Link} to="/admin/dashboard" style={styles.dropdownItem}>
                  Dashboard
                </NavDropdown.Item>
              )}

              <NavDropdown.Item as={Link} to="/chatlist" style={styles.dropdownItem}>
                Chat
              </NavDropdown.Item>
              <NavDropdown.Item onClick={logoutHandler} style={styles.logout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <div style={styles.authButtons}>
              <Link to="/login">
                <Button variant="light" style={styles.button}>Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="light" style={{ ...styles.button, marginLeft: '10px' }}>Sign Up</Button>
              </Link>
            </div>
          )}
        </Nav>
      </div>
    </Container>
  );


};

export default Header;

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#1e3a3a',
    color: '#f0f8ff',
    width: '100%',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#f0f8ff',
    textDecoration: 'none',
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  homeButton: {
    padding: "10px 20px",
    backgroundColor: "#c7ddb5",
    color: "#154314",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    borderRadius: "25px",
    border: "2px solid #154314",
    transition: "background 0.3s ease, transform 0.2s ease",
    cursor: "pointer",
  },
  homeButtonHover: {
    backgroundColor: "#b0cc99",
    transform: "scale(1.05)",
  },
  navDropdownTitle: {
    color: '#f0f8ff',
    fontSize: '1.1rem',
  },
  dropdownItem: {
    color: '#154314',
    padding: '8px 15px',
  },
  logout: {
    color: '#d9534f',
    fontWeight: 'bold',
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  button: {
    fontSize: '1rem',
    padding: '8px 20px',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
};


