import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import "./counseling.css";

import SideBar from "../SideBar";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';
import { toast, ToastContainer } from 'react-toastify';
import { Box, Paper, Typography, Grid, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

Modal.setAppElement("#root");

const CounselingDetails = () => {
    const { counselingId } = useParams();
    const [counselingDetails, setCounselingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [priestsList, setPriestsList] = useState([]);
    const [selectedPriestId, setSelectedPriestId] = useState("");

    const [selectedComment, setSelectedComment] = useState("");
    const [rescheduledDate, setRescheduledDate] = useState("");
    const [rescheduledReason, setRescheduledReason] = useState("");
    const [additionalComment, setAdditionalComment] = useState("");
    const [comments, setComments] = useState([]);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const navigate = useNavigate();

    const [newDate, setNewDate] = useState("");
    const [reason, setReason] = useState("");
    const [updatedCounselingDate, setUpdatedCounselingDate] = useState(counselingDetails?.counselingDate || "");

    const predefinedComments = [
        "Confirmed",
        "Pending Confirmation",
        "Rescheduled",
        "Cancelled",
    ];

    useEffect(() => {
        const fetchCounselingDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/getCounseling/${counselingId}`,
                    { withCredentials: true }
                );

                console.log("Fetched Counseling Details:", response.data);

                setCounselingDetails(response.data.counseling);
                setComments(response.data.counseling.comments || []);
                setSelectedPriestId(response.data.counseling?.priest?._id || "");

                setUpdatedCounselingDate(response.data.counseling?.counselingDate || "");

            } catch (err) {
                setError("Failed to fetch counseling details.");
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
        fetchCounselingDetails();
        fetchPriests();
    }, []);


    const handleConfirm = async (counselingId) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/${counselingId}/confirmCounseling`,
                { withCredentials: true }
            );
            toast.success("Counseling confirmed successfully!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to confirm the counseling.",
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
                `${process.env.REACT_APP_API}/api/v1/declineCounseling/${counselingId}`,
                { reason: cancelReason },
                { withCredentials: true }
            );

            toast.success("Counseling cancelled successfully!", { position: toast.POSITION.TOP_RIGHT });
            setShowCancelModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel the counseling.", {
                position: toast.POSITION.TOP_RIGHT,
            });
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
                `${process.env.REACT_APP_API}/api/v1/updateCounselingDate/${counselingId}`,
                { newDate, reason }
            );

            console.log("Updated Counseling Response:", response.data); // Debugging

            setUpdatedCounselingDate(response.data.counseling?.counselingDate || newDate); // Ensure proper update

            alert("Counseling date updated successfully!");
        } catch (error) {
            console.error("Error updating counseling date:", error);
            alert("Failed to update counseling date.");
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
                `${process.env.REACT_APP_API}/api/v1/${counselingId}/commentCounseling`,
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
            alert("Comment submitted successfully!");
        } catch (error) {
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
                `${process.env.REACT_APP_API}/api/v1/counselingAddPriest/${counselingId}`,
                { priestId: selectedPriestId },
                { withCredentials: true }
            );
            toast.success("Priest assigned successfully!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            setCounselingDetails(prev => ({
                ...prev,
                priest: priestsList.find(priest => priest._id === selectedPriestId) || null
            }));
        } catch (error) {
            console.error("Error assigning priest:", error);
            toast.error("Failed to assign priest.");
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9f9f9" }}>
            <ToastContainer />
            <SideBar />
            <Box sx={{ flex: 1, p: { xs: 1, md: 4 } }}>
                <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, margin: "0 auto" }}>
                    <Typography variant="h4" gutterBottom>Counseling Details</Typography>
                    <Grid container spacing={2}>
                        {/* Counseling Details */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1"><strong>Full Name:</strong> {counselingDetails?.person?.fullName || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Date of Birth:</strong> {counselingDetails?.person?.dateOfBirth ? new Date(counselingDetails.person.dateOfBirth).toLocaleDateString() : "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Purpose:</strong> {counselingDetails?.purpose || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Contact Person:</strong> {counselingDetails?.contactPerson?.fullName || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Contact Number:</strong> {counselingDetails?.contactPerson?.contactNumber || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Relationship:</strong> {counselingDetails?.contactPerson?.relationship || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Bldg Name/Tower:</strong> {counselingDetails?.address?.BldgNameTower || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Lot/Block/Phase/House No.:</strong> {counselingDetails?.address?.LotBlockPhaseHouseNo || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Subdivision/Village/Zone:</strong> {counselingDetails?.address?.SubdivisionVillageZone || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Street:</strong> {counselingDetails?.address?.Street || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Barangay:</strong> {counselingDetails?.address?.barangay === 'Others' ? counselingDetails?.address?.customBarangay || "N/A" : counselingDetails?.address?.barangay || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>District:</strong> {counselingDetails?.address?.District || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>City:</strong> {counselingDetails?.address?.city === 'Others' ? counselingDetails?.address?.customCity || "N/A" : counselingDetails?.address?.city || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Counseling Date:</strong> {counselingDetails?.counselingDate ? new Date(counselingDetails.counselingDate).toLocaleDateString() : "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Counseling Time:</strong> {counselingDetails?.counselingTime || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Counseling Status:</strong> {counselingDetails?.counselingStatus || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Confirmed At:</strong> {counselingDetails?.confirmedAt ? new Date(counselingDetails.confirmedAt).toLocaleDateString() : "N/A"}</Typography>
                        </Grid>

                        {/* Admin Comments */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>Admin Comments</Typography>
                            {(comments && comments.length > 0) ? (
                                comments.map((comment, index) => (
                                    <Paper key={index} sx={{ p: 2, mb: 1, bgcolor: "#f5f5f5" }}>
                                        <Typography variant="body2"><strong>Selected Comment:</strong> {comment?.selectedComment || "N/A"}</Typography>
                                        <Typography variant="body2"><strong>Additional Comment:</strong> {comment?.additionalComment || "N/A"}</Typography>
                                    </Paper>
                                ))
                            ) : (
                                <Typography variant="body2">No admin comments yet.</Typography>
                            )}
                        </Grid>
                    </Grid>

                    {/* Updated Counseling Date */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Updated Counseling Date</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {updatedCounselingDate ? new Date(updatedCounselingDate).toLocaleDateString() : "N/A"}
                        </Typography>
                        {counselingDetails?.adminRescheduled?.reason && (
                            <Paper sx={{ p: 2, bgcolor: "#fffbe7" }}>
                                <Typography variant="subtitle2">Reason for Rescheduling</Typography>
                                <Typography variant="body2">{counselingDetails.adminRescheduled.reason}</Typography>
                            </Paper>
                        )}
                    </Box>

                    {/* Priest Section */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Assigned Priest</Typography>
                        {counselingDetails?.priest ? (
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>{counselingDetails.priest.title} {counselingDetails.priest.fullName}</strong>
                            </Typography>
                        ) : (
                            <Typography variant="body2" sx={{ mb: 1 }}>No priest assigned.</Typography>
                        )}
                    </Box>

                    {/* Assign Priest */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">Assign Priest</Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="priest-select-label">Select Priest</InputLabel>
                            <Select
                                labelId="priest-select-label"
                                value={selectedPriestId}
                                label="Select Priest"
                                onChange={(e) => setSelectedPriestId(e.target.value)}
                            >
                                {priestsList.length > 0 ? (
                                    priestsList.map((priest) => (
                                        <MenuItem key={priest._id} value={priest._id}>
                                            {priest.title} {priest.fullName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>No Priests Available</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" onClick={handleAddPriest}>
                            Assign Priest
                        </Button>
                    </Box>

                    {/* Update Counseling Date */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6">Select Updated Counseling Date</Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <TextField
                                    type="date"
                                    label="New Date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <TextField
                                    label="Reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    fullWidth
                                    multiline
                                    minRows={2}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ mt: 2 }}
                            onClick={async () => {
                                if (!newDate || !reason) {
                                    toast.error("Please select a date and provide a reason.");
                                    return;
                                }
                                try {
                                    setLoading(true);
                                    const response = await axios.put(
                                        `${process.env.REACT_APP_API}/api/v1/updateCounselingDate/${counselingId}`,
                                        { newDate, reason }
                                    );
                                    setUpdatedCounselingDate(response.data.counseling?.counselingDate || newDate);
                                    toast.success("Counseling date updated successfully!");
                                } catch (error) {
                                    toast.error("Failed to update counseling date.");
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Counseling Date"}
                        </Button>
                    </Box>

                    {/* Admin Comment Submission */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6">Submit Admin Comment</Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="comment-select-label">Select a comment</InputLabel>
                            <Select
                                labelId="comment-select-label"
                                value={selectedComment}
                                label="Select a comment"
                                onChange={(e) => setSelectedComment(e.target.value)}
                            >
                                <MenuItem value="" disabled>Select a comment</MenuItem>
                                {predefinedComments.map((comment, index) => (
                                    <MenuItem key={index} value={comment}>{comment}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Additional Comments"
                            placeholder="Additional Comments"
                            value={additionalComment}
                            onChange={(e) => setAdditionalComment(e.target.value)}
                            fullWidth
                            multiline
                            minRows={2}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                                if (!selectedComment && !additionalComment) {
                                    toast.error("Please select or enter a comment.");
                                    return;
                                }
                                const commentData = {
                                    selectedComment: selectedComment || "",
                                    additionalComment: additionalComment || "",
                                };
                                try {
                                    const response = await fetch(
                                        `${process.env.REACT_APP_API}/api/v1/${counselingId}/commentCounseling`,
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
                                    toast.success("Comment submitted successfully!");
                                } catch (error) {
                                    toast.error("Failed to submit comment.");
                                }
                            }}
                        >
                            Submit Comment
                        </Button>
                    </Box>

                    {/* Cancel Counseling */}
                    <Box sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setShowCancelModal(true)}
                            sx={{ mr: 2 }}
                        >
                            Cancel Counseling
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleConfirm(counselingId)}
                            sx={{ mr: 2 }}
                            disabled={counselingDetails?.counselingStatus === "Confirmed"}
                        >
                            Confirm Counseling
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate(`/adminChat/${counselingDetails?.userId?._id}/${counselingDetails?.userId?.email}`)}
                        >
                            Go to Admin Chat
                        </Button>
                    </Box>

                    {/* Cancellation Modal */}
                    {showCancelModal && (
                        <Box
                            sx={{
                                position: "fixed",
                                top: 0, left: 0, width: "100vw", height: "100vh",
                                bgcolor: "rgba(0,0,0,0.3)", zIndex: 1300,
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}
                        >
                            <Paper sx={{ p: 4, minWidth: 350 }}>
                                <Typography variant="h6" gutterBottom>Cancel Counseling</Typography>
                                <Typography variant="body2" gutterBottom>Please provide a reason for cancellation:</Typography>
                                <TextField
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Enter reason..."
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    sx={{ mb: 2 }}
                                />
                                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                                    <Button variant="contained" color="error" onClick={handleCancel}>Confirm Cancel</Button>
                                    <Button variant="outlined" onClick={() => setShowCancelModal(false)}>Back</Button>
                                </Box>
                            </Paper>
                        </Box>
                    )}

                    {/* Cancellation Details */}
                    {counselingDetails?.counselingStatus === "Cancelled" && counselingDetails?.cancellingReason ? (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6">Cancellation Details</Typography>
                            <Paper sx={{ p: 2, bgcolor: "#ffeaea" }}>
                                <Typography variant="body2"><strong>Cancelled By:</strong> {counselingDetails.cancellingReason.user === "Admin" ? "Admin" : counselingDetails.cancellingReason.user}</Typography>
                                <Typography variant="body2"><strong>Reason:</strong> {counselingDetails.cancellingReason.reason || "No reason provided."}</Typography>
                            </Paper>
                        </Box>
                    ) : null}
                </Paper>
            </Box>
        </Box>
    );
};

export default CounselingDetails;