import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Button, Nav, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Redux/actions/userActions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
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
      <Link to="/" style={styles.logo}>
        Eparokya
      </Link>
      {/* User Navigation Section */}
      <Nav className="d-flex align-items-center">
        {user ? (
          <NavDropdown 
            title={<span style={styles.navDropdownTitle}>{user.name}</span>} 
            id="user-nav-dropdown" 
            alignRight
            menuVariant="light"
          >
            <NavDropdown.Item as={Link} to="/profile" style={styles.dropdownItem}>
              Profile
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
  navLinks: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginLeft: 'auto', 
  },
  navLink: {
    color: '#f0f8ff',
    textDecoration: 'none',
    fontSize: '1.1rem',
    padding: '8px 15px',
    fontWeight: '500',
  },
  navDropdownTitle: {
    color: '#f0f8ff',
    fontSize: '1.1rem',
  },
  dropdownItem: {
    color: '#333',
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
