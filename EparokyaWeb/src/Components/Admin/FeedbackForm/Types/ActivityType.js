import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";



const ActivityType = () => {
  const [activityTypes, setActivityTypes] = useState([]);
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

  return (
    <div style={stylesActivityType.wrapper}>
      <div style={stylesActivityType.content}>
        <h2 style={stylesActivityType.title}>Activity Types</h2>
        <button style={stylesActivityType.button} onClick={() => setShow(true)}>Add Activity Type</button>
        <Table striped bordered hover style={stylesActivityType.table}>
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
                <td style={stylesActivityType.actions}>
                  <button style={stylesActivityType.deleteButton} onClick={() => handleDelete(activity._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

const stylesActivityType = {
    wrapper: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#e8f5e9",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      padding: "20px",
    },
    content: {
      width: "80%",
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
      display: "block",
      marginBottom: "20px",
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
