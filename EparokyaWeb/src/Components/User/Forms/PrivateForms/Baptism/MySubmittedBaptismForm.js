import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, Typography, Box, Paper, Button, Modal, Tabs, Tab } from "@mui/material";
import GuestSideBar from "../../../../GuestSideBar";
import UserBaptismChecklist from "./UserBaptismChecklist";
import "../../../../Layout/styles/style.css";
import "./MySubmittedBaptismForm.css";

const MySubmittedBaptismForm = () => {
  const navigate = useNavigate();
  const { formId } = useParams();
  const [baptismDetails, setBaptismDetails] = useState(null);
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

  useEffect(() => {
    const fetchBaptismDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getBaptismForm/${formId}`,
          { withCredentials: true }
        );

        if (response.data) {
          setBaptismDetails(response.data);
        } else {
          setBaptismDetails(null);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setBaptismDetails(null);
        } else {
          console.error("API Error:", err);
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (formId) fetchBaptismDetails();
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

  const handleCancel = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/${baptismDetails._id}/declineBaptism`,
        null,
        { withCredentials: true }
      );
      alert("Baptism request cancelled.");
      navigate("/user/dashboard");
    } catch (error) {
      console.error("Error cancelling baptism:", error);
      alert("Failed to cancel the baptism request.");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!baptismDetails) return <div>No baptism form submitted yet.</div>;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <GuestSideBar />
      <Box sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 3,
        marginLeft: "240px" // Adjust based on your sidebar width
      }}>
        <Paper elevation={3} sx={{
          padding: 3,
          width: "100%",
          maxWidth: "1200px", // Fixed max width
          minHeight: "800px", // Fixed minimum height
        }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
            My Submitted Baptism Form
          </Typography>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Baptism Information" />
            <Tab label="Baptism Documents" />
            <Tab label="Admin & Checklist" />
          </Tabs>

          <Box sx={{
            minHeight: "600px", // Fixed height for tab content
            overflow: "auto" // Add scroll if content is too long
          }}>
            {activeTab === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Baptism Information */}
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Baptism Information
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Typography sx={{ flex: "1 1 200px" }}>
                        <strong>Baptism Date:</strong>{" "}
                        {baptismDetails.baptismDate
                          ? new Date(baptismDetails.baptismDate).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                      <Typography sx={{ flex: "1 1 200px" }}>
                        <strong>Baptism Time:</strong> {baptismDetails.baptismTime
                          ? new Date(`1970-01-01T${baptismDetails.baptismTime}`).toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })
                          : "N/A"}
                      </Typography>
                      <Typography sx={{ flex: "1 1 200px" }}>
                        <strong>Contact Number:</strong> {baptismDetails.phone || "N/A"}
                      </Typography>
                      <Typography sx={{ flex: "1 1 200px" }}>
                        <strong>Status:</strong> {baptismDetails.binyagStatus || "N/A"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Child Information */}
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Child Information
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Typography sx={{ flex: "1 1 300px" }}>
                        <strong>Full Name:</strong> {baptismDetails.child?.fullName || "N/A"}
                      </Typography>
                      <Typography sx={{ flex: "1 1 300px" }}>
                        <strong>Birthdate:</strong>{" "}
                        {baptismDetails.child?.dateOfBirth
                          ? new Date(baptismDetails.child.dateOfBirth).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                      <Typography sx={{ flex: "1 1 300px" }}>
                        <strong>Place of Birth:</strong> {baptismDetails.child?.placeOfBirth || "N/A"}
                      </Typography>
                      <Typography sx={{ flex: "1 1 300px" }}>
                        <strong>Gender:</strong> {baptismDetails.child?.gender || "N/A"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Parents Information */}
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Parents Information
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                      {/* Father */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">Father</Typography>
                        <Typography><strong>Name:</strong> {baptismDetails.parents?.fatherFullName || "N/A"}</Typography>
                        <Typography><strong>Place of Birth:</strong> {baptismDetails.parents?.placeOfFathersBirth || "N/A"}</Typography>
                      </Box>

                      {/* Mother */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">Mother</Typography>
                        <Typography><strong>Name:</strong> {baptismDetails.parents?.motherFullName || "N/A"}</Typography>
                        <Typography><strong>Place of Birth:</strong> {baptismDetails.parents?.placeOfMothersBirth || "N/A"}</Typography>
                      </Box>

                      {/* Marriage Info */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">Marriage Details</Typography>
                        <Typography><strong>Address:</strong> {baptismDetails.parents?.address || "N/A"}</Typography>
                        <Typography><strong>Marriage Status:</strong> {baptismDetails.parents?.marriageStatus || "N/A"}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Godparents */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                  {/* Primary Godparents */}
                  <Card sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Primary Godparents
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box>
                          <Typography variant="h6">Ninong</Typography>
                          <Typography><strong>Name:</strong> {baptismDetails.ninong?.name || "N/A"}</Typography>
                          <Typography><strong>Address:</strong> {baptismDetails.ninong?.address || "N/A"}</Typography>
                          <Typography><strong>Religion:</strong> {baptismDetails.ninong?.religion || "N/A"}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="h6">Ninang</Typography>
                          <Typography><strong>Name:</strong> {baptismDetails.ninang?.name || "N/A"}</Typography>
                          <Typography><strong>Address:</strong> {baptismDetails.ninang?.address || "N/A"}</Typography>
                          <Typography><strong>Religion:</strong> {baptismDetails.ninang?.religion || "N/A"}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Secondary Godparents */}
                  <Card sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Secondary Godparents
                      </Typography>
                      <Box sx={{ display: "flex", gap: 3 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6">Ninong</Typography>
                          {baptismDetails.NinongGodparents?.length > 0 ? (
                            baptismDetails.NinongGodparents.map((gp, index) => (
                              <Typography key={index}>{gp.name}</Typography>
                            ))
                          ) : (
                            <Typography>No secondary ninong</Typography>
                          )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6">Ninang</Typography>
                          {baptismDetails.NinangGodparents?.length > 0 ? (
                            baptismDetails.NinangGodparents.map((gp, index) => (
                              <Typography key={index}>{gp.name}</Typography>
                            ))
                          ) : (
                            <Typography>No secondary ninang</Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Baptism Documents Section */}
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Baptism Documents
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {/* Required Documents */}
                    {baptismDetails.Docs && (
                      <>
                        <Card sx={{ flex: "1 1 300px", maxWidth: "400px" }}>
                          <CardContent>
                            <Typography variant="body1" fontWeight="bold">
                              Birth Certificate:
                            </Typography>
                            {baptismDetails.Docs.birthCertificate?.url ? (
                              <>
                                <Box
                                  component="img"
                                  src={baptismDetails.Docs.birthCertificate.url}
                                  alt="Birth Certificate"
                                  sx={{
                                    maxWidth: 150,
                                    maxHeight: 150,
                                    width: '100%',
                                    objectFit: "contain",
                                    cursor: "pointer",
                                    borderRadius: 1,
                                    mt: 1,
                                  }}
                                  onClick={() => openModal(baptismDetails.Docs.birthCertificate.url)}
                                />
                                <Button
                                  onClick={() => openModal(baptismDetails.Docs.birthCertificate.url)}
                                  variant="contained"
                                  sx={{ mt: 1, backgroundColor: "#d5edd9", color: "black" }}
                                >
                                  View Full Image
                                </Button>
                              </>
                            ) : (
                              <Typography color="textSecondary">N/A</Typography>
                            )}
                          </CardContent>
                        </Card>

                        <Card sx={{ flex: "1 1 300px", maxWidth: "400px" }}>
                          <CardContent>
                            <Typography variant="body1" fontWeight="bold">
                              Marriage Certificate:
                            </Typography>
                            {baptismDetails.Docs.marriageCertificate?.url ? (
                              <>
                                <Box
                                  component="img"
                                  src={baptismDetails.Docs.marriageCertificate.url}
                                  alt="Marriage Certificate"
                                  sx={{
                                    maxWidth: 150,
                                    maxHeight: 150,
                                    width: '100%',
                                    objectFit: "contain",
                                    cursor: "pointer",
                                    borderRadius: 1,
                                    mt: 1,
                                  }}
                                  onClick={() => openModal(baptismDetails.Docs.marriageCertificate.url)}
                                />
                                <Button
                                  onClick={() => openModal(baptismDetails.Docs.marriageCertificate.url)}
                                  variant="contained"
                                  sx={{ mt: 1, backgroundColor: "#d5edd9", color: "black" }}
                                >
                                  View Full Image
                                </Button>
                              </>
                            ) : (
                              <Typography color="textSecondary">N/A</Typography>
                            )}
                          </CardContent>
                        </Card>
                      </>
                    )}

                    {/* Additional Documents */}
                    {baptismDetails.additionalDocs && (
                      <>
                        <Card sx={{ flex: "1 1 300px", maxWidth: "400px" }}>
                          <CardContent>
                            <Typography variant="body1" fontWeight="bold">
                              Baptism Permit:
                            </Typography>
                            {baptismDetails.additionalDocs.baptismPermit?.url ? (
                              <>
                                <Box
                                  component="img"
                                  src={baptismDetails.additionalDocs.baptismPermit.url}
                                  alt="Baptism Permit"
                                  sx={{
                                    maxWidth: 150,
                                    maxHeight: 150,
                                    width: '100%',
                                    objectFit: "contain",
                                    cursor: "pointer",
                                    borderRadius: 1,
                                    mt: 1,
                                  }}
                                  onClick={() => openModal(baptismDetails.additionalDocs.baptismPermit.url)}
                                />
                                <Button
                                  onClick={() => openModal(baptismDetails.additionalDocs.baptismPermit.url)}
                                  variant="contained"
                                  sx={{ mt: 1, backgroundColor: "#d5edd9", color: "black" }}
                                >
                                  View Full Image
                                </Button>
                              </>
                            ) : (
                              <Typography color="textSecondary">N/A</Typography>
                            )}
                          </CardContent>
                        </Card>

                        <Card sx={{ flex: "1 1 300px", maxWidth: "400px" }}>
                          <CardContent>
                            <Typography variant="body1" fontWeight="bold">
                              Certificate Of No Record Baptism:
                            </Typography>
                            {baptismDetails.additionalDocs.certificateOfNoRecordBaptism?.url ? (
                              <>
                                <Box
                                  component="img"
                                  src={baptismDetails.additionalDocs.certificateOfNoRecordBaptism.url}
                                  alt="Certificate Of No Record Baptism"
                                  sx={{
                                    maxWidth: 150,
                                    maxHeight: 150,
                                    width: '100%',
                                    objectFit: "contain",
                                    cursor: "pointer",
                                    borderRadius: 1,
                                    mt: 1,
                                  }}
                                  onClick={() => openModal(baptismDetails.additionalDocs.certificateOfNoRecordBaptism.url)}
                                />
                                <Button
                                  onClick={() => openModal(baptismDetails.additionalDocs.certificateOfNoRecordBaptism.url)}
                                  variant="contained"
                                  sx={{ mt: 1, backgroundColor: "#d5edd9", color: "black" }}
                                >
                                  View Full Image
                                </Button>
                              </>
                            ) : (
                              <Typography color="textSecondary">N/A</Typography>
                            )}
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </Box>
                </Box>

                {/* Baptism Checklist Section - Now properly separated */}
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Baptism Checklist
                  </Typography>
                  <UserBaptismChecklist baptismId={formId} />
                </Box>
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                  {/* Admin Notes */}
                  <Card sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Admin Notes
                      </Typography>
                      {baptismDetails.adminNotes?.length > 0 ? (
                        baptismDetails.adminNotes.map((note, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Typography><strong>Priest:</strong> {note.priest || "N/A"}</Typography>
                            <Typography><strong>Recorded By:</strong> {note.recordedBy || "N/A"}</Typography>
                            <Typography><strong>Book Number:</strong> {note.bookNumber || "N/A"}</Typography>
                            <Typography><strong>Page Number:</strong> {note.pageNumber || "N/A"}</Typography>
                            <Typography><strong>Line Number:</strong> {note.lineNumber || "N/A"}</Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography>No admin notes available.</Typography>
                      )}
                    </CardContent>
                  </Card>

                  {/* Rescheduling */}
                  <Card sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Rescheduling Information
                      </Typography>
                      {baptismDetails.adminRescheduled ? (
                        <>
                          <Typography>
                            <strong>Updated Baptism Date:</strong>{" "}
                            {new Date(baptismDetails.adminRescheduled.date).toLocaleDateString()}
                          </Typography>
                          <Typography>
                            <strong>Reason:</strong> {baptismDetails.adminRescheduled.reason}
                          </Typography>
                        </>
                      ) : (
                        <Typography>No rescheduling information available.</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Box>

                {/* Checklist */}

              </Box>
            )}
          </Box>

          {/* Cancel Button - Shown on all tabs */}


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
              <div>
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

                  <Button onClick={closeModal} variant="contained" color="error" sx={{ mx: 1 }} size="small" >
                    Close
                  </Button>

                </Box>
              </div>
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
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, m: 3 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancel}
            sx={{ px: 4, py: 2 }}
          >
            Cancel Baptism Request
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MySubmittedBaptismForm;