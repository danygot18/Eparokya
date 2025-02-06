import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../../Layout/styles/style.css";
import GuestSideBar from "../../../../GuestSideBar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import { useParams } from "react-router-dom";
import "./MySubmittedWeddingForm.css";

Modal.setAppElement('#root');

const MyWeddingSubmittedForm = ({ weddingId }) => {

  const [weddingForms, setWeddingForms] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formId } = useParams();

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [updatedWeddingDate, setUpdatedWeddingDate] = useState(weddingForms?.weddingDate || "");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeddingDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getWeddingForm/${formId}`,
          { withCredentials: true }
        );
        console.log("API Response:", response.data);

        if (response.data) {
          setWeddingForms(response.data);
          setComments(response.data.comments || []);
          // setPriest(response.data.priest || "N/A");

          if (response.data.weddingDate) {
            setUpdatedWeddingDate(response.data.weddingDate);
          }
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch funeral details.");
      } finally {
        setLoading(false);
      }
    };

    if (formId) fetchWeddingDetails();
  }, [formId]);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage("");
    setIsModalOpen(false);
  };

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

  const handleCancel = async (weddingId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/${weddingId}/cancelWedding`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Wedding cancelled successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
        setWeddingForms(weddingForms.filter(form => form._id !== weddingId));
      }
    } catch (error) {
      console.error("Error cancelling wedding:", error);
      toast.error("Failed to cancel the wedding.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="wedding-details-page">
      <GuestSideBar />
      <div className="wedding-details-content" style={{ fontFamily: 'Helvetica, sans-serif' }}>
        <h1>My Submitted Wedding Forms</h1>
        {weddingForms && (
          <div key={weddingForms._id} className="details">
            <div className="details-grid">
              <div className="details-item"><strong>Date of Application:</strong> {weddingForms?.dateOfApplication ? new Date(weddingForms.dateOfApplication).toLocaleDateString() : "N/A"}</div>
              <div className="details-item"><strong>Wed`ding Date:</strong> {weddingForms?.weddingDate ? new Date(weddingForms.weddingDate).toLocaleDateString() : "N/A"}</div>
              <div className="details-item"><strong>Wedding Time:</strong> {weddingForms?.weddingTime || "N/A"}</div>

              {/* Bride Details */}
              <div className="details-item"><strong>Bride Name:</strong> {weddingForms?.brideName || "N/A"}</div>
              <div className="details-item"><strong>Bride Address:</strong> {`${weddingForms?.brideAddress?.state}, ${weddingForms?.brideAddress?.zip}, ${weddingForms?.brideAddress?.city}`}</div>
              <div className="details-item"><strong>Bride Birth Date:</strong> {weddingForms?.brideBirthDate ? new Date(weddingForms.brideBirthDate).toLocaleDateString() : "N/A"}</div>
              <div className="details-item"><strong>Bride Occupation:</strong> {weddingForms?.brideOccupation || "N/A"}</div>
              <div className="details-item"><strong>Bride Religion:</strong> {weddingForms?.brideReligion || "N/A"}</div>
              <div className="details-item"><strong>Bride Phone:</strong> {weddingForms?.bridePhone || "N/A"}</div>

              {/* Groom Details */}
              <div className="details-item"><strong>Groom Name:</strong> {weddingForms?.groomName || "N/A"}</div>
              <div className="details-item"><strong>Groom Address:</strong> {`${weddingForms?.groomAddress?.state}, ${weddingForms?.groomAddress?.zip}, ${weddingForms?.groomAddress?.city}`}</div>
              <div className="details-item"><strong>Groom Phone:</strong> {weddingForms?.groomPhone || "N/A"}</div>
              <div className="details-item"><strong>Groom Birth Date:</strong> {weddingForms?.groomBirthDate ? new Date(weddingForms.groomBirthDate).toLocaleDateString() : "N/A"}</div>
              <div className="details-item"><strong>Groom Occupation:</strong> {weddingForms?.groomOccupation || "N/A"}</div>
              <div className="details-item"><strong>Groom Religion:</strong> {weddingForms?.groomReligion || "N/A"}</div>
            </div>

            <h3>Parents</h3>
            <div className="grid-row">
              <div className="details-item"><strong>Bride Father:</strong> {weddingForms?.brideFather || "N/A"}</div>
              <div className="details-item"><strong>Bride Mother:</strong> {weddingForms?.brideMother || "N/A"}</div>
            </div>
            <div className="grid-row">
              <div className="details-item"><strong>Groom Father:</strong> {weddingForms?.groomFather || "N/A"}</div>
              <div className="details-item"><strong>Groom Mother:</strong> {weddingForms?.groomMother || "N/A"}</div>
            </div>

            {/* Ninong and Ninang Details */}
            <div className="details-box">
              <h3>Ninong</h3>
              {weddingForms?.Ninong?.length > 0 ? (
                weddingForms.Ninong.map((ninong, index) => (
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
              {weddingForms?.Ninang?.length > 0 ? (
                weddingForms.Ninang.map((ninang, index) => (
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
                  {weddingForms?.[doc]?.url ? (
                    <img
                      src={weddingForms[doc].url}
                      alt={doc}
                      style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", cursor: "pointer" }}
                      onClick={() => openModal(weddingForms[doc].url)}
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
                  {weddingForms?.[doc]?.url ? (
                    <img
                      src={weddingForms[doc].url}
                      alt={doc}
                      style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", cursor: "pointer" }}
                      onClick={() => openModal(weddingForms[doc].url)}
                    />
                  ) : (
                    "N/A"
                  )}
                </div>
              ))}
            </div>

            <div className="admin-comments-section">
              <h3>Admin Comments</h3>
              {weddingForms?.comments && Array.isArray(weddingForms.comments) && weddingForms.comments.length > 0 ? ( // Ensure comments is an array
                weddingForms.comments.map((comment, index) => (
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

              {weddingForms?.adminRescheduled?.reason && (
                <div className="reschedule-reason">
                  <h3>Reason for Rescheduling</h3>
                  <p>{weddingForms.adminRescheduled.reason}</p>
                </div>
              )}
            </div>

            {/* For Additional Requirements */}
            <div className="additional-req-comments">
              <h3>Additional Requirements</h3>
              {weddingForms?.additionalReq ? (
                <div className="req-details">
                  <div className="req-detail">
                    <p>
                      <strong>Pre Marriage Seminar 1 Date and Time:</strong>{" "}
                      {weddingForms.additionalReq.PreMarriageSeminar?.date
                        ? new Date(weddingForms.additionalReq.PreMarriageSeminar.date).toLocaleDateString()
                        : "N/A"}{" "}
                      at{" "}
                      {weddingForms.additionalReq.PreMarriageSeminar?.time || "N/A"}
                    </p>
                  </div>

                  <div className="req-detail">
                    <p>
                      <strong>Canonical Interview Date and Time:</strong>{" "}
                      {weddingForms.additionalReq.CanonicalInterview?.date
                        ? new Date(weddingForms.additionalReq.CanonicalInterview.date).toLocaleDateString()
                        : "N/A"}{" "}
                      at{" "}
                      {weddingForms.additionalReq.CanonicalInterview?.time || "N/A"}
                    </p>
                  </div>

                  <div className="req-detail">
                    <p>
                      <strong>Confession Date and Time:</strong>{" "}
                      {weddingForms.additionalReq.Confession?.date
                        ? new Date(weddingForms.additionalReq.Confession.date).toLocaleDateString()
                        : "N/A"}{" "}
                      at{" "}
                      {weddingForms.additionalReq.Confession?.time || "N/A"}
                    </p>
                  </div>

                  <p className="req-updated">
                    <strong>Last Updated:</strong>{" "}
                    {weddingForms.additionalReq?.createdAt
                      ? new Date(weddingForms.additionalReq.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              ) : (
                <p>No additional requirements have been set yet.</p>
              )}
            </div>

            {/* Cancel Button */}
            <div className="button-container">
              <button onClick={() => handleCancel(weddingForms._id)}>Cancel Wedding</button>
            </div>
          </div>
        )}

        {/* Modal for Image Preview */}
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
      </div>
      <ToastContainer />
    </div>
  );
};

export default MyWeddingSubmittedForm;