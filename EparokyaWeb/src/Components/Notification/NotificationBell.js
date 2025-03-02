import React, { useEffect, useState } from "react";
import { socket, connectSocket } from "../../socket/index.js";
import { FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const config = {
    withCredentials: true,
  };
  useEffect(() => {
    connectSocket();

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/notifications`, config);
        setNotifications(response.data);
        setUnreadCount(response.data.length); 
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
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("send-notification");
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0); 
  };

  return (
    <div className="relative inline-block">
      <button onClick={toggleDropdown} className="relative p-2">
        <FaBell className="text-2xl text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-10">
          <h4 className="text-lg font-semibold border-b pb-2">Notifications</h4>
          {notifications.length > 0 ? (
            <ul className="mt-2">
              {notifications.map((notif, index) => (
                <li key={index} className="p-2 border-b">
                  {notif.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm mt-2">No new notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
