import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaThumbsUp,
  FaReply,
  FaPaperPlane,
} from "react-icons/fa";
import { parseISO, format } from "date-fns";
import { toast } from "react-toastify";
import GuestSideBar from "./GuestSideBar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import MetaData from "./Layout/MetaData";

const AnnouncementDetails = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [likedUsers, setLikedUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [currentReply, setCurrentReply] = useState({});
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedReplies, setExpandedReplies] = useState({});
  const config = { withCredentials: true };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/profile`,
          config
        );
        if (response.data.user) {
          setUser(response.data.user);
          setUserId(response.data.user._id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAnnouncement();
      fetchComments();
    }
    // eslint-disable-next-line
  }, [id, userId]);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAnnouncement/${id}`
      );
      setAnnouncement(res.data.announcement);
      setLikedUsers(res.data.announcement.likedBy);
    } catch (error) {
      console.error("Error fetching announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/comments/${id}`
      );
      setComments(res.data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/likeAnnouncement/${id}`,
        {},
        config
      );
      setAnnouncement(res.data.data);
      setLikedUsers(res.data.data.likedBy);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/${id}/announcementComment`,
        { text: commentText },
        config
      );
      if (
        res.data.message ===
        "Your comment contains a profane word, please revise it."
      ) {
        toast.error(res.data.message);
      } else {
        setComments([...comments, res.data.data]);
        setCommentText("");
        toast.success("Comment added successfully!");
      }
    } catch (error) {
      toast.error("Your comment may contain a profane word, please revise it");
    }
  };

  const toggleLikeComment = async (commentId) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/announcementCommentLike/${commentId}`,
        { userId },
        config
      );
      const updatedComment = res.data.data;
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
    } catch (error) {
      console.error("Error toggling like on comment:", error);
    }
  };

  const addReply = async (commentId, replyText) => {
    if (!replyText.trim()) return;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/announcementReply/${commentId}`,
        { text: replyText },
        config
      );
      if (
        res.data.message ===
        "Your reply contains a profane word, please revise it."
      ) {
        toast.error(res.data.message);
      } else {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, replies: [...comment.replies, res.data.data] }
              : comment
          )
        );
        setCurrentReply((prev) => ({ ...prev, [commentId]: "" }));
        toast.success("Reply added successfully!");
      }
    } catch (error) {
      toast.error("Your reply may contain a profane word, please revise it.");
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const renderUserName = (user) => (
    <Typography fontWeight="bold" color="success.main">
      {user ? user.name : "Deleted User"}
    </Typography>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="row" bgcolor="#f9f9f9" minHeight="100vh">
      <MetaData title="Announcement Details" />
      <GuestSideBar />
      <Box flex={1} p={3} maxWidth={900} mx="auto">
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          {announcement ? (
            <>
              {/* Header */}
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  src="/EPAROKYA-SYST.png"
                  alt="Saint Joseph Parish - Taguig"
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                  <Typography fontWeight="bold" fontSize={18}>
                    Saint Joseph Parish - Taguig
                  </Typography>
                  <Typography color="text.secondary" fontSize={14}>
                    {announcement.dateCreated
                      ? format(parseISO(announcement.dateCreated), "PPP")
                      : "Date not available"}
                  </Typography>
                </Box>
              </Box>

              {/* Title & Description */}
              <Typography variant="h4" fontWeight="bold" color="success.main" mb={1}>
                {announcement.name}
              </Typography>
              <Typography mb={2}>{announcement.description}</Typography>
              {announcement.richDescription && (
                <Typography
                  mb={2}
                  dangerouslySetInnerHTML={{ __html: announcement.richDescription }}
                />
              )}

              {/* Images */}
              {announcement.images.length > 1 ? (
                <Swiper modules={[Navigation]} navigation style={{ marginBottom: 16 }}>
                  {announcement.images.map((img) => (
                    <SwiperSlide key={img.public_id}>
                      <img
                        src={img.url}
                        alt="Announcement"
                        style={{
                          width: "100%",
                          maxHeight: 350,
                          objectFit: "cover",
                          borderRadius: 10,
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                announcement.images.length === 1 && (
                  <img
                    src={announcement.images[0].url}
                    alt="Announcement"
                    style={{
                      width: "100%",
                      maxHeight: 350,
                      objectFit: "cover",
                      borderRadius: 10,
                      marginBottom: 16,
                    }}
                  />
                )
              )}

              {/* Videos */}
              {announcement.videos.length > 0 &&
                announcement.videos.map((video) => (
                  <video
                    key={video}
                    controls
                    style={{
                      width: "100%",
                      maxHeight: 350,
                      borderRadius: 10,
                      marginBottom: 16,
                    }}
                  >
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ))}

              {/* Tags */}
              <Box mb={2}>
                {announcement.tags.map((tag) => (
                  <span key={tag} style={{
                    background: "#e0f2f1",
                    color: "#388e3c",
                    borderRadius: 8,
                    padding: "2px 10px",
                    marginRight: 6,
                    fontSize: 13,
                  }}>
                    #{tag}
                  </span>
                ))}
              </Box>

              {/* Like Section */}
              <div className="like-section">
                <FaHeart
                  color={
                    announcement?.likedBy?.some(
                      (likerId) =>
                        likerId === userId ||
                        likerId?._id === userId ||
                        likerId?.toString?.() === userId
                    )
                      ? "red"
                      : "gray"
                  }
                  onClick={toggleLike}
                />
                <span>{announcement?.likedBy?.length || 0} Likes</span>
              </div>

              <Divider sx={{ my: 2 }} />

              {/* Comments Section */}
              <div className="comments-section">
                <h4>Comments</h4>
                <div className="comment-input-container">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="comment-textarea"
                  />
                  <FaPaperPlane
                    size={20}
                    onClick={addComment}
                    className="submit-comment-icon"
                  />
                </div>

                {comments.map((comment) => (
                  <div key={comment._id} className="comment-box">
                    <div className="comment-header">
                      <img
                        src={comment.user?.avatar?.url || "/default-avatar.png"}
                        alt={comment.user?.name || "Deleted User"}
                        className="comment-avatar"
                      />
                      <div className="comment-user-info">
                        <span className="user-name">
                          {renderUserName(comment.user)}
                        </span>
                        <p className="comment-date">
                          {format(new Date(comment.dateCreated), "PPP")}
                        </p>
                      </div>
                    </div>

                    <p className="comment-text">{comment.text}</p>

                    <div className="comment-footer">
                      <FaThumbsUp
                        color={
                          comment.likedBy.some(
                            (likerId) =>
                              likerId === user._id || 
                              likerId?._id === user._id || 
                              likerId?.toString?.() === user._id 
                          )
                            ? 'blue'
                            : 'gray'
                        }
                        onClick={() => toggleLikeComment(comment._id)}
                      />
                      <span>{comment.likedBy.length} Likes</span>
                      <FaReply onClick={() => toggleReplies(comment._id)} />
                      <span>{comment.replies.length} Replies</span>
                    </div>

                    {expandedReplies[comment._id] && (
                      <div className="replies-section">
                        {comment.replies.map((reply) => (
                          <div key={reply._id} className="reply-box">
                            <div className="comment-header">
                              <img
                                src={
                                  reply.user?.avatar?.url ||
                                  "/default-avatar.png"
                                }
                                alt={reply.user?.name || "Deleted User"}
                                className="comment-avatar"
                              />
                              <div>
                                {renderUserName(reply.user)}
                                <p className="comment-date">
                                  {format(new Date(reply.dateCreated), "PPP")}
                                </p>
                              </div>
                            </div>
                            <p className="comment-text">{reply.text}</p>
                          </div>
                        ))}

                        <div className="reply-input-container">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={currentReply}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="reply-input"
                          />
                          <FaPaperPlane
                            size={18}
                            onClick={() => addReply(comment._id, currentReply)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Typography>Announcement not found.</Typography>
          )}
        </Paper>

        {/* Liked Users Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            Liked by
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {likedUsers.map((user) => (
              <Box key={user._id} display="flex" alignItems="center" mr={2} mb={1}>
                <Avatar
                  src={user.avatar?.url || "/default-avatar.png"}
                  alt={user.name || "User"}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Typography fontSize={14}>{user.name || "Anonymous"}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default AnnouncementDetails;