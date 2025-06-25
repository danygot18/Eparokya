import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Collapse,
  IconButton,
  Box,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarTodayIcon,
  ChevronRight,
  ExpandMore,
  ChevronLeft,
  People as PeopleIcon,
  LiveTv as LiveTvIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  PermContactCalendar as PermContactCalendarIcon,
  History as HistoryIcon,
  Feedback as FeedbackIcon,
  Forum as ForumIcon,
  Assignment as AssignmentIcon,
  ListAlt as ListAltIcon,
  Event as EventIcon,
  Inventory as InventoryIcon,
  DateRange as DateRangeIcon,
  Announcement as AnnouncementIcon,
  LibraryBooks as LibraryBooksIcon,
  Lock as LockIcon,
  Celebration as CelebrationIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

const drawerWidth = 240;
const collapsedWidth = 56;
const headerHeight = 78;

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : collapsedWidth,
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: open
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
    marginTop: `${headerHeight}px`,
    height: `calc(100vh - ${headerHeight}px)`,
    borderRight: "none",
    boxShadow: theme.shadows[1],
  },
}));

const SideBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const location = useLocation();

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleDropdownToggle = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const { user: reduxUser, loading } = useSelector((state) => state.auth);
  const [user, setUser] = useState(reduxUser);

  const allMenuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Priest Navigation", icon: <DashboardIcon />, path: "/admin/priestNavigation" },
    { text: "Add Sunday Readings", icon: <DashboardIcon />, path: "/admin/addReadings" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "User Submission", icon: <PeopleIcon />, path: "/admin/formCounts" },
    { text: "Live", icon: <LiveTvIcon />, path: "/admin/live" },
    {
      text: "Parish Priest",
      icon: <PersonIcon />,
      subItems: [
        { text: "Add Parish Priests", path: "/admin/create/priest" },
        { text: "Parish Priests List", path: "/admin/priestList" },
      ],
    },
    { text: "Ministry Categories", icon: <CategoryIcon />, path: "/admin/ministryCategory/create" },
    {
      text: "Member Directory",
      icon: <PermContactCalendarIcon />,
      subItems: [
        { text: "Add Member Batch Year", path: "/admin/memberBatchYear" },
        { text: "Member Directory List", path: "/admin/memberDirectory" },
      ],
    },
    { text: "Member History", icon: <HistoryIcon />, path: "/admin/calendar" },
    {
      text: "Feedback Form",
      icon: <FeedbackIcon />,
      subItems: [
        { text: "Add Active Form", path: "/admin/AdminSelection" },
        { text: "Add Activity Type", path: "/admin/ActivityType" },
        { text: "Add Event Type", path: "/admin/EventType" },
        { text: "Sentiment Results", path: "/admin/SentimentResults" },
      ],
    },
    {
      text: "Sentiment Lists",
      icon: <FeedbackIcon />,
      subItems: [
        { text: "Priest Sentiments", path: "/admin/PriestSentimentList" },
        { text: "Event Sentiments", path: "/admin/EventSentimentList" },
        { text: "Activity Sentiments", path: "/admin/ActivitytSentimentList" },
      ],
    },
    { text: "Prayer Wall Requests", icon: <ForumIcon />, path: "/admin/prayerReview" },
    { text: "Prayer Requests", icon: <AssignmentIcon />, path: "/admin/prayerIntentionList" },
    { text: "Calendar", icon: <CalendarTodayIcon />, path: "/admin/calendar" },
    { text: "Set Available Date", icon: <DateRangeIcon />, path: "/admin/adminDate" },
    {
      text: "Announcements",
      icon: <AnnouncementIcon />,
      subItems: [
        { text: "Create Announcement", path: "/admin/create/announcement" },
        { text: "Announcement List", path: "/admin/announcementList" },
        { text: "Announcement Category", path: "/admin/announcementCategory/create" },
      ],
    },
    {
      text: "Resource Page",
      icon: <LibraryBooksIcon />,
      subItems: [
        { text: "Create Resource Category", path: "/admin/resourceCategory/create" },
        { text: "Create Resource", path: "/admin/resource/create" },
        { text: "Resources List", path: "/admin/resourceList" },
        { text: "Live", path: "/admin/live" },
      ],
    },
    {
      text: "Private Forms List",
      icon: <LockIcon />,
      subItems: [
        { text: "Wedding List", path: "/admin/weddingList" },
        { text: "Baptism List", path: "/admin/baptismList" },
        { text: "Funeral List", path: "/admin/funeralList" },
        { text: "Mass Intentions", path: "/admin/prayerRequestList" },
        { text: "Counseling", path: "/admin/counselingList" },
        { text: "House Blessings", path: "/admin/houseBlessingList" },
      ],
    },
    {
      text: "Mass Forms List",
      icon: <CelebrationIcon />,
      subItems: [
        { text: "Mass Wedding List", path: "/admin/mass/weddingList" },
        { text: "Mass Baptism List", path: "/admin/mass/baptismList" },
      ],
    },
    {
      text: "Inventory",
      icon: <InventoryIcon />,
      subItems: [
        { text: "Inventory List", path: "/admin/InventoryList" },
        { text: "Inventory Form", path: "/admin/InventoryForm" },
      ],
    },
  ];

  // ✅ Filter if user is both isAdmin and isPriest — show only 2 items
  let menuItems = allMenuItems;
  if (user?.isAdmin && user?.isPriest) {
    menuItems = allMenuItems.filter(
      (item) => item.text === "Priest Navigation" || item.text === "Calendar"
    );
  }

  return (
    <StyledDrawer variant="permanent" open={drawerOpen}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 1,
          position: "sticky",
          top: 0,
          backgroundColor: "background.paper",
          zIndex: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <IconButton onClick={toggleDrawer}>
          {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      {drawerOpen && user?.isAdmin && (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6" noWrap>
            {user.isPriest ? "Priest Panel" : "Admin Panel"}
          </Typography>
        </Box>
      )}


      <Divider />

      <List>
        {menuItems.map((item, index) => {
          const isParentActive = item.subItems?.some(
            (sub) => location.pathname === sub.path
          );
          const isActive = location.pathname === item.path || isParentActive;

          return (
            <React.Fragment key={index}>
              {item.subItems ? (
                <>
                  <ListItem
                    button
                    onClick={() => handleDropdownToggle(index)}
                    sx={{
                      backgroundColor: isParentActive
                        ? "action.selected"
                        : "transparent",
                      "&:hover": { backgroundColor: "action.hover" },
                      px: 2,
                      py: 1,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "40px" }}>
                      {item.icon}
                    </ListItemIcon>
                    {drawerOpen && (
                      <>
                        <ListItemText primary={item.text} />
                        {openDropdowns[index] ? <ExpandMore /> : <ChevronRight />}
                      </>
                    )}
                  </ListItem>
                  <Collapse in={openDropdowns[index] && drawerOpen}>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem, subIndex) => (
                        <ListItem
                          key={subIndex}
                          button
                          component={Link}
                          to={subItem.path}
                          sx={{
                            pl: 4,
                            py: 1,
                            backgroundColor:
                              location.pathname === subItem.path
                                ? "action.selected"
                                : "transparent",
                          }}
                        >
                          <ListItemText primary={subItem.text} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem
                  button
                  component={Link}
                  to={item.path}
                  sx={{
                    backgroundColor: isActive
                      ? "action.selected"
                      : "transparent",
                    "&:hover": { backgroundColor: "action.hover" },
                    px: 2,
                    py: 1,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "40px" }}>
                    {item.icon}
                  </ListItemIcon>
                  {drawerOpen && (
                    <ListItemText
                      primary={item.text}
                      sx={{
                        color: "black",
                        fontWeight: isActive ? "bold" : "normal",
                      }}
                    />
                  )}
                </ListItem>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </StyledDrawer>
  );
};

export default SideBar;
