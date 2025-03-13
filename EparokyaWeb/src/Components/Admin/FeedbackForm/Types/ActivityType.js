import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import SideBar from "../../SideBar";

const ActivityType = () => {
  const [activityTypes, setActivityTypes] = useState([]);
  const [newActivity, setNewActivity] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchActivityTypes();
  }, []);

  const fetchActivityTypes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllActivityTypes`);
      setActivityTypes(response.data);
    } catch (error) {
      console.error("Error fetching activity types", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this activity type?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API}/api/v1/deleteActivityType/${id}`);
        fetchActivityTypes();
      } catch (error) {
        console.error("Error deleting activity type", error);
      }
    }
  };

  const handleCreate = async () => {
    if (!newActivity.trim()) return;
    try {
      await axios.post(`${process.env.REACT_APP_API}/api/v1/createActivityType`, { name: newActivity });
      setNewActivity("");
      fetchActivityTypes();
    } catch (error) {
      console.error("Error creating activity type", error);
    }
  };

  return (
    <div style={styles.wrapper}>
      <SideBar />
      <div style={styles.content}>
        <div style={styles.leftPane}>
          <h2 style={styles.title}>Add Activity Type</h2>
          <input
            type="text"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            style={styles.input}
            placeholder="Enter activity type"
          />
          <button style={styles.submitButton} onClick={handleCreate}>Add Activity</button>
        </div>
        <div style={styles.rightPane}>
          <h2 style={styles.title}>Activity Types</h2>
          <Table striped bordered hover style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activityTypes.map((activity) => (
                <tr key={activity._id}>
                  <td>{activity.name}</td>
                  <td style={styles.actions}>
                    <button style={styles.deleteButton} onClick={() => handleDelete(activity._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#e8f5e9",
  },
  content: {
    display: "flex",
    flex: 1,
    padding: "20px",
    gap: "40px",
  },
  leftPane: {
    flex: 1,
    backgroundColor: "#d9ead3",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  rightPane: {
    flex: 2,
    backgroundColor: "#d9ead3",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    marginBottom: "10px",
  },
  submitButton: {
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "#388e3c",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
  },
  table: {
    width: "100%",
    textAlign: "center",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  deleteButton: {
    padding: "6px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#c62828",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default ActivityType;
