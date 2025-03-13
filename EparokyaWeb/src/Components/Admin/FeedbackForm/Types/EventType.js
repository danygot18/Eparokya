import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import SideBar from "../../SideBar";

const EventType = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const config = { withCredentials: true };

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllEventType`,
        config
      );
      setEventTypes(response.data);
    } catch (error) {
      console.error("Error fetching event types:", error);
    }
  };

  const handleAddEventType = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/createEventType`,
        { name },
        config
      );
      setName("");
      setShowForm(false);
      fetchEventTypes();
    } catch (error) {
      console.error("Error adding event type:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/deleteEventType/${id}`
      );
      fetchEventTypes();
    } catch (error) {
      console.error("Error deleting event type:", error);
    }
  };

  return (
    <div style={styles.wrapper}>
      <SideBar />
      <div style={styles.content}>
        <div style={styles.leftPane}>
          <h2 style={styles.title}>Manage Event Types</h2>
          <button style={styles.button} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Event Type"}
          </button>
          {showForm && (
            <form style={styles.form} onSubmit={handleAddEventType}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Event Type Name:</label>
                <input
                  type="text"
                  style={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <button type="submit" style={styles.submitButton}>Add</button>
            </form>
          )}
        </div>

        <div style={styles.rightPane}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventTypes.map((event) => (
                <tr key={event._id}>
                  <td>{event.name}</td>
                  <td>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </button>
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
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "#388e3c",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontSize: "16px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  submitButton: {
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "#388e3c",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
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

export default EventType;
