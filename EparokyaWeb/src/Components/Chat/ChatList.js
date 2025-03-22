import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import GuestSideBar from "../GuestSideBar";
import "./ChatList.css";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const config = { withCredentials: true };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/chat/getAllMessage/${user._id}`,
          config
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
    <div className="chat-page">
      <GuestSideBar />
      <div className="chat-container">
        <h2 className="chat-title">Chat List</h2>
        {loading ? (
          <p className="chat-loading">Loading chats...</p>
        ) : chats.length > 0 ? (
          <div className="chat-lists">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="chat-card"
                onClick={() => navigate(`/chat/${chat.id}/${chat.email}`)}
              >
                <p className="chat-email">{chat.email}</p>
                <p className="chat-id">{chat.id}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="chat-empty">No chats available.</p>
        )}
      </div>
    </div>
  );
};

export default ChatList;