import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../../Layout/styles/style.css";
import GuestSideBar from "../../../../GuestSideBar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, Box, Paper, Button, Modal, Tabs, Tab } from "@mui/material";

const MySubmittedFuneralForm = () => {
    const [funeralDetails, setFuneralDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { formId } = useParams();

    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const [comments, setComments] = useState([]);
    const [updatedFuneralDate, setUpdatedFuneralDate] = useState(funeralDetails?.funeralDate || "");
    const [priest, setPriest] = useState("");
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const fetchFuneralDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/getFuneralForm/${formId}`,
                    { withCredentials: true }
                );
                console.log("API Response:", response.data);

                if (response.data) {
                    setFuneralDetails(response.data);
                    setComments(response.data.comments || []);
                    setPriest(response.data.priest || "N/A");

                    if (response.data.funeralDate) {
                        setUpdatedFuneralDate(response.data.funeralDate);
                    }
                }
            } catch (err) {
                console.error("API Error:", err);
                setError("Failed to fetch funeral details.");
            } finally {
                setLoading(false);
            }
        };

        if (formId) fetchFuneralDetails(); // Only fetch if formId exists
    }, [formId]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleCancel = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API}/api/v1/${funeralDetails._id}/declineFuneral`, null, {
                withCredentials: true,
            });
            alert("Funeral request cancelled.");
            navigate("/user/profile");
        } catch (error) {
            console.error("Error cancelling funeral:", error);
            alert("Failed to cancel the funeral request.");
        }
    };

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
    const formatTime12Hour = (timeString) => {
        if (!timeString) return "N/A";
        const date = new Date(`1970-01-01T${timeString}`);
        return isNaN(date.getTime())
            ? timeString
            : date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    };

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString() : "N/A";
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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
                        My Submitted Funeral Form
                    </Typography>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        centered
                        sx={{ mb: 3 }}
                    >
                        <Tab label="Funeral Information" />
                        <Tab label="Funeral Documents" />
                        <Tab label="Admin & Checklist" />
                    </Tabs>
                    <Box sx={{
                        minHeight: "600px", // Fixed height for tab content
                        overflow: "auto" // Add scroll if content is too long
                    }}>

                        {/* Funeral Details Box */}
                        {activeTab === 0 && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom>
                                            Funeral Details
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                            {[
                                                { label: "Name", value: funeralDetails?.name },
                                                { label: "Age", value: funeralDetails?.age },
                                                { label: "Contact Person", value: funeralDetails?.contactPerson },
                                                { label: "Relationship", value: funeralDetails?.relationship },
                                                { label: "Phone", value: funeralDetails?.phone },
                                                {
                                                    label: "Address",
                                                    value: funeralDetails?.address
                                                        ? `${funeralDetails.address.state || ""}, ${funeralDetails.address.country || ""}, ${funeralDetails.address.zip || ""}`
                                                        : "N/A",
                                                    flex: "1 1 100%"
                                                },
                                                { label: "Place of Death", value: funeralDetails?.placeOfDeath },
                                                { label: "Funeral Date", value: formatDate(funeralDetails?.funeralDate) },
                                                { label: "Time", value: formatTime12Hour(funeralDetails?.funeraltime) },
                                                { label: "Service Type", value: funeralDetails?.serviceType },
                                                { label: "Priest Visit", value: funeralDetails?.priestVisit },
                                                { label: "Reason of Death", value: funeralDetails?.reasonOfDeath },
                                                { label: "Funeral Mass Date", value: formatDate(funeralDetails?.funeralMassDate) },
                                                { label: "Funeral Mass Time", value: formatTime12Hour(funeralDetails?.funeralMasstime) },
                                                { label: "Funeral Mass", value: funeralDetails?.funeralMass },
                                                { label: "Funeral Status", value: funeralDetails?.funeralStatus },
                                                { label: "Confirmed At", value: formatDate(funeralDetails?.confirmedAt) },
                                                { label: "Placing of Pall by", value: funeralDetails?.placingOfPall?.by },
                                                {
                                                    label: "Family Members Placing Pall",
                                                    value: funeralDetails?.placingOfPall?.familyMembers?.join(", "),
                                                    hidden: !(funeralDetails?.placingOfPall?.familyMembers?.length > 0)
                                                },
                                            ].map(
                                                ({ label, value, flex = "1 1 250px", hidden }, i) =>
                                                    !hidden && (
                                                        <Typography key={i} sx={{ flex }}>
                                                            <strong>{label}:</strong> {value || "N/A"}
                                                        </Typography>
                                                    )
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        )}
                        {/* Death Certificate Section */}
                        {activeTab === 1 && (
                            <div className="house-details-box">
                                <h3>Death Certificate</h3>
                                {['deathCertificate'].map((doc, index) => (
                                    <div key={index} className="house-details-item">
                                        <p>{doc.replace(/([A-Z])/g, ' $1').trim()}:</p>
                                        {funeralDetails?.[doc]?.url ? (
                                            <img
                                                src={funeralDetails[doc].url}
                                                alt={doc}
                                                style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", cursor: "pointer" }}
                                                onClick={() => openModal(funeralDetails[doc].url)}
                                            />
                                        ) : (
                                            "N/A"
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 2 && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                <div className="admin-comments-section">
                                    <h3>Admin Notes</h3>
                                    {comments && Array.isArray(comments) && comments.length > 0 ? (
                                        comments.map((comment, index) => (

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

                                {/* Updated Funeral Date Section */}
                                <div className="blessing-date-box">
                                    <h3>Updated Funeral Date</h3>
                                    <p className="date">
                                        {funeralDetails?.adminRescheduled ? new Date(funeralDetails.adminRescheduled.date).toLocaleDateString() : "N/A"}
                                    </p>
                                    {funeralDetails?.adminRescheduled?.reason && (
                                        <div className="reschedule-reason">
                                            <h3>Reason for Rescheduling</h3>
                                            <p>{funeralDetails.adminRescheduled.reason}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Priest Section */}
                                <div className="house-comments-section">
                                    <h2>Priest</h2>
                                    {funeralDetails?.Priest?.name ? (
                                        <div className="admin-comment">
                                            <p><strong>Priest:</strong> {funeralDetails.Priest.name}</p>
                                        </div>
                                    ) : (
                                        <p>No priest.</p>
                                    )}
                                </div>
                            </Box>
                        )}

                        {/* Cancel Button */}
                        <div className="button-container">
                            <button onClick={handleCancel}>Cancel</button>
                        </div>

                    </Box>
                </Paper>
            </Box>
            <ToastContainer />
        </Box >
    );
};

export default MySubmittedFuneralForm;