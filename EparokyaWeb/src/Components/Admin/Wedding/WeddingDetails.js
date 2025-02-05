import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import WeddingChecklist from "./WeddingChecklist";

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

  const [selectedComment, setSelectedComment] = useState("");
  const [additionalComment, setAdditionalComment] = useState("");

  const [newDate, setNewDate] = useState("");
  const [reason, setReason] = useState("");
  const [updatedWeddingDate, setUpdatedWeddingDate] = useState(weddingDetails?.weddingDate || "");


  const [preMarriageSeminarDate, setPreMarriageSeminarDate] = useState("");
  const [preMarriageSeminarTime, setPreMarriageSeminarTime] = useState("");

  const [canonicalInterviewDate, setCanonicalInterviewDate] = useState("");
  const [canonicalInterviewTime, setCanonicalInterviewTime] = useState("");

  const [confessionDate, setConfessionDate] = useState("");
  const [confessionTime, setConfessionTime] = useState("");


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
          { withCredentials: true }
        );

        console.log("API Response:", response.data);
        setWeddingDetails(response.data);
        setComments(response.data.comments || []);

        if (response.data.weddingDate) {
          setUpdatedWeddingDate(response.data.weddingDate);
        }
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

  const handleSubmitComment = async () => {
    if (!selectedComment && !additionalComment) {
      alert("Please select or enter a comment.");
      return;
    }

    const commentData = {
      selectedComment: selectedComment || "",
      additionalComment: additionalComment || "",
    };

    // console.log("Sending comment:", commentData); 

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/v1/${weddingId}/commentWedding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commentData),
        }
      );

      const data = await response.json();

      // console.log("Response from server:", data); 

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit comment.");
      }

      alert("Comment submitted successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment.");
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
        `${process.env.REACT_APP_API}/api/v1/updateAdditionalReq/${weddingId}`,
        { additionalReq },
        { withCredentials: true }
      );

      alert("Additional requirements updated successfully!");
      setWeddingDetails(response.data.wedding);
    } catch (err) {
      console.error("Error updating additional requirements:", err);
      alert("Failed to update additional requirements.");
    }
  };


  const handleConfirm = async (weddingId) => {
    try {

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/${weddingId}/confirmWedding`,
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
        `${process.env.REACT_APP_API}/api/v1/${weddingId}/cancelWedding`,
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

  const handleUpdate = async () => {
    if (!newDate || !reason) {
      alert("Please select a date and provide a reason.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/updateWeddingDate/${weddingDetails._id}`,
        { newDate, reason }
      );

      setUpdatedWeddingDate(response.data.wedding.weddingDate);
      alert("Wedding date updated successfully!");
    } catch (error) {
      console.error("Error updating wedding date:", error);
      alert("Failed to update wedding date.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="wedding-details-page">
      <SideBar />
      <div className="wedding-details-content" style={{ fontFamily: 'Helvetica, sans-serif' }}>
        <h1>Wedding Details</h1>
        <div className="details">

          <div className="details-grid">
            <div className="details-item"><strong>Date of Application:</strong> {weddingDetails?.dateOfApplication ? new Date(weddingDetails.dateOfApplication).toLocaleDateString() : "N/A"}</div>
            <div className="details-item"><strong>Wedding Date:</strong> {weddingDetails?.weddingDate ? new Date(weddingDetails.weddingDate).toLocaleDateString() : "N/A"}</div>
            <div className="details-item"><strong>Wedding Time:</strong> {weddingDetails?.weddingTime || "N/A"}</div>

            {/* Bride Details */}
            <div className="details-item"><strong>Bride Name:</strong> {weddingDetails?.brideName || "N/A"}</div>
            <div className="details-item"><strong>Bride Address:</strong> {`${weddingDetails?.brideAddress?.state}, ${weddingDetails?.brideAddress?.zip}, ${weddingDetails?.brideAddress?.city}`}</div>
            <div className="details-item"><strong>Bride Birth Date:</strong> {weddingDetails?.brideBirthDate ? new Date(weddingDetails.brideBirthDate).toLocaleDateString() : "N/A"}</div>
            <div className="details-item"><strong>Bride Occupation:</strong> {weddingDetails?.brideOccupation || "N/A"}</div>
            <div className="details-item"><strong>Bride Religion:</strong> {weddingDetails?.brideReligion || "N/A"}</div>
            <div className="details-item"><strong>Bride Phone:</strong> {weddingDetails?.bridePhone || "N/A"}</div>

            {/* Groom Details */}
            <div className="details-item"><strong>Groom Name:</strong> {weddingDetails?.groomName || "N/A"}</div>
            <div className="details-item"><strong>Groom Address:</strong> {`${weddingDetails?.groomAddress?.state}, ${weddingDetails?.groomAddress?.zip}, ${weddingDetails?.groomAddress?.city}`}</div>
            <div className="details-item"><strong>Groom Phone:</strong> {weddingDetails?.groomPhone || "N/A"}</div>
            <div className="details-item"><strong>Groom Birth Date:</strong> {weddingDetails?.groomBirthDate ? new Date(weddingDetails.groomBirthDate).toLocaleDateString() : "N/A"}</div>
            <div className="details-item"><strong>Groom Occupation:</strong> {weddingDetails?.groomOccupation || "N/A"}</div>
            <div className="details-item"><strong>Groom Religion:</strong> {weddingDetails?.groomReligion || "N/A"}</div>
          </div>

          <h3>Parents</h3>
          <div className="grid-row">
            <div className="details-item"><strong>Bride Father:</strong> {weddingDetails?.BrideFather || "N/A"}</div>
            <div className="details-item"><strong>Bride Mother:</strong> {weddingDetails?.BrideMother || "N/A"}</div>
          </div>
          <div className="grid-row">
            <div className="details-item"><strong>Groom Father:</strong> {weddingDetails?.GroomFather || "N/A"}</div>
            <div className="details-item"><strong>Groom Mother:</strong> {weddingDetails?.GroomMother || "N/A"}</div>
          </div>
        </div>

        <div className="details-box">
          <h3>Ninong</h3>
          {weddingDetails?.Ninong?.length > 0 ? (
            weddingDetails.Ninong.map((ninong, index) => (
              <div key={index} className="grid-row">
                <p><strong>Name:</strong> {ninong.name}</p>
                <p><strong>Address:</strong> {ninong.address.street}, {ninong.address.city}, {ninong.address.zip}</p>
              </div>
            ))
          ) : (
            <p>No Ninong details available.</p>
          )}
        </div>

        <div className="details-box">
          <h3>Ninang</h3>
          {weddingDetails?.Ninang?.length > 0 ? (
            weddingDetails.Ninang.map((ninang, index) => (
              <div key={index} className="grid-row">
                <p><strong>Name:</strong> {ninang.name}</p>
                <p><strong>Address:</strong> {ninang.address.street}, {ninang.address.city}, {ninang.address.zip}</p>
              </div>
            ))
          ) : (
            <p>No Ninang details available.</p>
          )}
        </div>

        <div className="details-box">
          <h3>Groom Documents</h3>
          {['GroomNewBaptismalCertificate', 'GroomNewConfirmationCertificate', 'GroomMarriageLicense', 'GroomMarriageBans', 'GroomOrigCeNoMar', 'GroomOrigPSA'].map((doc, index) => (
            <div key={index} className="grid-row">
              <p>{doc.replace(/([A-Z])/g, ' $1').trim()}:</p>
              {weddingDetails?.[doc]?.url ? (
                <img
                  src={weddingDetails[doc].url}
                  alt={doc}
                  style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", cursor: "pointer" }}
                  onClick={() => openModal(weddingDetails[doc].url)}
                />
              ) : (
                "N/A"
              )}
            </div>
          ))}
        </div>

        <div className="details-box">
          <h3>Bride Documents</h3>
          {['BrideNewBaptismalCertificate', 'BrideNewConfirmationCertificate', 'BrideMarriageLicense', 'BrideMarriageBans', 'BrideOrigCeNoMar', 'BrideOrigPSA', 'PermitFromtheParishOftheBride', 'ChildBirthCertificate'].map((doc, index) => (
            <div key={index} className="grid-row">
              <p>{doc.replace(/([A-Z])/g, ' $1').trim()}:</p>
              {weddingDetails?.[doc]?.url ? (
                <img
                  src={weddingDetails[doc].url}
                  alt={doc}
                  style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", cursor: "pointer" }}
                  onClick={() => openModal(weddingDetails[doc].url)}
                />
              ) : (
                "N/A"
              )}
            </div>
          ))}
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

        {/* Comments of the Admin Display */}
        <div className="admin-comments-section">
          <h3>Admin Comments</h3>
          {weddingDetails?.comments?.length > 0 ? (
            weddingDetails.comments.map((comment, index) => (
              <div key={index} className="admin-comment">
                <p className="comment-date">
                  {new Date(comment?.createdAt).toLocaleDateString()}
                </p>
                <p><strong>Comment:</strong> {comment?.selectedComment || "N/A"}</p>
                <p><strong>Additional Comment:</strong> {comment?.additionalComment || "N/A"}</p>
              </div>
            ))
          ) : (
            <p>No admin comments yet.</p>
          )}
        </div>

        {/* for Rescheduling */}
        <div className="wedding-date-box">
          <h3>Updated Wedding Date</h3>
          <p className="date">
            {updatedWeddingDate ? new Date(updatedWeddingDate).toLocaleDateString() : "N/A"}
          </p>

          {weddingDetails?.adminRescheduled?.reason && (
            <div className="reschedule-reason">
              <h3>Reason for Rescheduling</h3>
              <p>{weddingDetails.adminRescheduled.reason}</p>
            </div>
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
                    ? new Date(weddingDetails.additionalReq.PreMarriageSeminar.date).toLocaleDateString()
                    : "N/A"}{" "}
                  at{" "}
                  {weddingDetails.additionalReq.PreMarriageSeminar?.time || "N/A"}
                </p>
              </div>

              <div className="req-detail">
                <p>
                  <strong>Canonical Interview Date and Time:</strong>{" "}
                  {weddingDetails.additionalReq.CanonicalInterview?.date
                    ? new Date(weddingDetails.additionalReq.CanonicalInterview.date).toLocaleDateString()
                    : "N/A"}{" "}
                  at{" "}
                  {weddingDetails.additionalReq.CanonicalInterview?.time || "N/A"}
                </p>
              </div>

              <div className="req-detail">
                <p>
                  <strong>Confession Date and Time:</strong>{" "}
                  {weddingDetails.additionalReq.Confession?.date
                    ? new Date(weddingDetails.additionalReq.Confession.date).toLocaleDateString()
                    : "N/A"}{" "}
                  at{" "}
                  {weddingDetails.additionalReq.Confession?.time || "N/A"}
                </p>
              </div>

              <p className="req-updated">
                <strong>Last Updated:</strong>{" "}
                {weddingDetails.additionalReq?.createdAt
                  ? new Date(weddingDetails.additionalReq.createdAt).toLocaleDateString()
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

        {/* Admin wedding Date  */}
        <div className="admin-section">
          <h2>Select Updated Wedding Date:</h2>
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
          <label>Reason:</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <div className="button-container">
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Wedding Date"}
          </button><div>

            {/* Additional Admin Comment */}
            <div className="additional-requirements">
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

              <button onClick={updateAdditionalReq}>Submit Additional Requirements</button>
            </div>


            <div className="button-container">
              <button onClick={() => handleConfirm(weddingId)}>Confirm Wedding</button>
              <button onClick={() => handleDecline(weddingId)}>Decline</button>
              <button onClick={handleUpdate} disabled={loading}>
                {loading ? "Updating..." : "Update Wedding Date"}
              </button>
            </div>
          </div>

          <div className="wedding-checklist-container">
            <WeddingChecklist weddingId={weddingId} />
          </div>
        </div>
      </div>
    </div>

  );
};

export default WeddingDetails;
