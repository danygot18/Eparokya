import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IoSend } from "react-icons/io5";
import { socket } from "../../socket/index";
import "./../../Components/Chat/Chat.css";


const AdminChat = () => {
  const { chat, email } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const getChat = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/chat/getMessage/${chat}/${user._id}`,
          { withCredentials: true }
        );
        console.log("getChat data", data.messages);
        // Include createdAt in the messages
        setMessages(
          data.messages.reverse().map((msg) => ({
            ...msg,
            createdAt: new Date(msg.createdAt), // Ensure createdAt is a Date object
          }))
        );
      } catch (err) {
        console.error("getChat error", err);
      }
    };

    getChat();
    socket.on("push-message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: data.message.text,
          sender: { _id: data.message.user._id },
          createdAt: new Date(data.message.createdAt), // Include createdAt
        },
      ]);
    });
    getChat();

    socket.emit("join", { userId: user._id });

    return () => socket.off("push-message");
  }, [chat, user._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendChat = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/chat/sendMessage`,
        {
          userId: chat,
          senderId: user?._id,
          message: newMessage,
        },
        { withCredentials: true }
      );

      socket.emit("send-chat", {
        id: chat,
        message: {
          _id: Date.now(), // Add a unique ID
          text: newMessage, // Use 'text' instead of 'message'
          createdAt: new Date(), // Add a timestamp
          user: {
            _id: user._id,
            name: user.username, // Add the sender's name
            avatar: user.profile?.avatar?.url, // Add the sender's avatar URL if available
          },
        },
      });

      setMessages([
        ...messages,
        {
          message: newMessage,
          sender: { _id: user._id },
          createdAt: new Date(), // Include createdAt
        },
      ]);
      setNewMessage("");
    } catch (err) {
      console.error("sendChat error", err.response?.data || err.message);
    }
  };

  return (
    <div className="chat-containers">
     
      <div className="chat-box">
        <div className="chat-header">{email || "Chat"}</div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender?._id === user?._id ? "right" : "left"}`}
            >
              <p>{msg.message}</p>
              <span className="message-time">
                {msg.createdAt.toLocaleTimeString()} {/* Display the time */}
              </span>
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
    </div>
  );
};

export default AdminChat;
// import React, { useEffect, useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { IoSend } from "react-icons/io5";
// import { socket } from "../../socket/index";
// import "./Chat.css"; 
// import ChatSidebar from "./ChatSideBar";

// const Chat = () => {
//   const { chat, email } = useParams();
//   const { user } = useSelector((state) => state.auth);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const getChat = async () => {
//       try {
//         const { data } = await axios.get(
//           `${process.env.REACT_APP_API}/api/v1/chat/getMessage/${chat}/${user._id}`,
//           { withCredentials: true }
//         );
//         console.log("getChat data", data.messages);
//         setMessages(data.messages.reverse());
//       } catch (err) {
//         console.error("getChat error", err);
//       }
//     };

//     getChat();
//     socket.on("push-message", (data) => {
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { message: data.message.text, sender: { _id: data.message.user._id } },
//       ]);
//     });

//     socket.emit("join", { userId: user._id });

//     return () => socket.off("push-message");
//   }, [chat, user._id]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // const sendChat = async () => {
//   //   if (!newMessage.trim()) return;
//   //   try {
//   //     await axios.post(
//   //       `${process.env.REACT_APP_API}/api/v1/chat/sendMessage`,
//   //       {
//   //         userId: chat,
//   //         senderId: user?._id,
//   //         message: newMessage,
//   //       },
//   //       { withCredentials: true }
//   //     );

//   //     socket.emit("send-chat", {
//   //       id: chat,
//   //       message: { message: newMessage, senderId: user._id },
//   //     });

//   //     setMessages([...messages, { message: newMessage, sender: { _id: user._id } }]);
//   //     setNewMessage("");
//   //   } catch (err) {
//   //     console.error("sendChat error", err.response?.data || err.message);
//   //   }
//   // };
//   const sendChat = async () => {
//     if (!newMessage.trim()) return;
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API}/api/v1/chat/sendMessage`,
//         {
//           userId: chat,
//           senderId: user?._id,
//           message: newMessage,
//         },
//         { withCredentials: true }
//       );
  
//       socket.emit("send-chat", {
//         id: chat,
//         message: {
//           _id: Date.now(), // Add a unique ID
//           text: newMessage, // Use 'text' instead of 'message'
//           createdAt: new Date(), // Add a timestamp
//           user: {
//             _id: user._id,
//             name: user.username, // Add the sender's name
//             avatar: user.profile?.avatar?.url, // Add the sender's avatar URL if available
//           },
//         },
//       });
  
//       setMessages([...messages, { message: newMessage, sender: { _id: user._id } }]);
//       setNewMessage("");
//     } catch (err) {
//       console.error("sendChat error", err.response?.data || err.message);
//     }
//   };

//   return (
//     <div className="chat-containers">
//       <ChatSidebar />
//       <div className="chat-box">
//         <div className="chat-header">{email || "Chat"}</div>
//         <div className="chat-messages">
//           {messages.map((msg, index) => (
//             <div key={index} className={`message ${msg.sender?._id === user?._id ? "right" : "left"}`}>
//               <p>{msg.message}</p>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//         <div className="chat-input">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message..."
//           />
//           <IoSend className="chat-send" onClick={sendChat} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;
