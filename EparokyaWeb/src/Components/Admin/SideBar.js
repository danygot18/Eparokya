import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";

const SideBar = () => {
  return (
    <Card className="sidebar-card" style={styles.sidebarCard}>
      <Card.Body>
        <Card.Title className="text-center" style={styles.title}>
          Admin Panel
        </Card.Title>
        <Nav className="flex-column">
          <Nav.Item>
            <Link to="/admin/dashboard" className="sidebar-link" style={styles.sidebarLink}>
              Dashboard
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/admin/users" className="sidebar-link" style={styles.sidebarLink}>
              Users
            </Link>
            <Nav.Item>
            <Link to="/admin/create/priest" className="sidebar-link" style={styles.sidebarLink}>
              Parish Priests
            </Link>
          </Nav.Item>
          </Nav.Item>
          <Nav.Item>
            <Link to="/admin/ministryCategory/create" className="sidebar-link" style={styles.sidebarLink}>
              Ministry Categories
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/admin/calendar" className="sidebar-link" style={styles.sidebarLink}>
              Member Directory
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/admin/calendar" className="sidebar-link" style={styles.sidebarLink}>
              Member History
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/admin/calendar" className="sidebar-link" style={styles.sidebarLink}>
              Feedback Form
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/admin/prayerReview" className="sidebar-link" style={styles.sidebarLink}>
              Prayer Wall Requests
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/admin/calendar" className="sidebar-link" style={styles.sidebarLink}>
              Calendar
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/admin/postlist" className="sidebar-link" style={styles.sidebarLink}>
              Post List
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/admin/eventpostlist" className="sidebar-link" style={styles.sidebarLink}>
              Event Post List
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/admin/adminDate" className="sidebar-link" style={styles.sidebarLink}>
              Ministry Inventory
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/admin/adminDate" className="sidebar-link" style={styles.sidebarLink}>
              Set Available Date
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
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
          </Nav.Item>

          <Nav.Item>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
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
          </Nav.Item>

          {/* Private Forms List */}
          <Nav.Item>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
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
                {/* <Dropdown.Item>
                  <Link to="/admin/streetMassList" className="sidebar-link" style={styles.sidebarLink}>
                   Street Mass
                  </Link>
                </Dropdown.Item> */}
              </Dropdown.Menu>
            </Dropdown>
          </Nav.Item>

          <Nav.Item>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="sidebar-link" style={styles.sidebarLink}>
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
          </Nav.Item>
        </Nav>
      </Card.Body>
    </Card>
  );
};

const styles = {
  sidebarCard: {
    width: "250px",
    minHeight: "100%",
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
    display: "block",
    padding: "10px 15px",
    color: "#333",
    textDecoration: "none",
    fontWeight: "500",
    transition: "background-color 0.3s ease",
  },
};

export default SideBar;
