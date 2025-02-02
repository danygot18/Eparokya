import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const config = {
    withCredentials: true,
  };
 
  useEffect(() => {
    

    const fetchChats = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/chat/getAllMessage/${user._id}`, config
        );
        
        setChats(data.users || []);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user._id, token]);

  return (
    <div style={styles.container}>
      <h2>Chat List</h2>
      {loading ? (
        <p>Loading chats...</p>
      ) : chats.length > 0 ? (
        <ul style={styles.chatList}>
          {chats.map((chat) => (
            <li
              key={chat.id}
              style={styles.chatItem}
              onClick={() => navigate(`/chat/${chat._id}/${chat.email}`)}
            >
              <strong>{chat.email}</strong>
              <p>{chat.lastMessage || "No messages yet."}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No chats available.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "400px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  chatList: {
    listStyle: "none",
    padding: 0,
  },
  chatItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
    transition: "background 0.2s",
  },
};

export default ChatList;
