import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IoSend } from "react-icons/io5";
import { socket } from "../../socket/index";
import "./Chat.css"; // Import the CSS file

const UserChat = () => {
    const { chat, email } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const config = { withCredentials: true };
    useEffect(() => {
        console.log("Params:", chat, email);
    }, [chat, email]);
    console.log("Chat", chat)
    const getChat = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/chat/getMessage/${chat}/${user._id}`,
                config
            );
            setMessages(data.messages);
        } catch (err) {
            console.error("getChat error", err);
        }
    };

    const sendChat = async () => {
        if (!newMessage.trim()) return;
        try {
            await axios.post(
                `${process.env.REACT_APP_API}/chat/sendMessage`,
                { chat, senderId: user?._id, message: newMessage },
                config
            );
            socket.emit("send-chat", {
                id: userId,
                message: { text: newMessage, userId: user._id },
            });
            setMessages([...messages, { text: newMessage, userId: user._id }]);
            setNewMessage("");
        } catch (err) {
            console.error("sendChat error", err);
        }
    };

    useEffect(() => {
        getChat();
        socket.on("push-chat", (data) => {
            setMessages((prevChats) => [...prevChats, data.message]);
        });
        return () => socket.off("push-chat");
    }, []);

    return (
        <div className="chat-container">
            <div className="chat-header">{email || "Chat"}</div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.userId === user._id ? "right" : "left"}`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <IoSend className="chat-send" onClick={sendChat} />
            </div>
        </div>
    );
};

export default UserChat;
