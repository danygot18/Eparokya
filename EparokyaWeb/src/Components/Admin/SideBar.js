//New SideBar Code
import React, { useState } from "react";
import { Link } from "react-router-dom";

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
  People as PeopleIcon,
  LiveTv as LiveTvIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  PermContactCalendar as PermContactCalendarIcon,
  History as HistoryIcon,
  Feedback as FeedbackIcon,
  Forum as ForumIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarTodayIcon,
  ListAlt as ListAltIcon,
  Event as EventIcon,
  Inventory as InventoryIcon,
  DateRange as DateRangeIcon,
  Announcement as AnnouncementIcon,
  LibraryBooks as LibraryBooksIcon,
  Lock as LockIcon,
  Celebration as CelebrationIcon,
  ChevronRight,
  ExpandMore,
  ChevronLeft,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";

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

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDropdownToggle = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/admin/dashboard",
    },
    {
      text: "Priest Navigation ",
      icon: <DashboardIcon />,
      path: "/admin/priestNavigation",
    },
    {
      text: "Add Sunday Readings ",
      icon: <DashboardIcon />,
      path: "/admin/addReadings",
    },
    {
      text: "Users",
      icon: <PeopleIcon />,
      path: "/admin/users",
    },
    {
      text: "User Submission",
      icon: <PeopleIcon />,
      path: "/admin/formCounts",
    },
    {
      text: "Live",
      icon: <LiveTvIcon />,
      path: "/admin/live",
    },
    {
      text: "Parish Priest",
      icon: <PersonIcon />,
      subItems: [
        {
          text: "Add Parish Priests",
          path: "/admin/create/priest",
        },
        {
          text: "Parish Priests List",
          path: "/admin/priestList",
        },
      ],
    },
    {
      text: "Ministry Categories",
      icon: <CategoryIcon />,
      path: "/admin/ministryCategory/create",
    },
    {
      text: "Member Directory",
      icon: <PermContactCalendarIcon />,
      subItems: [
        {
          text: "Add Member Batch Year",
          path: "/admin/memberBatchYear",
        },
        {
          text: "Member Directory List",
          path: "/admin/memberDirectory",
        },
      ],
    },
    {
      text: "Member History",
      icon: <HistoryIcon />,
      path: "/admin/calendar",
    },
    {
      text: "Feedback Form",
      icon: <FeedbackIcon />,
      subItems: [
        {
          text: "Add Active Form",
          path: "/admin/AdminSelection",
        },
         {
          text: "Add Activity Type",
          path: "/admin/ActivityType",
        },
         {
          text: "Add Event Type",
          path: "/admin/EventType",
        },
        {
          text: "Sentiment Results",
          path: "/admin/SentimentResults",
        },
      ],
    },
    {
      text: "Sentiment Lists",
      icon: <FeedbackIcon />,
      subItems: [
        {
          text: "Priest Sentiments",
          path: "/admin/PriestSentimentList",
        },
        {
          text: "Event Sentiments",
          path: "/admin/EventSentimentList",
        },
        {
          text: "Activity Sentiments",
          path: "/admin/ActivitySentimentList",
        },
      ],
    },
    {
      text: "Prayer Wall Requests",
      icon: <ForumIcon />,
      path: "/admin/prayerReview",
    },
    {
      text: "Prayer Requests",
      icon: <AssignmentIcon />,
      path: "/admin/prayerIntentionList",
    },
    {
      text: "Calendar",
      icon: <CalendarTodayIcon />,
      path: "/admin/calendar",
    },
    {
      text: "Ministry Inventory",
      icon: <InventoryIcon />,
      path: "/admin/adminDate",
    },
    {
      text: "Set Available Date",
      icon: <DateRangeIcon />,
      path: "/admin/adminDate",
    },
    {
      text: "Announcements",
      icon: <AnnouncementIcon />,
      subItems: [
        {
          text: "Create Announcement",
          path: "/admin/create/announcement",
        },
        {
          text: "Announcement List",
          path: "/admin/announcementList",
        },
        {
          text: "Announcement Category",
          path: "/admin/announcementCategory/create",
        },
      ],
    },
    {
      text: "Resource Page",
      icon: <LibraryBooksIcon />,
      subItems: [
        {
          text: "Create Resource Category",
          path: "/admin/resourceCategory/create",
        },
        {
          text: "Create Resource",
          path: "/admin/resource/create",
        },
        {
          text: "Resources List",
          path: "/admin/resourceList",
        },
        {
          text: "Live",
          path: "/admin/live",
        },
      ],
    },
    {
      text: "Private Forms List",
      icon: <LockIcon />,
      subItems: [
        {
          text: "Wedding List",
          path: "/admin/weddingList",
        },
        {
          text: "Baptism List",
          path: "/admin/baptismList",
        },
        {
          text: "Funeral List",
          path: "/admin/funeralList",
        },
        {
          text: "Mass Intentions",
          path: "/admin/prayerRequestList",
        },
        {
          text: "Counseling",
          path: "/admin/counselingList",
        },
        {
          text: "House Blessings",
          path: "/admin/houseBlessingList",
        },
      ],
    },
    {
      text: "Mass Forms List",
      icon: <CelebrationIcon />,
      subItems: [
        {
          text: "Mass Wedding List",
          path: "/admin/mass/weddingList",
        },
        {
          text: "Mass Baptism List",
          path: "/admin/mass/baptismList",
        },
      ],
    },
    {
      text: "Inventory",
      icon: <InventoryIcon />,
      subItems: [
        {
          text: "Inventory List",
          path: "/admin/InventoryList",
        },
        {
          text: "Inventory Form",
          path: "/admin/InventoryForm",
        },
      ],
    },
  ];

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
        <IconButton
          onClick={toggleDrawer}
          size="small"
          sx={{
            borderRadius: 0,
            px: 1.5,
            py: 0.5,
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      {drawerOpen && (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6" noWrap>
            Admin Panel
          </Typography>
        </Box>
      )}

      <Divider />

      <List
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.1)",
            borderRadius: "4px",
          },
        }}
      >
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
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      px: 2,
                      py: 1,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "40px" }}>
                      {item.icon}
                    </ListItemIcon>
                    {drawerOpen && (
                      <>
                        <ListItemText
                          primary={item.text}
                          sx={{
                            color: "black",
                            fontWeight: isParentActive ? "bold" : "normal",
                          }}
                        />
                        {openDropdowns[index] ? (
                          <ExpandMore fontSize="small" />
                        ) : (
                          <ChevronRight fontSize="small" />
                        )}
                      </>
                    )}
                  </ListItem>
                  <Collapse
                    in={openDropdowns[index] && drawerOpen}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem, subIndex) => {
                        const isSubActive = location.pathname === subItem.path;
                        return (
                          <ListItem
                            button
                            key={subIndex}
                            component={Link}
                            to={subItem.path}
                            sx={{
                              pl: 4,
                              py: 1,
                              backgroundColor: isSubActive
                                ? "action.selected"
                                : "transparent",
                              "&:hover": {
                                backgroundColor: "action.hover",
                              },
                            }}
                          >
                            <ListItemText
                              primary={subItem.text}
                              sx={{
                                color: "black",
                                fontWeight: isSubActive ? "bold" : "normal",
                              }}
                            />
                          </ListItem>
                        );
                      })}
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
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
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
