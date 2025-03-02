import React, { useEffect, useState } from "react";
import { socket, connectSocket } from "../../socket/index.js";
import { toast } from "react-toastify";
import axios from "axios";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const config = {
    withCredentials: true,
  };

  useEffect(() => {
    connectSocket();

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/notifications`, config);
        setNotifications(response.data); 
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    socket.on("send-notification", (data) => {
      console.log("📩 Received Notification:", data);
      toast.success(`New Notification: ${data.message}`);

      setNotifications((prev) => [...prev, { 
        message: data.message, 
        link: data.link || "#"  
      }]);
    });

    return () => {
      socket.off("send-notification");
    };
  }, []);

  return (
    <div>
      <h3>Notifications</h3>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notif, index) => (
            <li key={index}>{notif.message}</li>
          ))}
        </ul>
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default Notification;
