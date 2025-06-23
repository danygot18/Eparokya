import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "../SideBar";
import { toast, ToastContainer } from 'react-toastify';
import {
    Box,
    Paper,
    Typography,
    Stack,
    Divider,
    Modal,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CircularProgress,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from "@mui/material";
import {
    ZoomIn as ZoomInIcon,
    ZoomOut as ZoomOutIcon,
    Close as CloseIcon,
    Fullscreen as FullscreenIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useRef } from 'react';
import FuneralPDFDownloadForm from "./FuneralPDFDownloadForm";


const FuneralDetails = () => {
    const { funeralId } = useParams();
    const [funeralDetails, setFuneralDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [priestsList, setPriestsList] = useState([]);
    const [selectedPriestId, setSelectedPriestId] = useState("");

    const [selectedComment, setSelectedComment] = useState("");
    const [additionalComment, setAdditionalComment] = useState("");
    const [comments, setComments] = useState([]);

    const [recordedBy, setRecordedBy] = useState("");
    const [bookNumber, setBookNumber] = useState("");
    const [pageNumber, setPageNumber] = useState("");
    const [lineNumber, setLineNumber] = useState("");

    // Image viewer state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [newDate, setNewDate] = useState("");
    const [reason, setReason] = useState("");
    const [updatedFuneralDate, setUpdatedFuneralDate] = useState("");
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // pdf
    const funeralRef = useRef();
    const adminRef = useRef();

    const predefinedComments = [
        "Confirmed and on schedule",
        "Rescheduled - awaiting response",
        "Pending final confirmation",
        "Cancelled by user",
    ];

    useEffect(() => {
        const fetchFuneralDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/getFuneral/${funeralId}`,
                    { withCredentials: true }
                );
                setFuneralDetails(response.data);
                console.log("data", response.data);
                setComments(response.data.comments || []);
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
                    `${process.env.REACT_APP_API}/api/v1/getAllPriest`,
                    { withCredentials: true }
                );
                setPriestsList(response.data || []);
            } catch (err) {
                console.error("Failed to fetch priests:", err);
                setPriestsList([]);
            }
        };

        fetchFuneralDetails();
        fetchPriests();
    }, [funeralId]);

    const handleConfirm = async () => {
        setConfirmLoading(true);
        try {
            await axios.post(
                `${process.env.REACT_APP_API}/api/v1/confirmFuneral/${funeralId}`,
                {},
                { withCredentials: true }
            );
            toast.success("Funeral confirmed successfully!");
            setFuneralDetails(prev => ({ ...prev, funeralStatus: "Confirmed" }));
            setShowConfirmDialog(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to confirm the funeral.");
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a cancellation reason.");
            return;
        }
        try {
            await axios.post(
                `${process.env.REACT_APP_API}/api/v1/declineFuneral/${funeralId}`,
                { reason: cancelReason },
                { withCredentials: true }
            );
            toast.success("Funeral cancelled successfully!");
            setShowCancelModal(false);
            setFuneralDetails(prev => ({ ...prev, funeralStatus: "Cancelled" }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel the funeral.");
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
                `${process.env.REACT_APP_API}/api/v1/updateFuneralDate/${funeralId}`,
                { newDate, reason },
                { withCredentials: true }
            );
            setUpdatedFuneralDate(response.data.funeral.funeralDate);
            setFuneralDetails(prev => ({
                ...prev,
                funeralDate: response.data.funeral.funeralDate
            }));
            toast.success("Funeral date updated successfully!");
        } catch (error) {
            toast.error("Failed to update funeral date.");
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
                `${process.env.REACT_APP_API}/api/v1/commentFuneral/${funeralId}`,
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

    const handlePriestAdd = async () => {
        if (!selectedPriestId) {
            toast.error("Please select a priest.");
            return;
        }

        const newPriest = {
            priestId: selectedPriestId,

        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/addPriest/${funeralId}`,
                newPriest,
                { withCredentials: true }
            );

            setFuneralDetails(prev => ({
                ...prev,
                priests: [...(prev.priests || []), response.data]
            }));

            setSelectedPriestId("");

            toast.success("Priest added successfully!");
        } catch (error) {
            toast.error("Failed to add priest.");
        }
    };

    // Image viewer functions
    const openFileModal = (fileUrl) => {
        setSelectedFile(fileUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const isImageFile = (url) => {
        return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
    };


    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Box sx={{ p: 3 }}>
            <Alert severity="error">{error}</Alert>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <SideBar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <ToastContainer />

                {/* Funeral Details Section */}
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                    {/* Left Column */}
                    <Box
                        ref={funeralRef}
                        sx={{
                            flex: 1,
                            width: '800px',
                            padding: 2,
                            backgroundColor: 'white',
                            mb: 3, // Optional: margin-bottom for spacing
                        }}
                    >
                        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Funeral Details
                            </Typography>

                            <Stack spacing={1.5}>
                                <Typography><strong>Name:</strong> {funeralDetails?.name || "N/A"}</Typography>
                                <Typography><strong>Age:</strong> {funeralDetails?.age || "N/A"}</Typography>
                                <Typography><strong>Contact Person:</strong> {funeralDetails?.contactPerson || "N/A"}</Typography>
                                <Typography><strong>Relationship:</strong> {funeralDetails?.relationship || "N/A"}</Typography>
                                <Typography><strong>Phone:</strong> {funeralDetails?.phone || "N/A"}</Typography>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Address</Typography>
                                <Typography><strong>Bldg Name/Tower:</strong> {funeralDetails?.address?.BldgNameTower || "N/A"}</Typography>
                                <Typography><strong>Lot/Block/Phase/House No.:</strong> {funeralDetails?.address?.LotBlockPhaseHouseNo || "N/A"}</Typography>
                                <Typography><strong>Subdivision/Village/Zone:</strong> {funeralDetails?.address?.SubdivisionVillageZone || "N/A"}</Typography>
                                <Typography><strong>Street:</strong> {funeralDetails?.address?.Street || "N/A"}</Typography>
                                <Typography><strong>Barangay:</strong> {funeralDetails?.address?.barangay === "Others" ? funeralDetails?.address?.customBarangay || "N/A" : funeralDetails?.address?.barangay || "N/A"}</Typography>
                                <Typography><strong>District:</strong> {funeralDetails?.address?.District || "N/A"}</Typography>
                                <Typography><strong>City:</strong> {funeralDetails?.address?.city === "Others" ? funeralDetails?.address?.customCity || "N/A" : funeralDetails?.address?.city || "N/A"}</Typography>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Funeral Information</Typography>
                                <Typography><strong>Place of Death:</strong> {funeralDetails?.placeOfDeath || "N/A"}</Typography>
                                <Typography><strong>Funeral Date:</strong> {funeralDetails?.funeralDate ? new Date(funeralDetails.funeralDate).toLocaleDateString() : "N/A"}</Typography>
                                <Typography><strong>Time:</strong> {funeralDetails?.funeraltime || "N/A"}</Typography>
                                <Typography><strong>Service Type:</strong> {funeralDetails?.serviceType || "N/A"}</Typography>
                                <Typography><strong>Priest Visit:</strong> {funeralDetails?.priestVisit || "N/A"}</Typography>
                                <Typography><strong>Reason of Death:</strong> {funeralDetails?.reasonOfDeath || "N/A"}</Typography>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Funeral Mass Details</Typography>
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

                        {/* Documents Section */}
                        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Documents
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                                {['deathCertificate'].map((doc, index) => (
                                    <Card key={index} sx={{ flex: "1 1 300px", maxWidth: "400px" }}>
                                        <CardContent>
                                            <Typography variant="body1" fontWeight="bold">
                                                {doc.replace(/([A-Z])/g, " $1").trim()}:
                                            </Typography>

                                            {funeralDetails?.[doc]?.url ? (
                                                isImageFile(funeralDetails[doc].url) ? (
                                                    <>
                                                        <CardMedia
                                                            component="img"
                                                            image={funeralDetails[doc].url}
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
                                                            onClick={() => openFileModal(funeralDetails[doc].url)}
                                                        />
                                                        <Button
                                                            onClick={() => openFileModal(funeralDetails[doc].url)}
                                                            variant="contained"
                                                            sx={{ mt: 1 }}
                                                            startIcon={<FullscreenIcon />}
                                                        >
                                                            View Full Image
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            mt: 1,
                                                            mb: 2,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 2,
                                                        }}
                                                    >
                                                        <iframe
                                                            src={`${funeralDetails[doc].url}#toolbar=0&navpanes=0&scrollbar=0`}
                                                            title={`${doc} Preview`}
                                                            style={{
                                                                width: '100%',
                                                                height: '200px',
                                                                border: '1px solid #ddd',
                                                                borderRadius: 4,
                                                            }}
                                                        />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {funeralDetails[doc]?.name || 'Document Preview'}
                                                        </Typography>
                                                        <Button
                                                            onClick={() => window.open(funeralDetails[doc].url, "_blank")}
                                                            variant="contained"
                                                            startIcon={<FullscreenIcon />}
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
                        </Paper>
                    </Box>

                    {/* Right Column */}
                    <Box
                        ref={adminRef}
                        sx={{
                            flex: 1,
                            width: '800px',
                            padding: 2,
                            backgroundColor: 'white',
                        }}
                    >
                        {/* Admin Comments Section */}
                        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Admin Comments
                            </Typography>
                            {comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                                        <Typography><strong>Comment:</strong> {comment?.selectedComment || "N/A"}</Typography>
                                        {comment?.additionalComment && (
                                            <Typography><strong>Details:</strong> {comment.additionalComment}</Typography>
                                        )}
                                    </Box>
                                ))
                            ) : (
                                <Typography>No admin comments yet.</Typography>
                            )}
                        </Paper>

                        {/* Updated Funeral Date Section */}
                        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Updated Funeral Date
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                {updatedFuneralDate ? new Date(updatedFuneralDate).toLocaleDateString() : "N/A"}
                            </Typography>
                            {funeralDetails?.adminRescheduled?.reason && (
                                <>
                                    <Typography variant="subtitle2">Reason for Rescheduling:</Typography>
                                    <Typography>{funeralDetails.adminRescheduled.reason}</Typography>
                                </>
                            )}
                        </Paper>
                        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Priest Assigned
                            </Typography>
                            {funeralDetails?.Priest ? (
                                <Typography>
                                    {funeralDetails.Priest.fullName}
                                </Typography>
                            ) : (
                                <Typography>No priest assigned yet.</Typography>
                            )}
                        </Paper>

                        {/* Additional Notes Section */}
                        {/* <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Additional Notes
                            </Typography>
                            {funeralDetails?.adminNotes?.length > 0 ? (
                                funeralDetails.adminNotes.map((note, index) => {
                                    const priestInfo = priestsList.find(p => p._id === note.priest);
                                    const priestName = priestInfo ? `${priestInfo.title} ${priestInfo.fullName}` : "Unknown Priest";

                                    return (
                                        <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                                            <Typography><strong>Priest:</strong> {priestName}</Typography>
                                            {note.recordedBy && <Typography><strong>Recorded By:</strong> {note.recordedBy}</Typography>}
                                            {note.bookNumber && <Typography><strong>Book Number:</strong> {note.bookNumber}</Typography>}
                                            {note.pageNumber && <Typography><strong>Page Number:</strong> {note.pageNumber}</Typography>}
                                            {note.lineNumber && <Typography><strong>Line Number:</strong> {note.lineNumber}</Typography>}
                                        </Box>
                                    );
                                })
                            ) : (
                                <Typography>No additional notes available.</Typography>
                            )}
                        </Paper> */}

                        {/* Admin Actions Section */}
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Admin Actions
                            </Typography>

                            {/* Update Funeral Date */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Update Funeral Date</Typography>
                                <TextField
                                    type="date"
                                    fullWidth
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    sx={{ mb: 2 }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Reason for Update"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleUpdate}
                                    fullWidth
                                    disabled={!newDate || !reason}
                                >
                                    Update Funeral Date
                                </Button>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Select Priest</InputLabel>
                                    <Select
                                        value={selectedPriestId}
                                        onChange={(e) => setSelectedPriestId(e.target.value)}
                                        label="Select Priest"
                                    >
                                        {priestsList.map((priest) => (
                                            <MenuItem key={priest._id} value={priest._id}>
                                                {priest.title} {priest.fullName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Button
                                    variant="contained"
                                    onClick={handlePriestAdd}
                                    fullWidth
                                    disabled={!selectedPriestId}
                                >
                                    Add Priest
                                </Button>
                            </Box>
                            {/* Add Additional Notes */}
                            {/* <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Add Additional Notes</Typography>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Select Priest</InputLabel>
                                    <Select
                                        value={selectedPriestId}
                                        onChange={(e) => setSelectedPriestId(e.target.value)}
                                        label="Select Priest"
                                    >
                                        {priestsList.map((priest) => (
                                            <MenuItem key={priest._id} value={priest._id}>
                                                {priest.title} {priest.fullName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Recorded By"
                                    fullWidth
                                    value={recordedBy}
                                    onChange={(e) => setRecordedBy(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Book Number"
                                    fullWidth
                                    value={bookNumber}
                                    onChange={(e) => setBookNumber(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Page Number"
                                    fullWidth
                                    value={pageNumber}
                                    onChange={(e) => setPageNumber(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Line Number"
                                    fullWidth
                                    value={lineNumber}
                                    onChange={(e) => setLineNumber(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAdminNotes}
                                    fullWidth
                                    disabled={!selectedPriestId}
                                >
                                    Add Notes
                                </Button>
                            </Box> */}

                            {/* Add Comment */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Add Comment</Typography>
                                <FormControl fullWidth sx={{ mb: 2 }}>
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
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={additionalComment}
                                    onChange={(e) => setAdditionalComment(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleSubmitComment}
                                    fullWidth
                                    disabled={!selectedComment && !additionalComment}
                                >
                                    Submit Comment
                                </Button>
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => setShowConfirmDialog(true)}
                                    fullWidth
                                    disabled={funeralDetails?.funeralStatus === "Confirmed"}
                                >
                                    Confirm Funeral
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setShowCancelModal(true)}
                                    fullWidth
                                    disabled={funeralDetails?.funeralStatus === "Cancelled"}
                                >
                                    Cancel Funeral
                                </Button>
                            </Box>
                            <Button
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => navigate(`/adminChat/${funeralDetails?.userId?._id}/${funeralDetails?.userId?.email}`)}
                                fullWidth
                            >
                                Go to Admin Chat
                            </Button>

                            <FuneralPDFDownloadForm
                                funeralDetails={funeralDetails}
                                comments={comments}
                            />

                        </Paper>
                    </Box>
                </Box>

                {/* Confirmation Dialog */}
                <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
                    <DialogTitle>Confirm Funeral</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to confirm this funeral?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleConfirm}
                            color="success"
                            disabled={confirmLoading}
                            variant="contained"
                        >
                            {confirmLoading ? <CircularProgress size={24} /> : "Confirm"}
                        </Button>
                    </DialogActions>
                </Dialog>

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
                            maxWidth: '90vw'
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2 }}>Cancel Funeral</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>Please provide a reason for cancellation:</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Enter reason..."
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button variant="outlined" onClick={() => setShowCancelModal(false)}>Back</Button>
                            <Button variant="contained" color="error" onClick={handleCancel}>Confirm Cancel</Button>
                        </Box>
                    </Box>
                </Modal>

                {/* Image Viewer Modal */}
                <Modal open={isModalOpen} onClose={closeModal}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 2,
                            outline: 'none',
                            width: '90vw',
                            height: '90vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                            p: 1,
                            backgroundColor: 'background.default',
                            borderRadius: 1
                        }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    mb: 2,
                                }}
                            >
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
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: isDragging ? 'grabbing' : 'grab',
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                borderRadius: 1
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {selectedFile && isImageFile(selectedFile) ? (
                                <img
                                    src={selectedFile}
                                    alt="Document Preview"
                                    style={{
                                        transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        transition: isDragging ? 'none' : 'transform 0.2s ease'
                                    }}
                                    draggable="false"
                                />
                            ) : (
                                <iframe
                                    src={`${selectedFile}#toolbar=0&navpanes=0&scrollbar=0`}
                                    title="Document Preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        border: 'none'
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
};

export default FuneralDetails;