import React, { useEffect, useState, useCallback } from "react";
import { socket } from "../../socket/index.js";
import { FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const config = { withCredentials: true };

  // Fetch all notifications from server at once
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/notifications`,
        config
      );
      
      setNotifications(response.data || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/notifications/mark-read`,
        {},
        config
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Handle new real-time notification
  const handleNewNotification = useCallback((data) => {
    toast.success(`New Notification: ${data.message}`);
    
    setNotifications(prev => [
      {
        N_id: data.N_id,
        message: data.message,
        link: data.link || "#",
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
    
    setUnreadCount(prev => prev + 1);
  }, []);

  // Initialize component
  useEffect(() => {
    fetchNotifications();
    
    // Setup socket connection
    socket.connect();
    socket.on("push-notification", handleNewNotification);
    
    return () => {
      socket.off("push-notification", handleNewNotification);
      socket.disconnect();
    };
  }, [fetchNotifications, handleNewNotification]);

  const handleNotificationClick = (prayerRequestId) => {
    navigate(`/admin/prayerIntention/details/${prayerRequestId}`);
    setOpen(false);
    window.location.reload();
  };

  return (
    <div className="position-relative">
      <button
        className="btn btn-secondary position-relative"
        type="button"
        onClick={() => {
          setOpen(!open);
          if (open && unreadCount > 0) {
            markAllAsRead();
          }
        }}
        aria-label="Notifications"
      >
        <FaBell className="text-2xl text-gray-700" />
        {unreadCount > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="dropdown-menu dropdown-menu-end show position-absolute mt-2 p-2 shadow-lg"
          style={{ minWidth: "250px", maxHeight: "400px", overflowY: "auto", zIndex: 1050 }}
        >
          <div className="d-flex justify-content-between align-items-center dropdown-header">
            <span className="fw-bold">Notifications</span>
            {unreadCount > 0 && (
              <button 
                className="btn btn-sm btn-link"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <button
                key={notif.N_id}
                className="dropdown-item text-start"
                onClick={() => handleNotificationClick(notif.N_id)}
              >
                <div className="d-flex flex-column">
                  <span>{notif.message}</span>
                  <small className="text-muted">
                    {new Date(notif.createdAt).toLocaleString()}
                  </small>
                </div>
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

export default NotificationBell;