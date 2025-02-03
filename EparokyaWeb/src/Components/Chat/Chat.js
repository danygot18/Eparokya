import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IoSend } from "react-icons/io5";
import { socket } from "../../socket/index";
import "./Chat.css"; // Import the CSS file
import { DateLocalizer } from "react-big-calendar";

const UserChat = () => {
    const { chat, email } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const config = {
        withCredentials: true
    };

    const getChat = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/chat/getMessage/${chat}/${user._id}`,
                config
            );
            setMessages(data.messages.reverse());
        } catch (err) {
            console.error("getChat error", err);
        }
    };

    const sendChat = async () => {
        if (!newMessage.trim()) return;
        try {

            const {data} = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/chat/sendMessage`,
                { 
                    userId: chat,  // Fix: Change `user` to `userId`
                    senderId: user?._id, // Fix: Change `sender` to `senderId`
                    message: newMessage 
                }, 
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            // console.log("web chat", data)

            socket.emit("send-chat", {
                id: chat,
                message: { message: newMessage, senderId: user._id },
                chat: data.chat
            });
    
            setMessages([...messages, { message: newMessage, sender: {_id: user._id} }]);
            setNewMessage("");
        } catch (err) {
            console.error("sendChat error", err.response?.data || err.message);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        getChat();
        socket.on("push-message", (data) => {
            const message = {
                message: data.message.text,
                sender: {
                    _id: data.message.user._id
                }
            }
            console.log("Message", message)
            setMessages((prevChats) => [...prevChats, message]);
            console.log("data sa web", data)
            
        });
        socket.emit('join', { userId: user._id });

        return () => socket.off("push-message");

        
    }, [socket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    console.log(messages)
    return (
        <div className="chat-container">
            <div className="chat-header">{email || "Chat"}</div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender?._id === user?._id ? "right" : "left"}`}
                    >
                        {msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
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