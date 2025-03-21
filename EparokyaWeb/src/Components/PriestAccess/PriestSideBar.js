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

const PriestSideBar = () => {
    return (
        <Card className="sidebar-card" style={styles.sidebarCard}>
            <Card.Body>
                <Card.Title className="text-center" style={styles.title}>
                    Priest Panel
                </Card.Title>
                <Nav className="flex-column">

                    <div style={styles.navItem}>
                        <Link to="/admin/memberDirectory" className="sidebar-link" style={styles.sidebarLink}>
                            <HistoryIcon style={styles.icon} />
                            Member Directory
                        </Link>
                    </div>

                    <div style={styles.navItem}>
                        <Link to="/admin/calendar" className="sidebar-link" style={styles.sidebarLink}>
                            <FeedbackIcon style={styles.icon} />
                            Feedback Form
                        </Link>
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

export default PriestSideBar;
