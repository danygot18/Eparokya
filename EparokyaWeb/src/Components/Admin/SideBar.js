import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";

// Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import HistoryIcon from '@mui/icons-material/History';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ForumIcon from '@mui/icons-material/Forum';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EventIcon from '@mui/icons-material/Event';
import InventoryIcon from '@mui/icons-material/Inventory';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LockIcon from '@mui/icons-material/Lock';
import CelebrationIcon from '@mui/icons-material/Celebration';

const SideBar = () => {
  return (
    <Card className="sidebar-card" style={styles.sidebarCard}>
      <Card.Body>
        <Card.Title className="text-center" style={styles.title}>
          Admin Panel
        </Card.Title>
        <Nav className="flex-column">
          <div style={styles.navItem}>
            <Link to="/admin/dashboard" className="sidebar-link" style={styles.sidebarLink}>
              <DashboardIcon style={styles.icon} />
              Dashboard
            </Link>
          </div>
          <div style={styles.navItem}>
            <Link to="/admin/users" className="sidebar-link" style={styles.sidebarLink}>
              <PeopleIcon style={styles.icon} />
              Users
            </Link>
          </div>
          <div style={styles.navItem}>
            <Link to="/admin/formCounts" className="sidebar-link" style={styles.sidebarLink}>
              <PeopleIcon style={styles.icon} />
              User Submission
            </Link>
          </div>
          <div style={styles.navItem}>
            <Link to="/admin/live" className="sidebar-link" style={styles.sidebarLink}>
              <LiveTvIcon style={styles.icon} />
              Live
            </Link>
          </div>
          <div style={styles.navItem}>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
                <PersonIcon style={styles.icon} />
                Parish Priest
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/admin/create/priest" className="sidebar-link" style={styles.sidebarLink}>
                    Add Parish Priests
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/priestList" className="sidebar-link" style={styles.sidebarLink}>
                    Parish Priests List
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div style={styles.navItem}>
            <Link to="/admin/ministryCategory/create" className="sidebar-link" style={styles.sidebarLink}>
              <CategoryIcon style={styles.icon} />
              Ministry Categories
            </Link>
          </div>
          <div style={styles.navItem}>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
                <PermContactCalendarIcon style={styles.icon} />
                Member Directory
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/admin/memberBatchYear" className="sidebar-link" style={styles.sidebarLink}>
                    Add Member Batch Year
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/memberDirectory" className="sidebar-link" style={styles.sidebarLink}>
                    Member Directory List
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div style={styles.navItem}>
            <Link to="/admin/calendar" className="sidebar-link" style={styles.sidebarLink}>
              <HistoryIcon style={styles.icon} />
              Member History
            </Link>
          </div>
          <div style={styles.navItem}>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
                <PersonIcon style={styles.icon} />
                Feedback Form
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/admin/AdminSelection" className="sidebar-link" style={styles.sidebarLink}>
                    Add Active Form
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/SentimentResults" className="sidebar-link" style={styles.sidebarLink}>
                    Sentiment Results
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/SentimentResults" className="sidebar-link" style={styles.sidebarLink}>
                    Sentiment Lists
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>


          <div style={styles.navItem}>
            <Link to="/admin/prayerReview" className="sidebar-link" style={styles.sidebarLink}>
              <ForumIcon style={styles.icon} />
              Prayer Wall Requests
            </Link>
          </div>
          <div style={styles.navItem}>
            <Link to="/admin/prayerIntentionList" className="sidebar-link" style={styles.sidebarLink}>
              <AssignmentIcon style={styles.icon} />
              Prayer Requests
            </Link>
          </div>
          <div style={styles.navItem}>
            <Link to="/admin/calendar" className="sidebar-link" style={styles.sidebarLink}>
              <CalendarTodayIcon style={styles.icon} />
              Calendar
            </Link>
          </div>
          <div style={styles.navItem}>
            <Link to="/admin/postlist" className="sidebar-link" style={styles.sidebarLink}>
              <ListAltIcon style={styles.icon} />
              Post List
            </Link>
          </div>
          <div style={styles.navItem}>
            <Link to="/admin/eventpostlist" className="sidebar-link" style={styles.sidebarLink}>
              <EventIcon style={styles.icon} />
              Event Post List
            </Link>
          </div>
          <div style={styles.navItem}>
            <Link to="/admin/adminDate" className="sidebar-link" style={styles.sidebarLink}>
              <InventoryIcon style={styles.icon} />
              Ministry Inventory
            </Link>
          </div>
          <div style={styles.navItem}>
            <Link to="/admin/adminDate" className="sidebar-link" style={styles.sidebarLink}>
              <DateRangeIcon style={styles.icon} />
              Set Available Date
            </Link>
          </div>
          <div style={styles.navItem}>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
                <AnnouncementIcon style={styles.icon} />
                Announcements
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/admin/create/announcement" className="sidebar-link" style={styles.sidebarLink}>
                    Create Announcement
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/announcementList" className="sidebar-link" style={styles.sidebarLink}>
                    Announcement List
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/announcementCategory/create" className="sidebar-link" style={styles.sidebarLink}>
                    Announcement Category
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/funeralList" className="sidebar-link" style={styles.sidebarLink}>
                    Live
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/funeralList" className="sidebar-link" style={styles.sidebarLink}>
                    Bible
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div style={styles.navItem}>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
                <LibraryBooksIcon style={styles.icon} />
                Resource Page
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/admin/resourceCategory/create" className="sidebar-link" style={styles.sidebarLink}>
                    Create Resource Category
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/resource/create" className="sidebar-link" style={styles.sidebarLink}>
                    Create Resource
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/resourceList" className="sidebar-link" style={styles.sidebarLink}>
                    Resources List
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div style={styles.navItem}>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
                <LockIcon style={styles.icon} />
                Private Forms List
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/admin/weddingList" className="sidebar-link" style={styles.sidebarLink}>
                    Wedding List
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/baptismList" className="sidebar-link" style={styles.sidebarLink}>
                    Baptism List
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/funeralList" className="sidebar-link" style={styles.sidebarLink}>
                    Funeral List
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/prayerRequestList" className="sidebar-link" style={styles.sidebarLink}>
                    Mass Intentions
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/counselingList" className="sidebar-link" style={styles.sidebarLink}>
                    Counseling
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/houseBlessingList" className="sidebar-link" style={styles.sidebarLink}>
                    House Blessings
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div style={styles.navItem}>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
                <CelebrationIcon style={styles.icon} />
                Mass Forms List
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/admin/weddingList" className="sidebar-link" style={styles.sidebarLink}>
                    Mass Wedding List
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/admin/baptismList" className="sidebar-link" style={styles.sidebarLink}>
                    Mass Baptism List
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Nav>
      </Card.Body>
      <style>{`
        .sidebar-link:hover {
          background-color: #e9ecef;
          border-radius: 5px;
        }
      `}</style>
    </Card>
  );
};

const styles = {
  sidebarCard: {
    width: "250px",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    border: "1px solid #ddd",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  title: {
    fontWeight: "bold",
    marginBottom: "20px",
    fontSize: "1.2rem",
  },
  sidebarLink: {
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    color: "#333",
    textDecoration: "none",
    fontWeight: "500",
    transition: "background-color 0.3s ease",
  },

  icon: {
    marginRight: "8px",
  },
  navItem: {
    marginBottom: "10px",
  },
};

export default SideBar;
