import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { socket } from "../../socket/index.js";
import { MenuItem, Stack, Typography, IconButton, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';

const NotificationUser = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const config = { withCredentials: true };

  const { user } = useSelector((state) => state.auth);
  // console.log("user", user._id);

  // ✅ Fetch Notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/notifications`,
        config
      );
      setNotifications(response.data || []);
     // console.log("response.data", response.data);  
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/notifications/${notificationId}`,
        {
          ...config,
          data: {
            user: user._id
          }
        }
      );
      setNotifications((prev) => prev.filter((notif) => notif.N_id !== notificationId));
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // ✅ Mark All Notifications as Read
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

  // ✅ Handle Notification Click
  const handleNotificationClick = (prayerRequestId) => {
    navigate(`/admin/prayerIntention/details/${prayerRequestId}`);
    setOpen(false);
  };

  // ✅ Listen for Real-time Notifications
  useEffect(() => {
    socket.connect();
    fetchNotifications();

    socket.on("push-notification-user", (data) => {
      toast.success(`New Notification: ${data.message}`);

      setNotifications((prev) => [
        {
          N_id: data.N_id,
          message: data.message,
          createdAt: new Date().toISOString()
        },
        ...prev,
      ]);

      setUnreadCount((prev) => (typeof prev === "number" ? prev + 1 : 1));
    });

    return () => {
      socket.off("push-notification-user");
      socket.disconnect();
    };
  }, [fetchNotifications]);

  return (
    <div className="position-relative">
      {/* Notification Bell */}
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

      {/* Dropdown Menu */}
      {open && (
        <div
          className="dropdown-menu dropdown-menu-end show position-absolute mt-2 p-2 shadow-lg"
          style={{
            minWidth: "300px",
            maxHeight: "400px",
            overflowY: "auto",
            right: -20,
            zIndex: 1050
          }}
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
                className="w-100 text-start p-2 border-0 bg-transparent"
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={() => handleNotificationClick(notif.N_id)}
              >
                <div className="d-inline align-items-start">
                  <div>
                    <span className="me-2">{notif.message}</span>
                    <br />
                    <small className="text-muted">
                      {new Date(notif.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <button
                    className="btn btn-link btn-sm text-danger p-0 ms-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.N_id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
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

export default NotificationUser;