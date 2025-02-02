import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const WeddingDetails = () => {
  const { weddingId } = useParams();
  console.log("Wedding ID:", weddingId);

  const navigate = useNavigate();
  const [weddingDetails, setWeddingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [priest, setPriest] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedComment, setSelectedComment] = useState("");
  const [rescheduledDate, setRescheduledDate] = useState("");
  const [rescheduledReason, setRescheduledReason] = useState("");
  const [additionalComment, setAdditionalComment] = useState("");

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [comments, setComments] = useState([]);


  useEffect(() => {
    const fetchWeddingDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getWeddingById/${weddingId}`,
          { withCredentials: true },

        );
        console.log("API Response:", response.data);
        setWeddingDetails(response.data);
        setComments(response.data.comments || []);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch wedding details.");
      } finally {
        setLoading(false);
      }
    };
    fetchWeddingDetails();
  }, [weddingId]);

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
    "Cancelled"
  ];

  const handleSubmitComment = () => {
    console.log({
      priest,
      selectedDate,
      selectedComment,
      rescheduledDate,
      rescheduledReason,
      additionalComment
    });
  };

  const handleConfirm = async (weddingId) => {
    try {

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/${weddingId}/confirm`,
        { withCredentials: true },

      );
      console.log("Confirmation response:", response.data);
      toast.success("Wedding confirmed successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error confirming wedding:", error.response || error.message);
      toast.error(
        error.response?.data?.message || "Failed to confirm the wedding.",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        }
      );
    }
  };



  const handleDecline = async (weddingId, token) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/${weddingId}/decline`,
        { withCredentials: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Declining response:", response.data);
      toast.success("Wedding declined successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error decline wedding:", error.response || error.message);
      toast.error(
        error.response?.data?.message || "Failed to decline the wedding.",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        }
      );
    }
  };


  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="wedding-details-page">
      <SideBar />
      <div className="wedding-details-content">
        <h1>Wedding Details</h1>
        <div className="details">
          <p>Bride Name: {weddingDetails?.bride || "N/A"}</p>
          <p>Bride Age: {weddingDetails?.brideAge || "N/A"}</p>
          <p>Bride Gender: {weddingDetails?.brideGender || "N/A"}</p>
          <p>Bride Phone: {weddingDetails?.bridePhone || "N/A"}</p>
          <p>Bride Address:
            {weddingDetails?.brideAddress?.state},
            {weddingDetails?.brideAddress?.zip},
            {weddingDetails?.brideAddress?.country}
          </p>

          <p>Groom Name: {weddingDetails?.groom || "N/A"}</p>
          <p>Groom Age: {weddingDetails?.groomAge || "N/A"}</p>
          <p>Groom Gender: {weddingDetails?.groomGender || "N/A"}</p>
          <p>Groom Phone: {weddingDetails?.groomPhone || "N/A"}</p>
          <p>Groom Address:
            {weddingDetails?.groomAddress?.state},
            {weddingDetails?.groomAddress?.zip},
            {weddingDetails?.groomAddress?.country}
          </p>

          <p>Bride Relative: {weddingDetails?.BrideRelative || "N/A"}</p>
          <p>Bride Relationship: {weddingDetails?.BrideRelationship || "N/A"}</p>
          <p>Groom Relative: {weddingDetails?.GroomRelative || "N/A"}</p>
          <p>Groom Relationship: {weddingDetails?.GroomRelationship || "N/A"}</p>
          <p>Attendees: {weddingDetails?.attendees || "N/A"}</p>
          <p>Flower Girl: {weddingDetails?.flowerGirl || "N/A"}</p>
          <p>Ring Bearer: {weddingDetails?.ringBearer || "N/A"}</p>
          <p>Wedding Date: {weddingDetails?.weddingDate ? new Date(weddingDetails.weddingDate).toLocaleDateString() : "N/A"}</p>


          <div>
            <p>Bride Birth Certificate:</p>
            {weddingDetails?.brideBirthCertificate ? (
              <img
                src={weddingDetails.brideBirthCertificate}
                alt="Bride Birth Certificate"
                style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", cursor: "pointer" }}
                onClick={() => openModal(weddingDetails.brideBirthCertificate)}
              />
            ) : (
              "N/A"
            )}
          </div>

          <div>
            <p>Groom Birth Certificate:</p>
            {weddingDetails?.groomBirthCertificate ? (
              <img
                src={weddingDetails.groomBirthCertificate}
                alt="Groom Birth Certificate"
                style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", cursor: "pointer" }}
                onClick={() => openModal(weddingDetails.groomBirthCertificate)}
              />
            ) : (
              "N/A"
            )}
          </div>

          <div>
            <p>Bride Baptismal Certificate:</p>
            {weddingDetails?.brideBaptismalCertificate ? (
              <img
                src={weddingDetails.brideBaptismalCertificate}
                alt="Bride Baptismal Certificate"
                style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", cursor: "pointer" }}
                onClick={() => openModal(weddingDetails.brideBaptismalCertificate)}
              />
            ) : (
              "N/A"
            )}
          </div>

          <div>
            <p>Groom Baptismal Certificate:</p>
            {weddingDetails?.groomBaptismalCertificate ? (
              <img
                src={weddingDetails.groomBaptismalCertificate}
                alt="Groom Baptismal Certificate"
                style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", cursor: "pointer" }}
                onClick={() => openModal(weddingDetails.groomBaptismalCertificate)}
              />
            ) : (
              "N/A"
            )}
          </div>
        </div>

        {/* Modal */}
        {/* Modal with Zoom and Drag Functionality */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
            content: {
              maxWidth: "500px",
              margin: "auto",
              padding: "20px",
              textAlign: "center",
            },
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={closeModal} style={{ cursor: "pointer", padding: "5px 10px" }}>
              Close
            </button>
            <div>
              <button
                onClick={() => setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3))}
                style={{ margin: "0 5px", cursor: "pointer", padding: "5px 10px" }}
              >
                Zoom In
              </button>
              <button
                onClick={() => setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1))}
                style={{ margin: "0 5px", cursor: "pointer", padding: "5px 10px" }}
              >
                Zoom Out
              </button>
            </div>
          </div>
          <div
            style={{
              overflow: "hidden",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "80vh",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={(e) => handleMouseDown(e)}
            onMouseMove={(e) => handleMouseMove(e)}
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
          </div>
        </Modal>



        <div className="admin-comments-section">
          <h2>Admin Comments</h2>
          {weddingDetails?.comments?.length > 0 ? (
            weddingDetails.comments.map((comment, index) => (
              <div key={index} className="admin-comment">
                <p>Priest: {comment?.priest || "N/A"}</p>
                <p>Scheduled Date: {comment?.scheduledDate ? new Date(comment.scheduledDate).toLocaleDateString() : "Not set"}</p>
                <p>Selected Comment: {comment?.selectedComment || "N/A"}</p>
                <p>Additional Comment: {comment?.additionalComment || "N/A"}</p>

                {comment?.adminRescheduled?.date && (
                  <p>
                    Rescheduled Date:{" "}
                    {new Date(comment.adminRescheduled.date).toLocaleDateString()}
                  </p>
                )}
                {comment?.adminRescheduled?.reason && (
                  <p>Rescheduling Reason: {comment.adminRescheduled?.reason || "N/A"}</p>
                )}
              </div>
            ))
          ) : (
            <p>No admin comments yet.</p>
          )}
        </div>

        <div className="admin-section">
          <h2>Submit Admin Comment</h2>
          <input
            type="text"
            placeholder="Priest Name"
            value={priest}
            onChange={(e) => setPriest(e.target.value)}
          />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
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
          <input
            type="date"
            placeholder="Rescheduled Date (optional)"
            value={rescheduledDate}
            onChange={(e) => setRescheduledDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Reason for Rescheduling"
            value={rescheduledReason}
            onChange={(e) => setRescheduledReason(e.target.value)}
          />
          <textarea
            placeholder="Additional Comment (optional)"
            value={additionalComment}
            onChange={(e) => setAdditionalComment(e.target.value)}
          />
          <button onClick={handleSubmitComment}>Submit Comment</button>
        </div>

        <div className="button-container">
          <button onClick={() => handleConfirm(weddingId)}>Confirm Wedding</button>
          <button onClick={() => handleDecline(weddingId)}>Decline</button>
        </div>
      </div>
    </div>
  );
};

export default WeddingDetails;
