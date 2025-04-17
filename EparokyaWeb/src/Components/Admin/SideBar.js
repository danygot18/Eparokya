// import React from "react";
// import { Link } from "react-router-dom";
// import Card from "react-bootstrap/Card";
// import Nav from "react-bootstrap/Nav";
// import Dropdown from "react-bootstrap/Dropdown";

// // Material UI Icons
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import PeopleIcon from '@mui/icons-material/People';
// import LiveTvIcon from '@mui/icons-material/LiveTv';
// import PersonIcon from '@mui/icons-material/Person';
// import CategoryIcon from '@mui/icons-material/Category';
// import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
// import HistoryIcon from '@mui/icons-material/History';
// import FeedbackIcon from '@mui/icons-material/Feedback';
// import ForumIcon from '@mui/icons-material/Forum';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import ListAltIcon from '@mui/icons-material/ListAlt';
// import EventIcon from '@mui/icons-material/Event';
// import InventoryIcon from '@mui/icons-material/Inventory';
// import DateRangeIcon from '@mui/icons-material/DateRange';
// import AnnouncementIcon from '@mui/icons-material/Announcement';
// import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
// import LockIcon from '@mui/icons-material/Lock';
// import CelebrationIcon from '@mui/icons-material/Celebration';

// const SideBar = () => {
//   return (
//     <Card className="sidebar-card" style={styles.sidebarCard}>
//       <Card.Body>
//         <Card.Title className="text-center" style={styles.title}>
//           Admin Panel
//         </Card.Title>
//         <Nav className="flex-column">
//           <div style={styles.navItem}>
//             <Link to="/admin/dashboard" className="sidebar-link" style={styles.sidebarLink}>
//               <DashboardIcon style={styles.icon} />
//               Dashboard
//             </Link>
//           </div>
//           <div style={styles.navItem}>
//             <Link to="/admin/users" className="sidebar-link" style={styles.sidebarLink}>
//               <PeopleIcon style={styles.icon} />
//               Users
//             </Link>
//           </div>
//           <div style={styles.navItem}>
//             <Link to="/admin/formCounts" className="sidebar-link" style={styles.sidebarLink}>
//               <PeopleIcon style={styles.icon} />
//               User Submission
//             </Link>
//           </div>
//           <div style={styles.navItem}>
//             <Link to="/admin/live" className="sidebar-link" style={styles.sidebarLink}>
//               <LiveTvIcon style={styles.icon} />
//               Live
//             </Link>
//           </div>
//           <div style={styles.navItem}>
//             <Dropdown>
//               <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
//                 <PersonIcon style={styles.icon} />
//                 Parish Priest
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 <Dropdown.Item>
//                   <Link to="/admin/create/priest" className="sidebar-link" style={styles.sidebarLink}>
//                     Add Parish Priests
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/priestList" className="sidebar-link" style={styles.sidebarLink}>
//                     Parish Priests List
//                   </Link>
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>
//           <div style={styles.navItem}>
//             <Link to="/admin/ministryCategory/create" className="sidebar-link" style={styles.sidebarLink}>
//               <CategoryIcon style={styles.icon} />
//               Ministry Categories
//             </Link>
//           </div>
//           <div style={styles.navItem}>
//             <Dropdown>
//               <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
//                 <PermContactCalendarIcon style={styles.icon} />
//                 Member Directory
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 <Dropdown.Item>
//                   <Link to="/admin/memberBatchYear" className="sidebar-link" style={styles.sidebarLink}>
//                     Add Member Batch Year
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/memberDirectory" className="sidebar-link" style={styles.sidebarLink}>
//                     Member Directory List
//                   </Link>
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>
//           <div style={styles.navItem}>
//             <Link to="/admin/calendar" className="sidebar-link" style={styles.sidebarLink}>
//               <HistoryIcon style={styles.icon} />
//               Member History
//             </Link>
//           </div>
//           <div style={styles.navItem}>
//             <Dropdown>
//               <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
//                 <PersonIcon style={styles.icon} />
//                 Feedback Form
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 <Dropdown.Item>
//                   <Link to="/admin/AdminSelection" className="sidebar-link" style={styles.sidebarLink}>
//                     Add Active Form
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/SentimentResults" className="sidebar-link" style={styles.sidebarLink}>
//                     Sentiment Results
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/SentimentResults" className="sidebar-link" style={styles.sidebarLink}>
//                     Sentiment Lists
//                   </Link>
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>


//           <div style={styles.navItem}>
//             <Link to="/admin/prayerReview" className="sidebar-link" style={styles.sidebarLink}>
//               <ForumIcon style={styles.icon} />
//               Prayer Wall Requests
//             </Link>
//           </div>
//           <div style={styles.navItem}>
//             <Link to="/admin/prayerIntentionList" className="sidebar-link" style={styles.sidebarLink}>
//               <AssignmentIcon style={styles.icon} />
//               Prayer Requests
//             </Link>
//           </div>
//           <div style={styles.navItem}>
//             <Link to="/admin/calendar" className="sidebar-link" style={styles.sidebarLink}>
//               <CalendarTodayIcon style={styles.icon} />
//               Calendar
//             </Link>
//           </div>
//           <div style={styles.navItem}>
//             <Link to="/admin/postlist" className="sidebar-link" style={styles.sidebarLink}>
//               <ListAltIcon style={styles.icon} />
//               Post List
//             </Link>
//           </div>
//           <div style={styles.navItem}>
//             <Link to="/admin/eventpostlist" className="sidebar-link" style={styles.sidebarLink}>
//               <EventIcon style={styles.icon} />
//               Event Post List
//             </Link>
//           </div>
//           <div style={styles.navItem}>
//             <Link to="/admin/adminDate" className="sidebar-link" style={styles.sidebarLink}>
//               <InventoryIcon style={styles.icon} />
//               Ministry Inventory
//             </Link>
//           </div>
//           <div style={styles.navItem}>
//             <Link to="/admin/adminDate" className="sidebar-link" style={styles.sidebarLink}>
//               <DateRangeIcon style={styles.icon} />
//               Set Available Date
//             </Link>
//           </div>
//           <div style={styles.navItem}>
//             <Dropdown>
//               <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
//                 <AnnouncementIcon style={styles.icon} />
//                 Announcements
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 <Dropdown.Item>
//                   <Link to="/admin/create/announcement" className="sidebar-link" style={styles.sidebarLink}>
//                     Create Announcement
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/announcementList" className="sidebar-link" style={styles.sidebarLink}>
//                     Announcement List
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/announcementCategory/create" className="sidebar-link" style={styles.sidebarLink}>
//                     Announcement Category
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/funeralList" className="sidebar-link" style={styles.sidebarLink}>
//                     Live
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/funeralList" className="sidebar-link" style={styles.sidebarLink}>
//                     Bible
//                   </Link>
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>
//           <div style={styles.navItem}>
//             <Dropdown>
//               <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
//                 <LibraryBooksIcon style={styles.icon} />
//                 Resource Page
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 <Dropdown.Item>
//                   <Link to="/admin/resourceCategory/create" className="sidebar-link" style={styles.sidebarLink}>
//                     Create Resource Category
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/resource/create" className="sidebar-link" style={styles.sidebarLink}>
//                     Create Resource
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/resourceList" className="sidebar-link" style={styles.sidebarLink}>
//                     Resources List
//                   </Link>
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>
//           <div style={styles.navItem}>
//             <Dropdown>
//               <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
//                 <LockIcon style={styles.icon} />
//                 Private Forms List
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 <Dropdown.Item>
//                   <Link to="/admin/weddingList" className="sidebar-link" style={styles.sidebarLink}>
//                     Wedding List
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/baptismList" className="sidebar-link" style={styles.sidebarLink}>
//                     Baptism List
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/funeralList" className="sidebar-link" style={styles.sidebarLink}>
//                     Funeral List
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/prayerRequestList" className="sidebar-link" style={styles.sidebarLink}>
//                     Mass Intentions
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/counselingList" className="sidebar-link" style={styles.sidebarLink}>
//                     Counseling
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/houseBlessingList" className="sidebar-link" style={styles.sidebarLink}>
//                     House Blessings
//                   </Link>
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>
//           <div style={styles.navItem}>
//             <Dropdown>
//               <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
//                 <CelebrationIcon style={styles.icon} />
//                 Mass Forms List
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 <Dropdown.Item>
//                   <Link to="/admin/weddingList" className="sidebar-link" style={styles.sidebarLink}>
//                     Mass Wedding List
//                   </Link>
//                 </Dropdown.Item>
//                 <Dropdown.Item>
//                   <Link to="/admin/baptismList" className="sidebar-link" style={styles.sidebarLink}>
//                     Mass Baptism List
//                   </Link>
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>
//         </Nav>
//       </Card.Body>
//       <style>{`
//         .sidebar-link:hover {
//           background-color: #e9ecef;
//           border-radius: 5px;
//         }
//       `}</style>
//     </Card>
//   );
// };

// const styles = {
//   sidebarCard: {
//     width: "250px",
//     minHeight: "100vh",
//     backgroundColor: "#f8f9fa",
//     border: "1px solid #ddd",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     marginBottom: "20px",
//   },
//   title: {
//     fontWeight: "bold",
//     marginBottom: "20px",
//     fontSize: "1.2rem",
//   },
//   sidebarLink: {
//     display: "flex",
//     alignItems: "center",
//     padding: "10px 15px",
//     color: "#333",
//     textDecoration: "none",
//     fontWeight: "500",
//     transition: "background-color 0.3s ease",
//   },

//   icon: {
//     marginRight: "8px",
//   },
//   navItem: {
//     marginBottom: "10px",
//   },
// };

// export default SideBar;

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
  useMediaQuery
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
  ChevronLeft
} from "@mui/icons-material";

const drawerWidth = 240;
const collapsedWidth = 56;
const headerHeight = 78; // Adjust this to match your header height

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : collapsedWidth,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
    }),
    marginTop: `${headerHeight}px`,
    height: `calc(100vh - ${headerHeight}px)`,
    borderRight: 'none',
    boxShadow: theme.shadows[1],
  },
}));

const SideBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDropdownToggle = (key) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/admin/dashboard"
    },
    {
      text: "Users",
      icon: <PeopleIcon />,
      path: "/admin/users"
    },
    {
      text: "User Submission",
      icon: <PeopleIcon />,
      path: "/admin/formCounts"
    },
    {
      text: "Live",
      icon: <LiveTvIcon />,
      path: "/admin/live"
    },
    {
      text: "Parish Priest",
      icon: <PersonIcon />,
      subItems: [
        {
          text: "Add Parish Priests",
          path: "/admin/create/priest"
        },
        {
          text: "Parish Priests List",
          path: "/admin/priestList"
        }
      ]
    },
    {
      text: "Ministry Categories",
      icon: <CategoryIcon />,
      path: "/admin/ministryCategory/create"
    },
    {
      text: "Member Directory",
      icon: <PermContactCalendarIcon />,
      subItems: [
        {
          text: "Add Member Batch Year",
          path: "/admin/memberBatchYear"
        },
        {
          text: "Member Directory List",
          path: "/admin/memberDirectory"
        }
      ]
    },
    {
      text: "Member History",
      icon: <HistoryIcon />,
      path: "/admin/calendar"
    },
    {
      text: "Feedback Form",
      icon: <FeedbackIcon />,
      subItems: [
        {
          text: "Add Active Form",
          path: "/admin/AdminSelection"
        },
        {
          text: "Sentiment Results",
          path: "/admin/SentimentResults"
        },
        {
          text: "Sentiment Lists",
          path: "/admin/SentimentResults"
        }
      ]
    },
    {
      text: "Prayer Wall Requests",
      icon: <ForumIcon />,
      path: "/admin/prayerReview"
    },
    {
      text: "Prayer Requests",
      icon: <AssignmentIcon />,
      path: "/admin/prayerIntentionList"
    },
    {
      text: "Calendar",
      icon: <CalendarTodayIcon />,
      path: "/admin/calendar"
    },
    {
      text: "Post List",
      icon: <ListAltIcon />,
      path: "/admin/postlist"
    },
    {
      text: "Event Post List",
      icon: <EventIcon />,
      path: "/admin/eventpostlist"
    },
    {
      text: "Ministry Inventory",
      icon: <InventoryIcon />,
      path: "/admin/adminDate"
    },
    {
      text: "Set Available Date",
      icon: <DateRangeIcon />,
      path: "/admin/adminDate"
    },
    {
      text: "Announcements",
      icon: <AnnouncementIcon />,
      subItems: [
        {
          text: "Create Announcement",
          path: "/admin/create/announcement"
        },
        {
          text: "Announcement List",
          path: "/admin/announcementList"
        },
        {
          text: "Announcement Category",
          path: "/admin/announcementCategory/create"
        },
        {
          text: "Live",
          path: "/admin/funeralList"
        },
        {
          text: "Bible",
          path: "/admin/funeralList"
        }
      ]
    },
    {
      text: "Resource Page",
      icon: <LibraryBooksIcon />,
      subItems: [
        {
          text: "Create Resource Category",
          path: "/admin/resourceCategory/create"
        },
        {
          text: "Create Resource",
          path: "/admin/resource/create"
        },
        {
          text: "Resources List",
          path: "/admin/resourceList"
        }
      ]
    },
    {
      text: "Private Forms List",
      icon: <LockIcon />,
      subItems: [
        {
          text: "Wedding List",
          path: "/admin/weddingList"
        },
        {
          text: "Baptism List",
          path: "/admin/baptismList"
        },
        {
          text: "Funeral List",
          path: "/admin/funeralList"
        },
        {
          text: "Mass Intentions",
          path: "/admin/prayerRequestList"
        },
        {
          text: "Counseling",
          path: "/admin/counselingList"
        },
        {
          text: "House Blessings",
          path: "/admin/houseBlessingList"
        }
      ]
    },
    {
      text: "Mass Forms List",
      icon: <CelebrationIcon />,
      subItems: [
        {
          text: "Mass Wedding List",
          path: "/admin/weddingList"
        },
        {
          text: "Mass Baptism List",
          path: "/admin/baptismList"
        }
      ]
    },
    {
      text: "Inventory",
      icon: <InventoryIcon />,
      subItems: [
        {
          text: "Inventory List",
          path: "/admin/InventoryList"
        },
        {
          text: "Inventory Form",
          path: "/admin/InventoryForm"
        }
      ]
    }
  ];

  return (
    <StyledDrawer variant="permanent" open={drawerOpen}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 1,
        position: 'sticky',
        top: 0,
        backgroundColor: 'background.paper',
        zIndex: 1,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <IconButton onClick={toggleDrawer} size="small">
          {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      {drawerOpen && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" noWrap>
            Admin Panel
          </Typography>
        </Box>
      )}

      <Divider />

      <List sx={{
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          width: '0.4em',
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)',
          borderRadius: '4px',
        },
      }}>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.subItems ? (
              <>
                <ListItem
                  button
                  onClick={() => handleDropdownToggle(index)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    px: 2,
                    py: 1,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  {drawerOpen && (
                    <>
                      <ListItemText
                        primary={item.text}
                        sx={{ color: 'black' }}
                      />
                      {openDropdowns[index] ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />}
                    </>
                  )}
                </ListItem>
                <Collapse in={openDropdowns[index] && drawerOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <ListItem
                        button
                        key={subIndex}
                        component={Link}
                        to={subItem.path}
                        sx={{
                          pl: 4,
                          py: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemText
                          primary={subItem.text}
                          slotProps={{ variant: 'h1' }}
                          sx={{ color: 'black' }}
                        />
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
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  px: 2,
                  py: 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  {item.icon}
                </ListItemIcon>
                {drawerOpen && (
                  <ListItemText
                    primary={item.text}
                    slotProps={{ variant: 'h1' }}
                    sx={{ color: 'black' }}
                  />
                )}
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default SideBar;


