import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../SideBar";
import MassWeddingChecklist from "../MassForms/MassWeddingChecklist";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardMedia,
  Grid2,
  Modal,
  Button,
} from "@mui/material";

const WeddingDetails = () => {
  const { massWeddingId } = useParams();
  console.log("Wedding ID:", massWeddingId);

  const navigate = useNavigate();
  const [weddingDetails, setWeddingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedComment, setSelectedComment] = useState("");
  const [additionalComment, setAdditionalComment] = useState("");

  const [newDate, setNewDate] = useState("");
  const [reason, setReason] = useState("");
  const [updatedWeddingDate, setUpdatedWeddingDate] = useState(
    weddingDetails?.weddingDate || ""
  );

  const [preMarriageSeminarDate, setPreMarriageSeminarDate] = useState("");
  const [preMarriageSeminarTime, setPreMarriageSeminarTime] = useState("");

  const [canonicalInterviewDate, setCanonicalInterviewDate] = useState("");
  const [canonicalInterviewTime, setCanonicalInterviewTime] = useState("");

  const [confessionDate, setConfessionDate] = useState("");
  const [confessionTime, setConfessionTime] = useState("");

  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 1));
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [comments, setComments] = useState([]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "N/A";

  useEffect(() => {
    const fetchWeddingDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/massWedding/getmassWeddingById/${massWeddingId}`,
          { withCredentials: true }
        );

        console.log("API Response:", response.data);
        setWeddingDetails(response.data);
        setComments(response.data.comments || []);

        if (response.data.weddingDateTime) {
          setUpdatedWeddingDate(response.data.weddingDateTime);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch wedding details.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeddingDetails();
  }, [massWeddingId]);

  const groomDocs = [
    "GroomNewBaptismalCertificate",
    "GroomNewConfirmationCertificate",
    "GroomMarriageLicense",
    "GroomMarriageBans",
    "GroomOrigCeNoMar",
    "GroomOrigPSA",
    "GroomPermitFromtheParishOftheBride",
    "GroomChildBirthCertificate",
    "GroomOneByOne",
  ];

  const brideDocs = [
    "BrideNewBaptismalCertificate",
    "BrideNewConfirmationCertificate",
    "BrideMarriageLicense",
    "BrideMarriageBans",
    "BrideOrigCeNoMar",
    "BrideOrigPSA",
    "BridePermitFromtheParishOftheBride",
    "BrideChildBirthCertificate",
    "BrideOneByOne",
  ];

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage("");
    setIsModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const predefinedComments = [
    "Confirmed",
    "Pending Confirmation",
    "Rescheduled",
    "Cancelled",
  ];

  const handleSubmitComment = async () => {
    if (!selectedComment && !additionalComment) {
      toast.error("Please select or enter a comment.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }

    const commentData = {
      selectedComment: selectedComment || "",
      additionalComment: additionalComment || "",
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/v1/massWedding/${massWeddingId}/commentMassWedding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commentData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit comment.");
      }

      toast.success("Comment submitted successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to submit comment.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  const updateAdditionalReq = async () => {
    try {
      const additionalReq = {
        PreMarriageSeminar: {
          date: preMarriageSeminarDate,
          time: preMarriageSeminarTime,
        },
        CanonicalInterview: {
          date: canonicalInterviewDate,
          time: canonicalInterviewTime,
        },
        Confession: {
          date: confessionDate,
          time: confessionTime,
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/massWedding/updateAdditionalMassReq/${massWeddingId}`,
        { additionalReq },
        { withCredentials: true }
      );

      toast.success("Additional requirements updated successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      setWeddingDetails(response.data.wedding);
    } catch (err) {
      console.error("Error updating additional requirements:", err);
      toast.error("Failed to update additional requirements.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  const handleConfirm = async (massWeddingId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/massWedding/${massWeddingId}/confirmMassWedding`,
        { withCredentials: true }
      );
      console.log("Confirmation response:", response.data);
      toast.success("Wedding confirmed successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } catch (error) {
      console.error(
        "Error confirming wedding:",
        error.response || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to confirm the wedding.",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        }
      );
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a cancellation reason.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/massWedding/declineMassWedding/${massWeddingId}`,
        { reason: cancelReason },
        { withCredentials: true }
      );

      toast.success("Wedding cancelled successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setShowCancelModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel the wedding.",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="wedding-details-page">
      <SideBar />
      <div className="wedding-details-container">
        <h1>Wedding Details</h1>
        {/* Three Container */}
        <div className="Wedding-three-container-layout">
          {/* Left */}
          <div className="Wedding-left-container">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Wedding Information */}
              <Typography variant="h5" gutterBottom>
                Wedding Information
              </Typography>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Wedding Date and Time
                  </Typography>
                  <Typography>
                    <strong>Wedding Date and Time:</strong>{" "}
                    {weddingDetails?.weddingDateTime?.date
                      ? `${format(
                          new Date(weddingDetails.weddingDateTime.date),
                          "MMMM dd, yyyy"
                        )} at ${weddingDetails.weddingDateTime.time || "N/A"}`
                      : "N/A"}
                  </Typography>
                </CardContent>
              </Card>

              {/* Bride & Groom Details */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                }}
              >
                {/* Bride Details */}
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6">Bride Details</Typography>
                    <Typography>
                      <strong>Name:</strong>{" "}
                      {weddingDetails?.brideName || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Birth Date:</strong>{" "}
                      {formatDate(weddingDetails?.brideBirthDate)}
                    </Typography>
                    <Typography>
                      <strong>Occupation:</strong>{" "}
                      {weddingDetails?.brideOccupation || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Religion:</strong>{" "}
                      {weddingDetails?.brideReligion || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Phone:</strong>{" "}
                      {weddingDetails?.bridePhone || "N/A"}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Groom Details */}
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6">Groom Details</Typography>
                    <Typography>
                      <strong>Name:</strong>{" "}
                      {weddingDetails?.groomName || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Birth Date:</strong>{" "}
                      {formatDate(weddingDetails?.groomBirthDate)}
                    </Typography>
                    <Typography>
                      <strong>Occupation:</strong>{" "}
                      {weddingDetails?.groomOccupation || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Religion:</strong>{" "}
                      {weddingDetails?.groomReligion || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Phone:</strong>{" "}
                      {weddingDetails?.groomPhone || "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Parents Details */}
              <Card>
                <CardContent>
                  <Typography variant="h6">Parents</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={{ flex: "1 1 200px" }}>
                      <strong>Bride Father:</strong>{" "}
                      {weddingDetails?.brideFather || "N/A"}
                    </Typography>
                    <Typography sx={{ flex: "1 1 200px" }}>
                      <strong>Bride Mother:</strong>{" "}
                      {weddingDetails?.brideMother || "N/A"}
                    </Typography>
                    <Typography sx={{ flex: "1 1 200px" }}>
                      <strong>Groom Father:</strong>{" "}
                      {weddingDetails?.groomFather || "N/A"}
                    </Typography>
                    <Typography sx={{ flex: "1 1 200px" }}>
                      <strong>Groom Mother:</strong>{" "}
                      {weddingDetails?.groomMother || "N/A"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Ninong & Ninang */}
              {["Ninong", "Ninang"].map((role) => (
                <Card key={role}>
                  <CardContent>
                    <Typography variant="h6">{role}</Typography>
                    {weddingDetails?.[role]?.length > 0 ? (
                      weddingDetails[role].map((person, index) => (
                        <Typography key={index}>
                          <strong>{person.name}:</strong>{" "}
                          {person.address.street}, {person.address.city},{" "}
                          {person.address.zip}
                        </Typography>
                      ))
                    ) : (
                      <Typography>No {role} details available.</Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Groom Documents */}
              <Typography variant="h5" gutterBottom>
                Groom Documents
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {groomDocs.map((doc, index) => (
                  <Card
                    key={index}
                    sx={{ flex: "1 1 300px", maxWidth: "400px" }}
                  >
                    <CardContent>
                      <Typography variant="body1" fontWeight="bold">
                        {doc.replace(/([A-Z])/g, " $1").trim()}:
                      </Typography>
                      {weddingDetails?.[doc]?.url ? (
                        <CardMedia
                          component="img"
                          image={weddingDetails[doc].url}
                          alt={doc}
                          sx={{
                            maxWidth: 100,
                            maxHeight: 100,
                            objectFit: "contain",
                            cursor: "pointer",
                            borderRadius: 1,
                            mt: 1,
                          }}
                          onClick={() => openModal(weddingDetails[doc].url)}
                        />
                      ) : (
                        <Typography color="textSecondary">N/A</Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Bride Documents */}
              <Typography variant="h5" gutterBottom>
                Bride Documents
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {brideDocs.map((doc, index) => (
                  <Card
                    key={index}
                    sx={{ flex: "1 1 300px", maxWidth: "400px" }}
                  >
                    <CardContent>
                      <Typography variant="body1" fontWeight="bold">
                        {doc.replace(/([A-Z])/g, " $1").trim()}:
                      </Typography>
                      {weddingDetails?.[doc]?.url ? (
                        <CardMedia
                          component="img"
                          image={weddingDetails[doc].url}
                          alt={doc}
                          sx={{
                            maxWidth: 100,
                            maxHeight: 100,
                            objectFit: "contain",
                            cursor: "pointer",
                            borderRadius: 1,
                            mt: 1,
                          }}
                          onClick={() => openModal(weddingDetails[doc].url)}
                        />
                      ) : (
                        <Typography color="textSecondary">N/A</Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </div>
          <div className="Wedding-right-container">
            <MassWeddingChecklist massWeddingId={massWeddingId} />
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            ></Box>
          </div>
          {/* Modal */}

          <Modal open={isModalOpen} onClose={closeModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 3,
                maxWidth: "90vw",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 2,
              }}
            >
              {/* Header with Close Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mb: 2,
                }}
              >
                <Button
                  onClick={closeModal}
                  variant="contained"
                  sx={{ mx: 1 }}
                  size="small"
                >
                  Close
                </Button>
                <Box>
                  <Button
                    onClick={handleZoomIn}
                    variant="outlined"
                    sx={{ mx: 1 }}
                    style={{ marginBottom: "10px" }}
                  >
                    Zoom In
                  </Button>
                  <Button
                    onClick={handleZoomOut}
                    variant="outlined"
                    sx={{ mx: 1 }}
                  >
                    Zoom Out
                  </Button>
                </Box>
              </Box>

              {/* Image Container */}
              <Box
                sx={{
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "80vh",
                  cursor: isDragging ? "grabbing" : "grab",
                  border: "1px solid #ddd",
                  position: "relative",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  src={selectedImage}
                  alt="Certificate Preview"
                  style={{
                    transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                    transition: isDragging ? "none" : "transform 0.3s ease",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    cursor: isDragging ? "grabbing" : "grab",
                  }}
                  draggable={false}
                />
              </Box>
            </Box>
          </Modal>
        </div>
        <div className="Wedding-down-container-layout">
          {/* Additional Admin Comment */}
          <div className="Down-left-container">
            <div className="wedding-details-box">
              <h2>Additional Requirements</h2>

              <div className="requirement-section">
                <h3>Pre Marriage Seminar </h3>
                <div className="input-row">
                  <label>Date:</label>
                  <input
                    type="date"
                    value={preMarriageSeminarDate}
                    onChange={(e) => setPreMarriageSeminarDate(e.target.value)}
                  />
                  <label>Time:</label>
                  <input
                    type="time"
                    value={preMarriageSeminarTime}
                    onChange={(e) => setPreMarriageSeminarTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="requirement-section">
                <h3>Canonical Interview</h3>
                <div className="input-row">
                  <label>Date:</label>
                  <input
                    type="date"
                    value={canonicalInterviewDate}
                    onChange={(e) => setCanonicalInterviewDate(e.target.value)}
                  />
                  <label>Time:</label>
                  <input
                    type="time"
                    value={canonicalInterviewTime}
                    onChange={(e) => setCanonicalInterviewTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="requirement-section">
                <h3>Confession</h3>
                <div className="input-row">
                  <label>Date:</label>
                  <input
                    type="date"
                    value={confessionDate}
                    onChange={(e) => setConfessionDate(e.target.value)}
                  />
                  <label>Time:</label>
                  <input
                    type="time"
                    value={confessionTime}
                    onChange={(e) => setConfessionTime(e.target.value)}
                  />
                </div>
              </div>

              <button onClick={updateAdditionalReq}>
                Submit Additional Requirements
              </button>
            </div>
          </div>

          <div className="Down-right-container">
            {/* Comments of the Admin Display */}
            <div className="admin-comments-section">
              <h3>Admin Comments</h3>
              {weddingDetails?.comments?.length > 0 ? (
                weddingDetails.comments.map((comment, index) => (
                  <div key={index} className="admin-comment">
                    <p className="comment-date">
                      {new Date(comment?.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Comment:</strong>{" "}
                      {comment?.selectedComment || "N/A"}
                    </p>
                    <p>
                      <strong>Additional Comment:</strong>{" "}
                      {comment?.additionalComment || "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <p>No admin comments yet.</p>
              )}
            </div>

            {/* For Additional Requirements */}
            <div className="additional-req-comments">
              <h3>Additional Requirements</h3>
              {weddingDetails?.additionalReq ? (
                <div className="req-details">
                  <div className="req-detail">
                    <p>
                      <strong>Pre Marriage Seminar 1 Date and Time:</strong>{" "}
                      {weddingDetails.additionalReq.PreMarriageSeminar?.date
                        ? new Date(
                            weddingDetails.additionalReq.PreMarriageSeminar.date
                          ).toLocaleDateString()
                        : "N/A"}{" "}
                      at{" "}
                      {weddingDetails.additionalReq.PreMarriageSeminar?.time ||
                        "N/A"}
                    </p>
                  </div>

                  <div className="req-detail">
                    <p>
                      <strong>Canonical Interview Date and Time:</strong>{" "}
                      {weddingDetails.additionalReq.CanonicalInterview?.date
                        ? new Date(
                            weddingDetails.additionalReq.CanonicalInterview.date
                          ).toLocaleDateString()
                        : "N/A"}{" "}
                      at{" "}
                      {weddingDetails.additionalReq.CanonicalInterview?.time ||
                        "N/A"}
                    </p>
                  </div>

                  <div className="req-detail">
                    <p>
                      <strong>Confession Date and Time:</strong>{" "}
                      {weddingDetails.additionalReq.Confession?.date
                        ? new Date(
                            weddingDetails.additionalReq.Confession.date
                          ).toLocaleDateString()
                        : "N/A"}{" "}
                      at{" "}
                      {weddingDetails.additionalReq.Confession?.time || "N/A"}
                    </p>
                  </div>

                  <p className="req-updated">
                    <strong>Last Updated:</strong>{" "}
                    {weddingDetails.additionalReq?.createdAt
                      ? new Date(
                          weddingDetails.additionalReq.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              ) : (
                <p>No additional requirements have been set yet.</p>
              )}
            </div>

            {/* Creating Admin Comment */}
            <div className="admin-section">
              <h2>Submit Admin Comment</h2>
              <select
                value={selectedComment}
                onChange={(e) => setSelectedComment(e.target.value)}
              >
                <option value="" disabled>
                  Select a comment
                </option>
                {predefinedComments.map((comment, index) => (
                  <option key={index} value={comment}>
                    {comment}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Additional Comment (optional)"
                value={additionalComment}
                onChange={(e) => setAdditionalComment(e.target.value)}
              />
              <button onClick={handleSubmitComment}>Submit Comment</button>
            </div>

            {/* Cancelling Reason Section */}
            {weddingDetails?.weddingStatus === "Cancelled" &&
            weddingDetails?.cancellingReason ? (
              <div className="house-comments-section">
                <h2>Cancellation Details</h2>
                <div className="admin-comment">
                  <p>
                    <strong>Cancelled By:</strong>{" "}
                    {weddingDetails.cancellingReason.user === "Admin"
                      ? "Admin"
                      : weddingDetails.cancellingReason.user}
                  </p>
                  <p>
                    <strong>Reason:</strong>{" "}
                    {weddingDetails.cancellingReason.reason ||
                      "No reason provided."}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Cancel Button */}
            <div className="button-container">
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={
                  weddingDetails?.weddingStatus === "Confirmed" ||
                  weddingDetails?.weddingStatus === "Cancelled"
                }
              >
                Cancel Wedding
              </button>
            </div>

            {/* Cancellation Modal */}
            {showCancelModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>Cancel Wedding</h3>
                  <p>Please provide a reason for cancellation:</p>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Enter reason..."
                    className="modal-textarea"
                  />
                  <div className="modal-buttons">
                    <button onClick={handleCancel}>Confirm Cancel</button>
                    <button onClick={() => setShowCancelModal(false)}>
                      Back
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            style={{
              justifyContent: "center",
              marginTop: "20px",
              borderRadius: "10px",
            }}
          >
            <div className="button-container">
              <button
                onClick={() =>
                  navigate(
                    `/adminChat/${weddingDetails?.userId?._id}/${weddingDetails?.userId?.email}`
                  )
                }
              >
                Go to Admin Chat
              </button>
            </div>
            <button
              onClick={() => handleConfirm(massWeddingId)}
              disabled={
                weddingDetails?.weddingStatus === "Confirmed" ||
                weddingDetails?.weddingStatus === "Cancelled"
              }
            >
              Confirm Wedding
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingDetails;
