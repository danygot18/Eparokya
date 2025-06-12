import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Button,
  Modal,
  Tabs,
  Tab,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider
} from "@mui/material";
import GuestSideBar from "../../../../GuestSideBar";
import UserWeddingChecklist from "./UserWeddingChecklist";
import { toast, ToastContainer } from 'react-toastify';
import "../../../../Layout/styles/style.css";
import "./MySubmittedWeddingForm.css";

const MyWeddingSubmittedForm = () => {
  const navigate = useNavigate();
  const { formId } = useParams();
  const [weddingForms, setWeddingForms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Image modal controls
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);


  useEffect(() => {
    const fetchWeddingDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getWeddingForm/${formId}`,
          { withCredentials: true }
        );

        if (response.data) {
          setWeddingForms(response.data);
          console.log(response.data)
        } else {
          setWeddingForms(null);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setWeddingForms(null);
        } else {
          console.error("API Error:", err);
          setError("Something went wrong.");
        }
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
    setZoom(1);
    setOffset({ x: 0, y: 0 });
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

  const handleCancelClick = () => {
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

  const handleCancelWedding = async () => {
    setCancelLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/${weddingForms._id}/cancelWedding`,
        null,
        { withCredentials: true }
      );
      toast.success("Wedding cancelled successfully!");
      navigate("/user/dashboard");
    } catch (error) {
      console.error("Error cancelling wedding:", error);
      toast.error("Failed to cancel the wedding.");
    } finally {
      setCancelLoading(false);
      setOpenCancelDialog(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!weddingForms) return <div>No wedding form submitted yet.</div>;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <GuestSideBar />
      <Box sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 3,
        marginLeft: "240px"
      }}>
        <Paper elevation={3} sx={{
          padding: 3,
          width: "100%",
          maxWidth: "1200px",
          minHeight: "800px",
        }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
            My Submitted Wedding Form
          </Typography>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Wedding Information" />
            <Tab label="Wedding Documents" />
            <Tab label="Admin & Checklist" />
          </Tabs>

          <Box sx={{
            minHeight: "600px",
            overflow: "auto"
          }}>
            {activeTab === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Wedding Information */}
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Wedding Information
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Typography sx={{ flex: "1 1 200px" }}>
                        <strong>Date of Application:</strong>{" "}
                        {weddingForms.dateOfApplication
                          ? new Date(weddingForms.dateOfApplication).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                      <Typography sx={{ flex: "1 1 200px" }}>
                        <strong>Wedding Date:</strong>{" "}
                        {weddingForms.weddingDate
                          ? new Date(weddingForms.weddingDate).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                      <Typography sx={{ flex: "1 1 200px" }}>
                        <strong>Wedding Time:</strong> {weddingForms.weddingTime || "N/A"}
                      </Typography>

                    </Box>
                  </CardContent>
                </Card>

                {/* Bride & Groom Information */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                  {/* Bride Details */}
                  <Card sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Bride Details
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography><strong>Name:</strong> {weddingForms.brideName || "N/A"}</Typography>
                        <Typography><strong>Birth Date:</strong>{" "}
                          {weddingForms.brideBirthDate
                            ? new Date(weddingForms.brideBirthDate).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                        <Typography><strong>Address:</strong>{" "}
                          {weddingForms.brideAddress
                            ? `${weddingForms.brideAddress.city}, ${weddingForms.brideAddress.barangay}`
                            : "N/A"}
                        </Typography>
                        <Typography><strong>Occupation:</strong> {weddingForms.brideOccupation || "N/A"}</Typography>
                        <Typography><strong>Religion:</strong> {weddingForms.brideReligion || "N/A"}</Typography>
                        <Typography><strong>Phone:</strong> {weddingForms.bridePhone || "N/A"}</Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Groom Details */}
                  <Card sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Groom Details
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography><strong>Name:</strong> {weddingForms.groomName || "N/A"}</Typography>
                        <Typography><strong>Birth Date:</strong>{" "}
                          {weddingForms.groomBirthDate
                            ? new Date(weddingForms.groomBirthDate).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                        <Typography><strong>Address:</strong>{" "}
                          {weddingForms.groomAddress
                            ? `${weddingForms.groomAddress.city}, ${weddingForms.groomAddress.barangay}`
                            : "N/A"}
                        </Typography>
                        <Typography><strong>Occupation:</strong> {weddingForms.groomOccupation || "N/A"}</Typography>
                        <Typography><strong>Religion:</strong> {weddingForms.groomReligion || "N/A"}</Typography>
                        <Typography><strong>Phone:</strong> {weddingForms.groomPhone || "N/A"}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* Parents Information */}
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Parents Information
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Typography sx={{ flex: "1 1 200px" }}>
                        <strong>Bride's Father:</strong> {weddingForms.brideFather || "N/A"}
                      </Typography>
                      <Typography sx={{ flex: "1 1 200px" }}>
                        <strong>Bride's Mother:</strong> {weddingForms.brideMother || "N/A"}
                      </Typography>
                      <Typography sx={{ flex: "1 1 200px" }}>
                        <strong>Groom's Father:</strong> {weddingForms.groomFather || "N/A"}
                      </Typography>
                      <Typography sx={{ flex: "1 1 200px" }}>
                        <strong>Groom's Mother:</strong> {weddingForms.groomMother || "N/A"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Godparents */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                  {/* Ninong */}
                  <Card sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Ninong (Principal Sponsors)
                      </Typography>
                      {weddingForms.Ninong?.length > 0 ? (
                        weddingForms.Ninong.map((ninong, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Typography><strong>Name:</strong> {ninong.name || "N/A"}</Typography>
                            <Typography><strong>Address:</strong>{" "}
                              {ninong.address
                                ? `${ninong.address.street}, ${ninong.address.city}, ${ninong.address.zip}`
                                : "N/A"}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography>No ninong details available.</Typography>
                      )}
                    </CardContent>
                  </Card>

                  {/* Ninang */}
                  <Card sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Ninang (Principal Sponsors)
                      </Typography>
                      {weddingForms.Ninang?.length > 0 ? (
                        weddingForms.Ninang.map((ninang, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Typography><strong>Name:</strong> {ninang.name || "N/A"}</Typography>
                            <Typography><strong>Address:</strong>{" "}
                              {ninang.address
                                ? `${ninang.address.street}, ${ninang.address.city}, ${ninang.address.zip}`
                                : "N/A"}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography>No ninang details available.</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
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
                        {weddingForms[doc]?.url ? (
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
                              <Button
                                onClick={() => openModal(weddingForms[doc].url)}
                                variant="contained"
                                sx={{ mt: 1, backgroundColor: "#d5edd9", color: "black" }}
                              >
                                View Full Image
                              </Button>
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
                              <Button
                                onClick={() => window.open(weddingForms[doc].url, "_blank")}
                                variant="contained"
                                sx={{ backgroundColor: "#d5edd9", color: "black" }}
                              >
                                View Full File
                              </Button>
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
                        {weddingForms[doc]?.url ? (
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
                              <Button
                                onClick={() => openModal(weddingForms[doc].url)}
                                variant="contained"
                                sx={{ mt: 1, backgroundColor: "#d5edd9", color: "black" }}
                              >
                                View Full Image
                              </Button>
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
                              <Button
                                onClick={() => window.open(weddingForms[doc].url, "_blank")}
                                variant="contained"
                                sx={{ backgroundColor: "#d5edd9", color: "black" }}
                              >
                                View Full File
                              </Button>
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
            )}

            {activeTab === 2 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Admin Notes */}
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Admin Notes
                    </Typography>
                    {weddingForms.comments?.length > 0 ? (
                      weddingForms.comments.map((note, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography><strong>Comment:</strong> {note.selectedComment || "N/A"}</Typography>
                          <Typography><strong>Additional Comment:</strong> {note.additionalComment || "N/A"}</Typography>
                          <Typography><strong>Date:</strong>{" "}
                            {note.createdAt
                              ? new Date(note.createdAt).toLocaleDateString()
                              : "N/A"}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography>No admin notes available.</Typography>
                    )}
                  </CardContent>
                </Card>

                {/* Rescheduling */}
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Rescheduling Information
                    </Typography>
                    {weddingForms.adminRescheduled ? (
                      <>
                        <Typography>
                          <strong>Updated Wedding Date:</strong>{" "}
                          {new Date(weddingForms.adminRescheduled.date).toLocaleDateString()}
                        </Typography>
                        <Typography>
                          <strong>Reason:</strong> {weddingForms.adminRescheduled.reason}
                        </Typography>
                      </>
                    ) : (
                      <Typography>No rescheduling information available.</Typography>
                    )}
                  </CardContent>
                </Card>

                {/* Additional Requirements */}
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Additional Requirements
                    </Typography>
                    {weddingForms.additionalReq ? (
                      <>
                        <Typography>
                          <strong>Pre-Marriage Seminar:</strong>{" "}
                          {weddingForms.additionalReq.PreMarriageSeminar?.date
                            ? new Date(weddingForms.additionalReq.PreMarriageSeminar.date).toLocaleDateString()
                            : "N/A"}{" "}
                          at {weddingForms.additionalReq.PreMarriageSeminar?.time || "N/A"}
                        </Typography>
                        <Typography>
                          <strong>Canonical Interview:</strong>{" "}
                          {weddingForms.additionalReq.CanonicalInterview?.date
                            ? new Date(weddingForms.additionalReq.CanonicalInterview.date).toLocaleDateString()
                            : "N/A"}{" "}
                          at {weddingForms.additionalReq.CanonicalInterview?.time || "N/A"}
                        </Typography>
                        <Typography>
                          <strong>Confession:</strong>{" "}
                          {weddingForms.additionalReq.Confession?.date
                            ? new Date(weddingForms.additionalReq.Confession.date).toLocaleDateString()
                            : "N/A"}{" "}
                          at {weddingForms.additionalReq.Confession?.time || "N/A"}
                        </Typography>
                      </>
                    ) : (
                      <Typography>No additional requirements have been set yet.</Typography>
                    )}
                  </CardContent>
                </Card>

                {/* Checklist */}
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Wedding Checklist
                    </Typography>
                    <UserWeddingChecklist weddingId={formId} />
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>

          {/* Cancel Button */}


          {/* Cancel Confirmation Dialog */}
          <Dialog
            open={openCancelDialog}
            onClose={handleCloseCancelDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Confirm Cancellation
            </DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to cancel this wedding request?
                <br />
                This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseCancelDialog}
                disabled={cancelLoading}
                color="primary"
              >
                No, Keep It
              </Button>
              <Button
                onClick={handleCancelWedding}
                color="error"
                autoFocus
                disabled={cancelLoading}
              >
                {cancelLoading ? <CircularProgress size={24} /> : 'Yes, Cancel'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Image Modal */}
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
                <Button
                  onClick={() => setZoom(prev => Math.min(prev + 0.1, 3))}
                  variant="outlined"
                  sx={{ mx: 1 }}
                >
                  Zoom In
                </Button>
                <Button
                  onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
                  variant="outlined"
                  sx={{ mx: 1 }}
                >
                  Zoom Out
                </Button>
                <Button onClick={closeModal} variant="contained" color="error" sx={{ mx: 1 }}>
                  Close
                </Button>
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
                  alt="Document Preview"
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
        </Paper>
        <Divider>
          <Card>
            <Typography variant="h5" sx={{ textAlign: "center", p: 2 }}>
              Status
            </Typography>
            <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
              {weddingForms.weddingStatus || "N/A"}
            </Typography>
          </Card>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancelClick}
              sx={{ px: 4, py: 2, ml: 2 }}
              size="small"
            >
              Cancel Wedding Request
            </Button>
          </Box>
        </Divider>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default MyWeddingSubmittedForm;