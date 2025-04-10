import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaThumbsUp,
  FaRegThumbsUp,
  FaReply,
  FaPaperPlane,
} from "react-icons/fa";
import { parseISO, format } from "date-fns";
import { toast } from "react-toastify";
import GuestSideBar from "./GuestSideBar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Box, Typography } from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import CircularProgress from "@mui/material/CircularProgress";

const AnnouncementDetails = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likedUsers, setLikedUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

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
        console.error(
          "Error fetching user:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAnnouncement();
      fetchComments();
    }
  }, [id, userId]);

  const fetchAnnouncement = async () => {
    try {
      console.log("Fetching announcement ID:", id);
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAnnouncement/${id}`
      );
      setAnnouncement(res.data.announcement);
      setLikeCount(res.data.announcement.likedBy.length);
      setLikedUsers(res.data.announcement.likedBy);

      if (res.data.announcement.likedBy.includes(userId)) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    } catch (error) {
      console.error("Error fetching announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/comments/${id}`
      );
      setComments(res.data.data);
      console.log("Comments:", res.data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/likeAnnouncement/${id}`,
        { userId },
        { withCredentials: true }
      );

      const isLikedNow = response.data.liked;

      setAnnouncement((prev) => ({
        ...prev,
        likedBy: isLikedNow
          ? [...prev.likedBy, userId]
          : prev.likedBy.filter((uid) => uid !== userId),
      }));

      setLikeCount((prev) => (isLikedNow ? prev + 1 : prev - 1));
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
      console.error("Error adding comment:", error);
      toast.error("Your comment may contain a profane word, please revise it");
    }
  };

  const toggleLikeComment = async (commentId) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/anouncementCommentLike/${commentId}`,
        {},
        config
      );

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, likedBy: res.data.data.likedBy }
            : comment
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
        setReplyText("");
        toast.success("Reply added successfully!");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Your reply may contain a profane word, please revise it.");
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const renderUserName = (user) => {
    if (!user) {
      return (
        <p
          className="comment-user"
          style={{ fontWeight: "bold", color: "#26572E" }}
        >
          Deleted User
        </p>
      );
    }
    return (
      <p
        className="comment-user"
        style={{ fontWeight: "bold", color: "#26572E" }}
      >
        {user.name}
      </p>
    );
  };

  //   if (loading) return <p>Loading...</p>;
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="announcement-details-container">
      <GuestSideBar />
      <div className="announcement-container">
        {announcement ? (
          <>
            <div className="post-header">
              <img
                src="/public/../EPAROKYA-SYST.png"
                alt="Saint Joseph Parish - Taguig"
                className="profile-image"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
              <div className="post-user-info">
                <p className="post-user-name">Saint Joseph Parish - Taguig</p>
                <p className="post-date">
                  {announcement.createdAt
                    ? format(parseISO(announcement.createdAt), "PPP")
                    : "Date not available"}
                </p>
              </div>
            </div>

            {/* Title & Description */}
            <h1 className="announcement-title">{announcement.name}</h1>
            <p>{announcement.description}</p>
            <p
              dangerouslySetInnerHTML={{ __html: announcement.richDescription }}
            ></p>

            {/* Image Slider / Single Image */}
            {announcement.images.length > 1 ? (
              <Swiper modules={[Navigation]} navigation>
                {announcement.images.map((img, index) => (
                  <SwiperSlide key={img.public_id}>
                    <img
                      src={img.url}
                      alt="Announcement"
                      className="announcement-image"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              announcement.images.length === 1 && (
                <img
                  src={announcement.images[0].url}
                  alt="Announcement"
                  className="announcement-image"
                />
              )
            )}
            {announcement.videos.length > 0 &&
              announcement.videos.map((video) => (
                <video key={video} controls className="announcement-video">
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}

            <div className="tags">
              {announcement.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="like-section">
              <button onClick={toggleLike} className="like-btn">
                {liked ? <FaHeart color="red" /> : <FaRegHeart />}
              </button>
              <span>{likeCount} Likes</span>
            </div>

            {/* Comments Section */}
            <div className="comments-section">
              <h2>Comments</h2>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
              />
              <button onClick={addComment}>Post Comment</button>

              {comments.map((comment) => (
                <div key={comment._id} className="comment-box">
                  <div className="comment-header">
                    <img
                      src={comment.user?.avatar?.url || "/default-avatar.png"}
                      alt={comment.user?.name || "Deleted User"}
                      className="comment-avatar"
                    />
                    <div>
                      {renderUserName(comment.user)}
                      <p className="comment-date">
                        {format(new Date(comment.dateCreated), "PPP")}
                      </p>
                    </div>
                  </div>
                  <p className="comment-text">{comment.text}</p>

                  <div className="comment-footer">
                    <button
                      onClick={() => toggleLikeComment(comment._id)}
                      className="icon-btn"
                    >
                      {comment.likedBy.includes(user._id) ? (
                        <FaThumbsUp />
                      ) : (
                        <FaRegThumbsUp />
                      )}
                    </button>
                    <span>{comment.likedBy.length} Likes</span>

                    <button
                      onClick={() => toggleReplies(comment._id)}
                      className="icon-btn"
                    >
                      <FaReply />
                    </button>
                    <span>{comment.replies.length} Replies</span>
                  </div>

                  {expandedReplies[comment._id] && (
                    <div className="replies-section">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="reply-box">
                          <div className="comment-header">
                            <img
                              src={
                                reply.user?.avatar?.url || "/default-avatar.png"
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
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="reply-input"
                        />
                        <button
                          onClick={() => addReply(comment._id, replyText)}
                          className="submit-reply-btn"
                        >
                          <FaPaperPlane size={18} />
                        </button>
                        <button
                          onClick={() => setReplyText("")}
                          className="clear-reply-btn"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Announcement not found.</p>
        )}
      </div>

      <div className="liked-users-container">
        <h3>Likes</h3>
        <div className="liked-users-list">
          {likedUsers.length > 0 ? (
            likedUsers.map((user) => (
              <div key={user._id} className="liked-user">
                <img
                  src={user.avatar?.url}
                  alt={user.name}
                  className="user-avatar"
                />
                <span>{user.name}</span>
              </div>
            ))
          ) : (
            <p>No likes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails;
