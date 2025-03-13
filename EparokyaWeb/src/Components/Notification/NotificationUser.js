import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const socket = io(process.env.REACT_APP_SOCKET_URL, { withCredentials: true });

const NotificationUser = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const config = { withCredentials: true };

  // ✅ Fetch Notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/notifications`, config);
      console.log("Notifications:", response.data);
      setNotifications(response.data || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  // ✅ Mark All Notifications as Read
  const markAllAsRead = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API}/api/v1/notifications/mark-read`, {}, config);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // ✅ Handle Notification Click
  const handleNotificationClick = (prayerRequestId) => {
    navigate(`/admin/prayerIntention/details/${prayerRequestId}`);
    setOpen(false);
  };

  // ✅ Listen for Real-time Notifications
  useEffect(() => {
    socket.connect();
    fetchNotifications();
    console.log("User:", user); 
    if (user?._id) {
        socket.emit("join", user._id); // User joins a room
        socket.on("push-notification-user", (data) => {
            console.log("New Notification:", data);
            toast.success(`New Notification: ${data.message}`);

            setNotifications((prev) => [
                { N_id: data.N_id, message: data.message },
                ...prev,
            ]);

            setUnreadCount((prev) => prev + 1);
        });
    }

    return () => {
        socket.off("send-notification-user");
        socket.disconnect();
    };
}, [user]);


  return (
    <div className="position-relative">
      {/* Notification Bell */}
      <button
        className="btn btn-secondary position-relative"
        type="button"
        onClick={() => {
          setOpen(!open);
          markAllAsRead();
        }}
      >
        <FaBell className="text-2xl text-gray-700" />
        {unreadCount > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="dropdown-menu dropdown-menu-end show position-absolute mt-2 p-2 shadow-lg"
          style={{ minWidth: "250px", zIndex: 1050 }}>
          <div className="dropdown-header fw-bold">Notifications</div>
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <button key={index} className="dropdown-item text-start" onClick={() => handleNotificationClick(notif.N_id)}>
                {notif.message}
              </button>
            ))
          ) : (
            <div className="dropdown-item text-muted">No new notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationUser;
