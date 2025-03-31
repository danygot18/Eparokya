import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import "../../Layout/styles/style.css";
import "./funeral.css";

import { useParams, useNavigate } from "react-router-dom";

import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';
import { toast, ToastContainer } from 'react-toastify';
// import { useFocusEffect } from '@react-navigation/native';

import { Box, Paper, Typography, Stack, Divider, Modal, Button, TextField } from "@mui/material";



const FuneralDetails = () => {
    const { funeralId } = useParams();
    const [funeralDetails, setFuneralDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [priest, setPriest] = useState("");

    const [priestsList, setPriestsList] = useState([]);
    const [selectedPriestId, setSelectedPriestId] = useState("");

    const [selectedComment, setSelectedComment] = useState("");
    const [additionalComment, setAdditionalComment] = useState("");
    const [comments, setComments] = useState([]);

    const [newDate, setNewDate] = useState("");
    const [reason, setReason] = useState("");
    const [updatedFuneralDate, setUpdatedFuneralDate] = useState(funeralDetails?.funeralDate || "");



    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const [deathCertificateImage, setDeathCertificateImage] = useState("");

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });


    const predefinedComments = [
        "Confirmed",
        "Pending Confirmation",
        "Rescheduled",
        "Cancelled",
    ];

    useEffect(() => {
        const fetchFuneralDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/getFuneral/${funeralId}`,
                    { withCredentials: true }
                );
                setFuneralDetails(response.data);
                setComments(response.data.comments || []);
                setSelectedPriestId(response.data.counseling?.priest?._id || "");
                setDeathCertificateImage(response.data.deathCertificate || "");

                setUpdatedFuneralDate(response.data.funeralDate || "");
            } catch (err) {
                console.error("API Error:", err);
                setError("Failed to fetch funeral details.");
            } finally {
                setLoading(false);
            }
        };

        const fetchPriests = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/getAvailablePriest`,
                    { withCredentials: true }
                );
                const fetchedPriests = response.data.priests;
                const formattedPriests = Array.isArray(fetchedPriests) ? fetchedPriests : [fetchedPriests];
                setPriestsList(formattedPriests);
                if (formattedPriests.length > 0) {
                    setSelectedPriestId(formattedPriests[0]._id);
                }
            } catch (err) {
                console.error("Failed to fetch priests:", err);
                setPriestsList([]);
            }
        };

        fetchFuneralDetails();
        fetchPriests();
        // console.log("Funeral Details:", funeralId);
    }, [funeralId]);


    const handleConfirm = async (funeralId) => {
        try {

            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/confirmFuneral/${funeralId}`,
                { withCredentials: true },

            );
            // console.log("Confirmation response:", response.data);
            toast.success("Funeral confirmed successfully!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Error confirming funeral:", error.response || error.message);
            toast.error(
                error.response?.data?.message || "Failed to confirm the funeral.",
                {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                }
            );
        }
    };

    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a cancellation reason.", { position: toast.POSITION.TOP_RIGHT });
            return;
        }
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/declineFuneral/${funeralId}`,
                { reason: cancelReason },
                { withCredentials: true }
            );

            toast.success("Funeral cancelled successfully!", { position: toast.POSITION.TOP_RIGHT });
            setShowCancelModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel the funeral.", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    // const handleUpdate = async () => {
    //     if (!newDate || !reason) {
    //         alert("Please select a date and provide a reason.");
    //         return;
    //     }

    //     try {
    //         setLoading(true);
    //         const response = await axios.put(
    //             `${process.env.REACT_APP_API}/api/v1/updateFuneralDate/${funeralDetails._id}`,
    //             { newDate, reason }
    //         );

    //         setUpdatedFuneralDate(response.data.funeral.funeralDate);
    //         alert("Funeral date updated successfully!");
    //     } catch (error) {
    //         console.error("Error updating funeral date:", error);
    //         alert("Failed to update funeral date.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleUpdate = async () => {
        if (!newDate || !reason) {
            alert("Please select a date and provide a reason.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/updateFuneralDate/${funeralDetails._id}`,
                { newDate, reason }
            );

            setUpdatedFuneralDate(response.data.funeral.funeralDate);
            setFuneralDetails(prevDetails => ({
                ...prevDetails,
                funeralDate: response.data.funeral.funeralDate
            }));

            alert("Funeral date updated successfully!");
        } catch (error) {
            console.error("Error updating funeral date:", error);
            alert("Failed to update funeral date.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!selectedComment && !additionalComment) {
            alert("Please select or enter a comment.");
            return;
        }
        const commentData = {
            selectedComment: selectedComment || "",
            additionalComment: additionalComment || "",
        };
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API}/api/v1/commentFuneral/${funeralId}`,
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

    const handleAddPriest = async () => {
        if (!selectedPriestId) {
            alert("Please select a priest.");
            return;
        }
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/funeralAddPriest/${funeralId}`,
                { priestId: selectedPriestId },
                { withCredentials: true }
            );
            toast.success("Priest assigned successfully!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            setFuneralDetails(prev => ({
                ...prev,
                priest: priestsList.find(priest => priest._id === selectedPriestId) || null
            }));
        } catch (error) {
            console.error("Error assigning priest:", error);
            toast.error("Failed to assign priest.");
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

    const handleZoomIn = () => setZoom((prev) => prev + 0.2);
    const handleZoomOut = () => setZoom((prev) => Math.max(0.5, prev - 0.2));

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="funeral-details-page">
            <SideBar />


            <div className="funeral-details-box">
                {/* Funeral Details Box */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, marginBottom: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                        Funeral Details
                    </Typography>

                    <Stack spacing={1.5}>
                        <Typography><strong>Name:</strong> {funeralDetails?.name || "N/A"}</Typography>
                        <Typography><strong>Age:</strong> {funeralDetails?.age || "N/A"}</Typography>
                        <Typography><strong>Contact Person:</strong> {funeralDetails?.contactPerson || "N/A"}</Typography>
                        <Typography><strong>Relationship:</strong> {funeralDetails?.relationship || "N/A"}</Typography>
                        <Typography><strong>Phone:</strong> {funeralDetails?.phone || "N/A"}</Typography>

                        <Divider />

                        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                            Address
                        </Typography>
                        <Typography><strong>Bldg Name/Tower:</strong> {funeralDetails?.address?.BldgNameTower || "N/A"}</Typography>
                        <Typography><strong>Lot/Block/Phase/House No.:</strong> {funeralDetails?.address?.LotBlockPhaseHouseNo || "N/A"}</Typography>
                        <Typography><strong>Subdivision/Village/Zone:</strong> {funeralDetails?.address?.SubdivisionVillageZone || "N/A"}</Typography>
                        <Typography><strong>Street:</strong> {funeralDetails?.address?.Street || "N/A"}</Typography>
                        <Typography><strong>Barangay:</strong> {funeralDetails?.address?.barangay === "Others" ? funeralDetails?.address?.customBarangay || "N/A" : funeralDetails?.address?.barangay || "N/A"}</Typography>
                        <Typography><strong>District:</strong> {funeralDetails?.address?.District || "N/A"}</Typography>
                        <Typography><strong>City:</strong> {funeralDetails?.address?.city === "Others" ? funeralDetails?.address?.customCity || "N/A" : funeralDetails?.address?.city || "N/A"}</Typography>

                        <Divider />

                        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                            Funeral Information
                        </Typography>
                        <Typography><strong>Place of Death:</strong> {funeralDetails?.placeOfDeath || "N/A"}</Typography>
                        <Typography><strong>Funeral Date:</strong> {funeralDetails?.funeralDate ? new Date(funeralDetails.funeralDate).toLocaleDateString() : "N/A"}</Typography>
                        <Typography><strong>Time:</strong> {funeralDetails?.funeraltime || "N/A"}</Typography>
                        <Typography><strong>Service Type:</strong> {funeralDetails?.serviceType || "N/A"}</Typography>
                        <Typography><strong>Priest Visit:</strong> {funeralDetails?.priestVisit || "N/A"}</Typography>
                        <Typography><strong>Reason of Death:</strong> {funeralDetails?.reasonOfDeath || "N/A"}</Typography>

                        <Divider />

                        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                            Funeral Mass Details
                        </Typography>
                        <Typography><strong>Funeral Mass Date:</strong> {funeralDetails?.funeralMassDate ? new Date(funeralDetails.funeralMassDate).toLocaleDateString() : "N/A"}</Typography>
                        <Typography><strong>Funeral Mass Time:</strong> {funeralDetails?.funeralMasstime || "N/A"}</Typography>
                        <Typography><strong>Funeral Mass:</strong> {funeralDetails?.funeralMass || "N/A"}</Typography>
                        <Typography><strong>Funeral Status:</strong> {funeralDetails?.funeralStatus || "N/A"}</Typography>
                        <Typography><strong>Confirmed At:</strong> {funeralDetails?.confirmedAt ? new Date(funeralDetails.confirmedAt).toLocaleDateString() : "N/A"}</Typography>

                        {funeralDetails?.placingOfPall?.by && (
                            <Typography><strong>Placing of Pall by:</strong> {funeralDetails.placingOfPall.by}</Typography>
                        )}
                        {funeralDetails?.placingOfPall?.familyMembers?.length > 0 && (
                            <Typography>
                                <strong>Family Members Placing Pall:</strong> {funeralDetails.placingOfPall.familyMembers.join(", ")}
                            </Typography>
                        )}
                    </Stack>
                </Paper>

                {/* Death Certificate Section */}
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
                            {/* Header with Close and Zoom Buttons */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 2 }}>
                                <Button onClick={closeModal} variant="contained" size="small">Close</Button>
                                <Box>
                                    <Button onClick={handleZoomIn} variant="outlined" sx={{ mx: 1 }}>Zoom In</Button>
                                    <Button onClick={handleZoomOut} variant="outlined" sx={{ mx: 1 }}>Zoom Out</Button>
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
            </div>
            {/* Admin Comments Section */}

            <div className="funeral-details-box">
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, marginBottom: 2 }}>
                    <h2>Admin Comments</h2>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className="admin-comment">
                                <p><strong>Selected Comment:</strong> {comment?.selectedComment || "N/A"}</p>
                                <p><strong>Additional Comment:</strong> {comment?.additionalComment || "N/A"}</p>
                            </div>
                        ))
                    ) : (
                        <p>No admin comments yet.</p>
                    )}


                    {/* Updated Funeral Date Section */}
                    <div className="blessing-date-box">
                        <h3>Updated Funeral Date</h3>
                        <p className="date">
                            {updatedFuneralDate ? new Date(updatedFuneralDate).toLocaleDateString() : "N/A"}
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
                        {funeralDetails?.priest?.name ? (
                            <div className="admin-comment">
                                <p><strong>Priest:</strong> {funeralDetails.priest.title} {funeralDetails.priest.fullName}</p>
                            </div>
                        ) : (
                            <p>No priest Assigned.</p>
                        )}
                    </div>

                    {/* Admin Section for Updating Funeral Date */}
                    <div className="house-section">
                        <h2>Select Updated Funeral Date:</h2>
                        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                        <Typography>Reason:</Typography>
                        <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
                        <div className="button-container">
                            <button onClick={handleUpdate} disabled={loading}>
                                {loading ? "Updating..." : "Update Funeral Date"}
                            </button>
                        </div>
                    </div>

                    {/* Admin Comment Submission */}
                    <div className="house-section">
                        <h2>Submit Admin Comment</h2>
                        <select
                            value={selectedComment}
                            onChange={(e) => setSelectedComment(e.target.value)}
                        >
                            <option value="" disabled>Select a comment</option>
                            {predefinedComments.map((comment, index) => (
                                <option key={index} value={comment}>{comment}</option>
                            ))}
                        </select>
                        <textarea
                            placeholder="Additional Comments"
                            value={additionalComment}
                            onChange={(e) => setAdditionalComment(e.target.value)}
                        />
                        <div className="button-container">
                            <button onClick={handleSubmitComment}>Submit Comment</button>
                        </div>
                    </div>

                    {/* Adding Priest */}
                    <div className="house-section">
                        <h2>Assign Priest</h2>
                        <select
                            value={selectedPriestId}
                            onChange={(e) => setSelectedPriestId(e.target.value)}
                        >
                            {priestsList.length > 0 ? (
                                priestsList.map((priest) => (
                                    <option key={priest._id} value={priest._id}>
                                        {priest.title} {priest.fullName}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No Priests Available</option>
                            )}
                        </select>




                        <div className="button-container">
                            <button onClick={handleAddPriest}>Assign Priest</button>
                        </div>
                    </div>
                </Paper>
                {/* Cancelling Reason Section */}
                {funeralDetails?.funeralStatus === "Cancelled" && funeralDetails?.cancellingReason ? (
                    <div className="house-comments-section">
                        <h2>Cancellation Details</h2>
                        <div className="admin-comment">
                            <p><strong>Cancelled By:</strong> {funeralDetails.cancellingReason.user === "Admin" ? "Admin" : funeralDetails.cancellingReason.user}</p>
                            <p><strong>Reason:</strong> {funeralDetails.cancellingReason.reason || "No reason provided."}</p>
                        </div>
                    </div>
                ) : null}

                {/* Cancel Button */}
                <div className="button-container" style={{ marginBottom: "10px" }}>
                    <Button variant="contained" color="error" size="small" onClick={() => setShowCancelModal(true)}>Cancel Funeral</Button>
                </div>

                {/* Cancellation Modal */}
                <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 3,
                            borderRadius: 2,
                            width: 400,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Typography variant="h6">Cancel Funeral</Typography>
                        <Typography variant="body2">Please provide a reason for cancellation:</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Enter reason..."
                            variant="outlined"
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Button variant="contained" color="error" style={{ marginRight: "10px" }} onClick={handleCancel}>Confirm Cancel</Button>
                            <Button variant="outlined" onClick={() => setShowCancelModal(false)}>Back</Button>
                        </Box>
                    </Box>
                </Modal>

                {/* Confirmation and Decline Buttons */}
                <div className="button-container" style={{ marginBottom: "10px" }}>
                    <Button variant="contained" size="small" onClick={() => handleConfirm(funeralId)}>Confirm Funeral</Button>
                </div>

                <div className="button-container">
                    <Button variant="contained" size="small" onClick={() => navigate(`/adminChat/${funeralDetails?.userId?._id}/${funeralDetails?.userId?.email}`)}>
                        Go to Admin Chat
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default FuneralDetails;
