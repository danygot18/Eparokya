import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import GuestSideBar from "../GuestSideBar";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Divider,
  useTheme,
  Avatar,
  Badge,
} from "@mui/material";
import { format } from "date-fns";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  const config = { withCredentials: true };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/chat/getAllMessage/${user._id}`,
          config
        );
        setChats(data.users || []);
        console.log("Fetched chats:", data.users);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user._id]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <GuestSideBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            width: "75%",
            maxWidth: 900,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Chat List
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Loading chats...
              </Typography>
            </Stack>
          ) : chats.length > 0 ? (
            <List sx={{ width: "100%" }}>
              {chats.map((chat) => (
                <ListItem
                  key={chat.id}
                  disablePadding
                  sx={{
                    mb: 1,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      transition: "transform 0.2s ease-in-out",
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => navigate(`/chat/${chat.id}/${chat.email}`)}
                    sx={{
                      borderRadius: 2,
                      p: 2,
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
                      sx={{
                        "& .MuiBadge-badge": {
                          right: 6,
                          bottom: 6,
                          height: 12,
                          minWidth: 12,
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        {chat.email.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          color={theme.palette.text.primary}
                        >
                          {chat.email}
                        </Typography>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color={theme.palette.text.secondary}
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "70%",
                            }}
                          >
                            {chat.lastMessageSender?.name
                              ? `${chat.lastMessageSender.name}: `
                              : ""}
                            {chat.lastMessage || "No messages yet"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color={theme.palette.text.disabled}
                          >
                            {(() => {
                              try {
                                const date = new Date(chat.lastMessageAt);
                                if (isNaN(date.getTime())) return "N/A";
                                return format(date, "h:mm a");
                              } catch (err) {
                                console.error(
                                  "Error formatting lastMessageAt:",
                                  chat.lastMessageAt,
                                  err
                                );
                                return "N/A";
                              }
                            })()}
                          </Typography>
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
              variant="body1"
              sx={{ py: 2, textAlign: "center", color: "text.secondary" }}
            >
              No chats available.
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatList;