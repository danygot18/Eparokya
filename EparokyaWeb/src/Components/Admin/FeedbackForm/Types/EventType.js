import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";

const EventType = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/createEventType`);
    setEventTypes(response.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API}/api/v1/deleteEventType${id}`);
    fetchEventTypes();
  };

  return (
    <div style={stylesEventType.wrapper}>
      <div style={stylesEventType.content}>
        <h2 style={stylesEventType.title}>Event Types</h2>
        <button style={stylesEventType.button} onClick={() => setShow(true)}>Add Event Type</button>
        <Table striped bordered hover style={stylesEventType.table}>
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
                <td style={stylesEventType.actions}>
                  <button style={stylesEventType.deleteButton} onClick={() => handleDelete(event._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

const stylesEventType = {
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
  
export default EventType;
