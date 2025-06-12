import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Badge,
  Divider,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";

const ChatSidebar = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

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
    <Box
      sx={{
        width: 300, // Fixed width for the sidebar
        minWidth: 300, // Ensure it doesn't shrink below this
        height: "100vh",
        borderRight: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Chats
        </Typography>
      </Box>
      
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {loading ? (
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100px" 
          }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Loading chats...
            </Typography>
          </Box>
        ) : chats.length > 0 ? (
          <List sx={{ width: "100%", p: 0 }}>
            {chats.map((chat) => (
              <ListItem key={chat.id} disablePadding>
                <ListItemButton
                  onClick={() => navigate(`/chat/${chat.id}/${chat.email}`)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    color="primary"
                    invisible={!chat.hasUnreadMessages}
                  >
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 36,
                        height: 36,
                        mr: 2,
                      }}
                    >
                      {chat.email.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle2"
                        fontWeight="medium"
                        noWrap
                      >
                        {chat.email}
                      </Typography>
                    }
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{
                            maxWidth: 150,
                            display: "inline-block",
                          }}
                        >
                          {chat.lastMessageSender?.name
                            ? `${chat.lastMessageSender.name}: `
                            : ""}
                          {chat.lastMessage || "No messages yet"}
                        </Typography>
                        {chat.lastMessageAt && (
                          <Typography
                            variant="caption"
                            color="text.disabled"
                          >
                            {(() => {
                              try {
                                const date = new Date(chat.lastMessageAt);
                                if (isNaN(date.getTime())) return null;
                                return format(date, "h:mm a");
                              } catch (err) {
                                console.error("Error formatting date:", err);
                                return null;
                              }
                            })()}
                          </Typography>
                        )}
                      </Box>
                    }
                    sx={{ my: 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              textAlign: "center", 
              mt: 2,
              px: 2
            }}
          >
            No chats available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatSidebar;