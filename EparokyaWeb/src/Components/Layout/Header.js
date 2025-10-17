import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  Collapse,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/actions/userActions";
import { toast } from "react-toastify";
import NotificationUser from "../Notification/NotificationUser";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const currentPath = location.pathname;

  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuEl, setUserMenuEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openParish, setOpenParish] = useState(false);

  const handleClickParish = () => setOpenParish(!openParish);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleParishMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleParishMenuClose = () => setAnchorEl(null);
  const handleUserMenuOpen = (event) => setUserMenuEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuEl(null);

  const logoutHandler = async () => {
    setIsLoggingOut(true);
    try {
      dispatch(logout());
      navigate("/");
      toast.success("Log Out Success", { position: toast.POSITION.TOP_RIGHT });
      document.cookie = [
        'token=""',
        "expires=Thu, 01 Jan 1970 00:00:00 GMT",
        "path=/",
      ].join("; ");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Prayer", path: "/user/prayerRequestIntention" },
    { label: "Live", path: "/user/live" },
    { label: "Guides", path: "/GuidesPage" },
    { label: "FAQs", path: "/FAQsPage" },
    { label: "Missions", path: "/missionsPage" },
  ];

  const navButtonStyle = (route) => ({
    color: currentPath === route ? "#90C67C" : "#d1e4d1",
    fontWeight: currentPath === route ? "bold" : 500,
    borderBottom: currentPath === route ? "2px solid #90C67C" : "none",
    textTransform: "none",
    "&:hover": {
      color: "#90C67C",
      backgroundColor: "rgba(144,198,124,0.1)",
    },
  });

  const mobileLinkStyle = {
    justifyContent: "flex-start",
    px: 3,
    py: 1.5,
    color: "#023b02",
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 500,
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(144,198,124,0.15)",
      color: "#3e8e41",
      transform: "translateX(4px)",
    },
  };

  if (loading || isLoggingOut)
    return (
      <CircularProgress
        style={{
          color: "#90C67C",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );

  // ✅ Drawer for Mobile
  const drawer = (
    <Box
      sx={{
        width: 270,
        backgroundColor: "#f5f5f5",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        py: 3,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 3,
            color: "#023b02",
            letterSpacing: 1,
          }}
        >
          Eparokya
        </Typography>
        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", mb: 2 }} />

        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <Button
                component={Link}
                to={item.path}
                fullWidth
                sx={mobileLinkStyle}
                onClick={handleDrawerToggle} // ✅ closes drawer when link clicked
              >
                {item.label}
              </Button>
            </ListItem>
          ))}

          {/* Expandable Parish Section */}
          <ListItem disablePadding sx={{ mb: 1 }}>
            <Button onClick={handleClickParish} fullWidth sx={mobileLinkStyle}>
              The Parish {openParish ? <ExpandLess /> : <ExpandMore />}
            </Button>
          </ListItem>

          <Collapse in={openParish} timeout="auto" unmountOnExit>
            <ul className="space-y-2 text-[#023b02] bg-white p-4 rounded-md shadow-md ml-2 mr-2">
              <li>
                <Link
                  to="/memberHistory"
                  className="block hover:text-green-700"
                  onClick={handleDrawerToggle} // ✅ close drawer
                >
                  Members
                </Link>
              </li>
              <li>
                <Link
                  to="/user/ministryCalendar"
                  className="block hover:text-green-700"
                  onClick={handleDrawerToggle}
                >
                  Ministry Calendar
                </Link>
              </li>
              <li>
                <Link
                  to="/parishHistory"
                  className="block hover:text-green-700"
                  onClick={handleDrawerToggle}
                >
                  Parish History
                </Link>
              </li>
              <li>
                <Link
                  to="/parishPriests"
                  className="block hover:text-green-700"
                  onClick={handleDrawerToggle}
                >
                  Parish Priests
                </Link>
              </li>
              <li>
                <Link
                  to="/guestPriest"
                  className="block hover:text-green-700"
                  onClick={handleDrawerToggle}
                >
                  Guest Priests
                </Link>
              </li>
            </ul>
          </Collapse>

          <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", mt: 2, mb: 1 }} />

          {isAuthenticated ? (
            <>
              <Button
                component={Link}
                to="/profile"
                fullWidth
                sx={mobileLinkStyle}
                onClick={handleDrawerToggle}
              >
                Profile
              </Button>
              <Button
                component={Link}
                to="/user/ministryAnnouncement"
                fullWidth
                sx={mobileLinkStyle}
                onClick={handleDrawerToggle}
              >
                Ministry Announcements
              </Button>
              <Button
                component={Link}
                to="/chatlist"
                fullWidth
                sx={mobileLinkStyle}
                onClick={handleDrawerToggle}
              >
                Chat
              </Button>
              <Button
                onClick={logoutHandler}
                fullWidth
                sx={{
                  ...mobileLinkStyle,
                  color: "#b30000",
                  "&:hover": {
                    backgroundColor: "rgba(255,0,0,0.1)",
                    transform: "translateX(4px)",
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                fullWidth
                sx={mobileLinkStyle}
                onClick={handleDrawerToggle}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                fullWidth
                sx={mobileLinkStyle}
                onClick={handleDrawerToggle}
              >
                Sign Up
              </Button>
            </>
          )}
        </List>
      </Box>
    </Box>
  );


  return (
    <>
      {/* ✅ App Bar */}
      <AppBar position="static" sx={{ backgroundColor: "#023b02", padding: "3px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              color: "#e0f2e9",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Eparokya
          </Typography>

          {/* ✅ Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            {isAuthenticated && <NotificationUser user={user} />}
            {navItems.map((item) => (
              <Button key={item.label} component={Link} to={item.path} sx={navButtonStyle(item.path)}>
                {item.label}
              </Button>
            ))}

            {/* Parish Dropdown */}
            <Button onClick={handleParishMenuOpen} sx={navButtonStyle("/parish")}>
              The Parish
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleParishMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: "#ffffff",
                  color: "#023b02",
                },
              }}
            >
              <MenuItem component={Link} to="/memberHistory" onClick={handleParishMenuClose}>
                Members
              </MenuItem>
              <MenuItem component={Link} to="/user/ministryCalendar" onClick={handleParishMenuClose}>
                Ministry Calendar
              </MenuItem>
              <MenuItem component={Link} to="/parishHistory" onClick={handleParishMenuClose}>
                Parish History
              </MenuItem>
              <MenuItem component={Link} to="/parishPriests" onClick={handleParishMenuClose}>
                Parish Priests
              </MenuItem>
              <MenuItem component={Link} to="/guestPriest" onClick={handleParishMenuClose}>
                Guest Priests
              </MenuItem>
            </Menu>

            {/* User Menu */}
            {isAuthenticated ? (
              <>
                <Button onClick={handleUserMenuOpen} sx={navButtonStyle("/profile")}>
                  {user?.name}
                </Button>
                <Menu anchorEl={userMenuEl} open={Boolean(userMenuEl)} onClose={handleUserMenuClose}>
                  <MenuItem component={Link} to="/profile" onClick={handleUserMenuClose}>
                    Profile
                  </MenuItem>
                  <MenuItem component={Link} to="/user/ministryAnnouncement" onClick={handleUserMenuClose}>
                    Ministry Announcements
                  </MenuItem>
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
                <Button component={Link} to="/login" variant="outlined" sx={navButtonStyle("/login")}>
                  Login
                </Button>
                <Button component={Link} to="/register" variant="outlined" sx={navButtonStyle("/register")}>
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* ✅ Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            {mobileOpen ? <CloseIcon sx={{ color: "#023b02" }} /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ✅ Drawer for Mobile */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": { width: 270, boxShadow: "0 0 10px rgba(0,0,0,0.2)" } }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
