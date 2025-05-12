import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/actions/userActions";
import { toast } from "react-toastify";
import NotificationUser from "../Notification/NotificationUser";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const location = useLocation();
  const currentPath = location.pathname;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userMenuEl, setUserMenuEl] = React.useState(null);

  const handleParishMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleParishMenuClose = () => setAnchorEl(null);

  const handleUserMenuOpen = (event) => setUserMenuEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuEl(null);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Log Out Success", {
      position: toast.POSITION.TOP_RIGHT,
    });

    document.cookie = [
      'token=""',
      'expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'path=/'
    ].join('; ');
  };

  const navButtonStyle = (route) => ({
    color: currentPath === route ? "green" : "white",
    fontWeight: currentPath === route ? "bold" : "normal",
    borderBottom: currentPath === route ? "2px solid green" : "none",
    borderRadius: 3,
    textTransform: "none",
    
    "&:hover": {
      color: "green",
      backgroundColor: "rgba(0, 128, 0, 0.1)",
    },
  });

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1e3a3a" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left - Logo */}
        <Typography
          component={Link}
          to="/"
          variant="h6"
          sx={{
            color: "#f0f8ff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Eparokya
        </Typography>

        {/* Right - Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <NotificationUser user={user} />

          <Button component={Link} to="/" sx={navButtonStyle("/")}>
            Home
          </Button>

          <Button
            component={Link}
            to="/user/prayerRequestIntention"
            sx={navButtonStyle("/user/prayerRequestIntention") }
          >
            Prayer
          </Button>

          <Button
            component={Link}
            to="/user/live"
            sx={navButtonStyle("/user/live")}
          >
            Live
          </Button>

          <Button
            component={Link}
            to="/biblePage"
            sx={navButtonStyle("/biblePage") }
          >
          Readings
          </Button>

          <Button
            component={Link}
            to="/user/prayerRequestIntention"
            sx={navButtonStyle("/user/prayerRequestIntention") }
          >
            Guides
          </Button>

          {/* Parish Dropdown */}
          <Button
            onClick={handleParishMenuOpen}
            sx={{
              color: "white",
              textTransform: "none",
              "&:hover": { color: "green" },
            }}
          >
            The Parish
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleParishMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem component={Link} to="/memberHistory" onClick={handleParishMenuClose}>
              Members
            </MenuItem>
            <MenuItem component={Link} to="/parishPriests" onClick={handleParishMenuClose}>
              Parish History
            </MenuItem>
            <MenuItem component={Link} to="/parishPriests" onClick={handleParishMenuClose}>
              Parish Priests
            </MenuItem>
          </Menu>

          {/* Authenticated User */}
          {isAuthenticated ? (
            <>
              <Button
                onClick={handleUserMenuOpen}
                sx={{
                  color: "white",
                  textTransform: "none",
                  "&:hover": { color: "green" },
                  size : "small",
                }}
              >
                {user?.name}
              </Button>
              <Menu
                anchorEl={userMenuEl}
                open={Boolean(userMenuEl)}
                onClose={handleUserMenuClose}
              >
                <MenuItem component={Link} to="/profile" onClick={handleUserMenuClose}>
                  Profile
                </MenuItem>
                <MenuItem component={Link} to="/user/ministryCalendar" onClick={handleUserMenuClose}>
                  Ministry Calendar
                </MenuItem>
                <MenuItem component={Link} to="/user/ministryAnnouncement" onClick={handleUserMenuClose}>
                  Ministry Announcements
                </MenuItem>
                {user?.isAdmin && (
                  <MenuItem component={Link} to="/admin/dashboard" onClick={handleUserMenuClose}>
                    Dashboard
                  </MenuItem>
                )}
                <MenuItem component={Link} to="/chatlist" onClick={handleUserMenuClose}>
                  Chat
                </MenuItem>
                <MenuItem onClick={logoutHandler}>
                  <Typography color="error">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "white",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "green",
                    color: "green",
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  backgroundColor: "green",
                  color: "white",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "darkgreen",
                  },
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;