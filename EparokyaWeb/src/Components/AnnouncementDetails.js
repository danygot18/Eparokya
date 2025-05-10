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

  //create a function of this, wala syang function na ng like
  const [likeCommentCount, setLikeCommentCount] = useState([]);
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

  useEffect(() => {
    if (announcement && userId) {
      const isLikedNow = announcement.likedBy.includes(userId);
      setLiked(isLikedNow);
    }
  }, [announcement, userId, id]);

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

      setLiked(isLikedNow);

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
    setComments((prevComments) =>
        prevComments.map((comment) => {
            if (comment._id === commentId) {
                const alreadyLiked = comment.likedBy.includes(user._id);
                return {
                    ...comment,
                    likedBy: alreadyLiked
                        ? comment.likedBy.filter((id) => id !== user._id)
                        : [...comment.likedBy, user._id],
                };
            }
            return comment;
        })
    );

    try {
        const res = await axios.put(
            `${process.env.REACT_APP_API}/api/v1/announcementCommentLike/${commentId}`
            ,
            { userId },       
            { withCredentials: true }
        );
        console.log(res.data.message);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <div className="announcement-details-container">
      <div className="announcement-center-container">
        {/* Sidebar */}
        <GuestSideBar />
        {/* Main Content */}
        <div className="announcement-container">
          {announcement ? (
            <>
              {/* Header Section */}
              <div className="post-header">
                <img
                  src="/public/../EPAROKYA-SYST.png"
                  alt="Saint Joseph Parish - Taguig"
                  className="profile-image-small"
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
              <p className="announcement-description">
                {announcement.description}
              </p>

              {/* Rich Description */}
              <p
                className="announcement-rich-description"
                dangerouslySetInnerHTML={{
                  __html: announcement.richDescription,
                }}
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
                <FaHeart color={liked ? "red" : "gray"} onClick={toggleLike} />
                <span>{likeCount} Likes</span>
              </div>

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
                          comment.likedBy.includes(user._id) ? "blue" : "gray"
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
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="reply-input"
                          />
                          <FaPaperPlane
                            size={18}
                            onClick={() => addReply(comment._id, replyText)}
                          />
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

        {/* Liked Users Section */}
        <div className="liked-users-container">
          <h3>Liked by</h3>
          <div className="liked-users-list">
            {likedUsers.map((user) => (
              <div key={user._id} className="liked-user">
                <img
                  src={user.avatar?.url || "/default-avatar.png"}
                  alt={user.name || "User"}
                  className="user-avatar"
                />
                <span>{user.name || "Anonymous"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails;
