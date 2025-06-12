import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import {
  Box,
  Typography,
  Paper,
  Divider,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Modal,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import SideBar from "../SideBar";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const UserHouseBlessingsDetails = () => {
    const { blessingId } = useParams();
    const [blessingDetails, setBlessingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [priestsList, setPriestsList] = useState([]);
    const [selectedPriestId, setSelectedPriestId] = useState("");

    const [selectedComment, setSelectedComment] = useState("");
    const [rescheduledReason, setRescheduledReason] = useState("");
    const [additionalComment, setAdditionalComment] = useState("");
    const [comments, setComments] = useState([]);

    const [newDate, setNewDate] = useState(null);
    const [reason, setReason] = useState("");
    const [updatedBlessingDate, setUpdatedBlessingDate] = useState(null);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const predefinedComments = [
        "Confirmed",
        "Pending Confirmation",
        "Rescheduled",
        "Cancelled",
    ];

    useEffect(() => {
        const fetchBlessingDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/getHouseBlessing/${blessingId}`,
                    { withCredentials: true }
                );
                setBlessingDetails(response.data.houseBlessing);
                setComments(response.data.houseBlessing.comments || []);
                setUpdatedBlessingDate(new Date(response.data.blessingDate));
                setSelectedPriestId(response.data.houseBlessing?.priest?._id || "");
            } catch (err) {
                setError("Failed to fetch house blessing details.");
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
                const fetchedPriests = Array.isArray(response.data.priests) 
                    ? response.data.priests 
                    : [response.data.priests];
                setPriestsList(fetchedPriests);
            } catch (err) {
                console.error("Failed to fetch priests:", err);
                setPriestsList([]);
            }
        };

        fetchBlessingDetails();
        fetchPriests();
    }, [blessingId]);

    const handleConfirm = async () => {
        try {
            await axios.post(
                `${process.env.REACT_APP_API}/api/v1/${blessingId}/confirmBlessing`,
                {},
                { withCredentials: true }
            );
            toast.success("House blessing confirmed successfully!");
            setBlessingDetails(prev => ({ ...prev, blessingStatus: "Confirmed" }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to confirm the house blessing.");
        }
    };

    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a cancellation reason.");
            return;
        }
        try {
            await axios.post(
                `${process.env.REACT_APP_API}/api/v1/declineBlessing/${blessingId}`,
                { reason: cancelReason },
                { withCredentials: true }
            );
            toast.success("House Blessing cancelled successfully!");
            setShowCancelModal(false);
            setBlessingDetails(prev => ({ ...prev, blessingStatus: "Cancelled" }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel the house blessing.");
        }
    };

    const handleUpdate = async () => {
        if (!newDate || !reason) {
            toast.error("Please select a date and provide a reason.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/updateHouseBlessingDate/${blessingId}`,
                { newDate, reason },
                { withCredentials: true }
            );
            setUpdatedBlessingDate(newDate);
            toast.success("Blessing date updated successfully!");
        } catch (error) {
            console.error("Error updating blessing date:", error);
            toast.error("Failed to update blessing date.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!selectedComment && !additionalComment) {
            toast.error("Please select or enter a comment.");
            return;
        }
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/${blessingId}/commentBlessing`,
                {
                    selectedComment: selectedComment || "",
                    additionalComment: additionalComment || "",
                },
                { withCredentials: true }
            );
            setComments(prev => [...prev, response.data.comment]);
            toast.success("Comment submitted successfully!");
            setSelectedComment("");
            setAdditionalComment("");
        } catch (error) {
            toast.error("Failed to submit comment.");
        }
    };

    const handleAddPriest = async () => {
        if (!selectedPriestId) {
            toast.error("Please select a priest.");
            return;
        }
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/addPriestBlessing/${blessingId}`,
                { priestId: selectedPriestId },
                { withCredentials: true }
            );
            const assignedPriest = priestsList.find(p => p._id === selectedPriestId);
            setBlessingDetails(prev => ({
                ...prev,
                priest: assignedPriest
            }));
            toast.success("Priest assigned successfully!");
        } catch (error) {
            console.error("Error assigning priest:", error);
            toast.error("Failed to assign priest.");
        }
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Alert severity="error">{error}</Alert>
        </Box>
    );

    return (
        <Box display="flex">
            <SideBar />
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom>House Blessing Details</Typography>
                
                <Stack spacing={3}>
                    {/* Blessing Details Card */}
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>Blessing Information</Typography>
                            <Divider sx={{ my: 2 }} />
                            
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="subtitle1"><strong>Full Name:</strong> {blessingDetails?.fullName || "N/A"}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1"><strong>Contact Number:</strong> {blessingDetails?.contactNumber || "N/A"}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1"><strong>Address:</strong></Typography>
                                    <Typography variant="body2">
                                        {blessingDetails?.address?.BldgNameTower && `${blessingDetails.address.BldgNameTower}, `}
                                        {blessingDetails?.address?.LotBlockPhaseHouseNo && `${blessingDetails.address.LotBlockPhaseHouseNo}, `}
                                        {blessingDetails?.address?.SubdivisionVillageZone && `${blessingDetails.address.SubdivisionVillageZone}, `}
                                        {blessingDetails?.address?.Street && `${blessingDetails.address.Street}, `}
                                        {blessingDetails?.address?.district && `${blessingDetails.address.district}, `}
                                        {blessingDetails?.address?.barangay === "Others"
                                            ? (blessingDetails.address.customBarangay || "")
                                            : (blessingDetails?.address?.barangay || "")}
                                        {blessingDetails?.address?.city === "Others"
                                            ? (blessingDetails.address.customCity ? `, ${blessingDetails.address.customCity}` : "")
                                            : (blessingDetails?.address?.city ? `, ${blessingDetails.address.city}` : "")}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1"><strong>Blessing Date:</strong> {blessingDetails?.blessingDate ? new Date(blessingDetails.blessingDate).toLocaleDateString() : "N/A"}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1"><strong>Blessing Time:</strong> {blessingDetails?.blessingTime || "N/A"}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1"><strong>Status:</strong> {blessingDetails?.blessingStatus || "N/A"}</Typography>
                                </Box>
                                {blessingDetails?.confirmedAt && (
                                    <Box>
                                        <Typography variant="subtitle1"><strong>Confirmed At:</strong> {new Date(blessingDetails.confirmedAt).toLocaleDateString()}</Typography>
                                    </Box>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Admin Comments */}
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>Admin Comments</Typography>
                            <Divider sx={{ my: 2 }} />
                            
                            {comments.length > 0 ? (
                                <Stack spacing={2}>
                                    {comments.map((comment, index) => (
                                        <Paper key={index} elevation={2} sx={{ p: 2 }}>
                                            {comment.selectedComment && (
                                                <Typography><strong>Comment:</strong> {comment.selectedComment}</Typography>
                                            )}
                                            {comment.additionalComment && (
                                                <Typography><strong>Details:</strong> {comment.additionalComment}</Typography>
                                            )}
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </Typography>
                                        </Paper>
                                    ))}
                                </Stack>
                            ) : (
                                <Typography>No admin comments yet.</Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* Rescheduled Information */}
                    {blessingDetails?.adminRescheduled && (
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>Rescheduled Information</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography>
                                    <strong>New Date:</strong> {new Date(blessingDetails.adminRescheduled.date).toLocaleDateString()}
                                </Typography>
                                {blessingDetails.adminRescheduled.reason && (
                                    <Typography>
                                        <strong>Reason:</strong> {blessingDetails.adminRescheduled.reason}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Priest Information */}
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>Priest Information</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography>
                                <strong>Assigned Priest:</strong> {blessingDetails?.priest?.name || "N/A"}
                            </Typography>
                            
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Select Priest</InputLabel>
                                <Select
                                    value={selectedPriestId}
                                    onChange={(e) => setSelectedPriestId(e.target.value)}
                                    label="Select Priest"
                                >
                                    {priestsList.map((priest) => (
                                        <MenuItem key={priest._id} value={priest._id}>
                                            {priest.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button 
                                variant="contained" 
                                onClick={handleAddPriest}
                                sx={{ mt: 2 }}
                            >
                                Assign Priest
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Admin Actions */}
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>Admin Actions</Typography>
                            <Divider sx={{ my: 2 }} />
                            
                            <Stack spacing={3}>
                                {/* Update Date */}
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom>Reschedule Blessing</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="New Blessing Date"
                                            value={newDate}
                                            onChange={(newValue) => setNewDate(newValue)}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </LocalizationProvider>
                                    <TextField
                                        label="Reason for Rescheduling"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        sx={{ mt: 2 }}
                                    />
                                    <Button 
                                        variant="contained" 
                                        onClick={handleUpdate}
                                        disabled={loading}
                                        sx={{ mt: 2 }}
                                    >
                                        {loading ? <CircularProgress size={24} /> : "Update Date"}
                                    </Button>
                                </Box>

                                {/* Add Comment */}
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom>Add Comment</Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Predefined Comments</InputLabel>
                                        <Select
                                            value={selectedComment}
                                            onChange={(e) => setSelectedComment(e.target.value)}
                                            label="Predefined Comments"
                                        >
                                            {predefinedComments.map((comment, index) => (
                                                <MenuItem key={index} value={comment}>{comment}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Additional Comments"
                                        value={additionalComment}
                                        onChange={(e) => setAdditionalComment(e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        sx={{ mt: 2 }}
                                    />
                                    <Button 
                                        variant="contained" 
                                        onClick={handleSubmitComment}
                                        sx={{ mt: 2 }}
                                    >
                                        Submit Comment
                                    </Button>
                                </Box>

                                {/* Status Actions */}
                                <Stack direction="row" spacing={2}>
                                    {blessingDetails?.blessingStatus === "Pending" && (
                                        <>
                                            <Button 
                                                variant="contained" 
                                                color="success"
                                                onClick={handleConfirm}
                                            >
                                                Confirm Blessing
                                            </Button>
                                            <Button 
                                                variant="contained" 
                                                color="error"
                                                onClick={() => setShowCancelModal(true)}
                                            >
                                                Cancel Blessing
                                            </Button>
                                        </>
                                    )}
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Cancellation Modal */}
                    <Modal
                        open={showCancelModal}
                        onClose={() => setShowCancelModal(false)}
                        aria-labelledby="cancel-modal-title"
                        aria-describedby="cancel-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 1
                        }}>
                            <Typography id="cancel-modal-title" variant="h6" component="h2">
                                Cancel House Blessing
                            </Typography>
                            <Typography id="cancel-modal-description" sx={{ mt: 2 }}>
                                Please provide a reason for cancellation:
                            </Typography>
                            <TextField
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Enter reason..."
                                fullWidth
                                multiline
                                rows={4}
                                sx={{ mt: 2 }}
                            />
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button onClick={() => setShowCancelModal(false)}>Back</Button>
                                <Button 
                                    variant="contained" 
                                    color="error"
                                    onClick={handleCancel}
                                >
                                    Confirm Cancel
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </Stack>
            </Box>
            <ToastContainer />
        </Box>
    );
};

export default UserHouseBlessingsDetails;