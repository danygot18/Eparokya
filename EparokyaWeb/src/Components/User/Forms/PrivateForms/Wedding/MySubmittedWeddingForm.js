import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../../Layout/styles/style.css";
import GuestSideBar from "../../../../GuestSideBar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
// import Modal from 'react-modal';
import { useParams } from "react-router-dom";
import "./MySubmittedWeddingForm.css";
import UserWeddingChecklist from "./UserWeddingChecklist";
import { Card, CardContent, Typography, Box, CardMedia, Grid2, Modal, Button } from "@mui/material";

// Modal.setAppElement('#root');

const MyWeddingSubmittedForm = () => {
  const { formId } = useParams();
  // const { formId } = useParams();
  // console.log( weddingId )
  const [weddingForms, setWeddingForms] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 1));
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
        console.log(response.data);
        // console.log("API Response:", response.data);

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
        setError("Failed to fetch Wedding details.");
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
    <div className="user-wedding-details-page">
      <GuestSideBar />
      <div className="user-wedding-details-content">
        <h1>My Submitted Wedding Forms</h1>
        <div className="user-Wedding-three-container-layout">
          <div className="user-Wedding-left-container">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Wedding Information */}
              <Typography variant="h5" gutterBottom>
                Wedding Details
              </Typography>

              {/* Wedding Date Card */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Wedding Information
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={{ flex: "1 1 200px" }}>
                      <strong>Date of Application:</strong> {weddingForms?.dateOfApplication ? new Date(weddingForms.dateOfApplication).toLocaleDateString() : "N/A"}
                    </Typography>
                    <Typography sx={{ flex: "1 1 200px" }}>
                      <strong>Wedding Date:</strong> {weddingForms?.weddingDate ? new Date(weddingForms.weddingDate).toLocaleDateString() : "N/A"}
                    </Typography>
                    <Typography sx={{ flex: "1 1 200px" }}>
                      <strong>Wedding Time:</strong> {weddingForms?.weddingTime || "N/A"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Bride & Groom Details */}
              <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                {/* Bride Details */}
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6">Bride Details</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Typography><strong>Name:</strong> {weddingForms?.brideName || "N/A"}</Typography>
                      <Typography><strong>Address:</strong> {weddingForms?.brideAddress ? `${weddingForms.brideAddress.city}, ${weddingForms.brideAddress.barangay}` : "N/A"}</Typography>
                      <Typography><strong>Birth Date:</strong> {weddingForms?.brideBirthDate ? new Date(weddingForms.brideBirthDate).toLocaleDateString() : "N/A"}</Typography>
                      <Typography><strong>Occupation:</strong> {weddingForms?.brideOccupation || "N/A"}</Typography>
                      <Typography><strong>Religion:</strong> {weddingForms?.brideReligion || "N/A"}</Typography>
                      <Typography><strong>Phone:</strong> {weddingForms?.bridePhone || "N/A"}</Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Groom Details */}
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6">Groom Details</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Typography><strong>Name:</strong> {weddingForms?.groomName || "N/A"}</Typography>
                      <Typography><strong>Address:</strong> {weddingForms?.groomAddress ? `${weddingForms.groomAddress.city}, ${weddingForms.groomAddress.barangay}` : "N/A"}</Typography>
                      <Typography><strong>Birth Date:</strong> {weddingForms?.groomBirthDate ? new Date(weddingForms.groomBirthDate).toLocaleDateString() : "N/A"}</Typography>
                      <Typography><strong>Occupation:</strong> {weddingForms?.groomOccupation || "N/A"}</Typography>
                      <Typography><strong>Religion:</strong> {weddingForms?.groomReligion || "N/A"}</Typography>
                      <Typography><strong>Phone:</strong> {weddingForms?.groomPhone || "N/A"}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Parents Details */}
              <Card>
                <CardContent>
                  <Typography variant="h6">Parents</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={{ flex: "1 1 200px" }}><strong>Bride Father:</strong> {weddingForms?.brideFather || "N/A"}</Typography>
                    <Typography sx={{ flex: "1 1 200px" }}><strong>Bride Mother:</strong> {weddingForms?.brideMother || "N/A"}</Typography>
                    <Typography sx={{ flex: "1 1 200px" }}><strong>Groom Father:</strong> {weddingForms?.groomFather || "N/A"}</Typography>
                    <Typography sx={{ flex: "1 1 200px" }}><strong>Groom Mother:</strong> {weddingForms?.groomMother || "N/A"}</Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Ninong & Ninang */}
              {["Ninong", "Ninang"].map((role) => (
                <Card key={role}>
                  <CardContent>
                    <Typography variant="h6">{role}</Typography>
                    {weddingForms?.[role]?.length > 0 ? (
                      weddingForms[role].map((person, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography><strong>Name:</strong> {person.name || "N/A"}</Typography>
                          <Typography>
                            <strong>Address:</strong> {person.address ? `${person.address.street}, ${person.address.city}, ${person.address.zip}` : "N/A"}
                          </Typography>
                        </Box>
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
                {[
                  'GroomNewBaptismalCertificate',
                  'GroomNewConfirmationCertificate',
                  'GroomMarriageLicense',
                  'GroomMarriageBans',
                  'GroomOrigCeNoMar',
                  'GroomOrigPSA',
                  'GroomOneByOne'
                ].map((doc, index) => (
                  <Card key={index} sx={{ flex: "1 1 300px", maxWidth: "400px" }}>
                    <CardContent>
                      <Typography variant="body1" fontWeight="bold">
                        {doc.replace(/([A-Z])/g, ' $1').trim()}:
                      </Typography>
                      {weddingForms?.[doc]?.url ? (
                        // Check if URL ends with image extension
                        /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(weddingForms[doc].url) ? (
                          <>
                            <Box
                              component="img"
                              src={weddingForms[doc].url}
                              alt={doc}
                              sx={{
                                maxWidth: 150,
                                maxHeight: 150,
                                width: '100%',
                                objectFit: "contain",
                                cursor: "pointer",
                                borderRadius: 1,
                                mt: 1,
                              }}
                              onClick={() => openModal(weddingForms[doc].url)}
                            />
                            <button
                              onClick={() => openModal(weddingForms[doc].url)}
                              style={{
                                padding: "8px 16px",
                                backgroundColor: "#d5edd9",
                                color: "black",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                                marginTop: "10px"
                              }}
                            >
                              View Full Image
                            </button>
                          </>
                        ) : (
                          <Box sx={{
                            width: '100%',
                            mt: 1,
                            mb: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                          }}>
                            <iframe
                              src={`${weddingForms[doc].url}#toolbar=0&navpanes=0&scrollbar=0`}
                              title={`${doc} Preview`}
                              style={{
                                width: '100%',
                                height: '200px',
                                border: '1px solid #ddd',
                                borderRadius: 4,
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {weddingForms[doc]?.name || 'Document Preview'}
                            </Typography>
                            <button
                              onClick={() =>
                                window.open(
                                  weddingForms[doc].url,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                              style={{
                                padding: "8px 16px",
                                backgroundColor: "#d5edd9",
                                color: "black",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                            >
                              View Full File
                            </button>
                          </Box>
                        )
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
                {[
                  'BrideNewBaptismalCertificate',
                  'BrideNewConfirmationCertificate',
                  'BrideMarriageLicense',
                  'BrideMarriageBans',
                  'BrideOrigCeNoMar',
                  'BrideOrigPSA',
                  'PermitFromtheParishOftheBride',
                  'ChildBirthCertificate',
                  'BrideOneByOne'
                ].map((doc, index) => (
                  <Card key={index} sx={{ flex: "1 1 300px", maxWidth: "400px" }}>
                    <CardContent>
                      <Typography variant="body1" fontWeight="bold">
                        {doc.replace(/([A-Z])/g, ' $1').trim()}:
                      </Typography>
                      {weddingForms?.[doc]?.url ? (
                        /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(weddingForms[doc].url) ? (
                          <>
                            <Box
                              component="img"
                              src={weddingForms[doc].url}
                              alt={doc}
                              sx={{
                                maxWidth: 150,
                                maxHeight: 150,
                                width: '100%',
                                objectFit: "contain",
                                cursor: "pointer",
                                borderRadius: 1,
                                mt: 1,
                              }}
                              onClick={() => openModal(weddingForms[doc].url)}
                            />
                            <button
                              onClick={() => openModal(weddingForms[doc].url)}
                              style={{
                                padding: "8px 16px",
                                backgroundColor: "#d5edd9",
                                color: "black",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                                marginTop: "10px"
                              }}
                            >
                              View Full Image
                            </button>
                          </>
                        ) : (
                          <Box sx={{
                            width: '100%',
                            mt: 1,
                            mb: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                          }}>
                            <iframe
                              src={`${weddingForms[doc].url}#toolbar=0&navpanes=0&scrollbar=0`}
                              title={`${doc} Preview`}
                              style={{
                                width: '100%',
                                height: '200px',
                                border: '1px solid #ddd',
                                borderRadius: 4,
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {weddingForms[doc]?.name || 'Document Preview'}
                            </Typography>
                            <button
                              onClick={() =>
                                window.open(
                                  weddingForms[doc].url,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                              style={{
                                padding: "8px 16px",
                                backgroundColor: "#d5edd9",
                                color: "black",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                            >
                              View Full File
                            </button>
                          </Box>
                        )
                      ) : (
                        <Typography color="textSecondary">N/A</Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </div>
          {/* <div className="user-Wedding-right-container">
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
          </div> */}
          <div className="user-Wedding-right-container">
            <UserWeddingChecklist weddingId={formId} />
          </div>
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
              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 2 }}>
                <Button onClick={closeModal} variant="contained" sx={{ mx: 1 }} size="small">
                  Close
                </Button>
                <Box>
                  <Button onClick={handleZoomIn} variant="outlined" sx={{ mx: 1 }} style={{ marginBottom: "10px" }}>
                    Zoom In
                  </Button>
                  <Button onClick={handleZoomOut} variant="outlined" sx={{ mx: 1 }}>
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
          {/* for Rescheduling */}
          <div className="user-wedding-date-box">
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
            <div className="button-container">
              <button onClick={() => handleCancel(weddingForms._id)}>Cancel Wedding</button>
            </div>
          </div>

          {/* Cancel Button */}

        </div>

        {/* For Additional Requirements */}
        {/* <div className="user-Wedding-third-container">


        </div> */}



        {/* Modal for Image Preview */}
        {/* <Modal
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
        </Modal> */}
      </div>
      <ToastContainer />
    </div>
  );
};

export default MyWeddingSubmittedForm;

//Wedding Details image should be still modal