import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./ChatSidebar.css";

const ChatSidebar = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/chat/getAllMessage/${user._id}`,
          { withCredentials: true }
        );
        setChats(data.users || []);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user._id]);

  return (
    <div className="chat-sidebar">
      <h2 className="chat-title">Chats</h2>
      {loading ? (
        <p className="chat-loading">Loading...</p>
      ) : chats.length > 0 ? (
        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="chat-item"
              onClick={() => navigate(`/chat/${chat.id}/${chat.email}`)}
            >
              {/* <div className="chat-avatar">
                <img src={chat.avatar || "/default-avatar.png"} alt="Avatar" />
              </div> */}
              <p className="chat-email">{chat.email}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="chat-empty">No chats available.</p>
      )}
    </div>
  );
};

export default ChatSidebar;
