import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "../SideBar";

import BaptismChecklist from "./BaptismChecklist";
import { toast, ToastContainer } from 'react-toastify';
import "./baptism.css";
import {
    Card,
    CardContent,
    Typography,
    Box,
    CardMedia,
    Grid2,
    Modal,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Divider
} from "@mui/material";
import { format } from "date-fns";




const BaptismDetails = () => {
    const { baptismId } = useParams();
    const navigate = useNavigate();
    const [baptismDetails, setBaptismDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedComment, setSelectedComment] = useState("");
    const [additionalComment, setAdditionalComment] = useState("");
    const [comments, setComments] = useState([]);
    const [adminNotes, setAdminNotes] = useState([]);
    const [priest, setPriest] = useState("");

    const [priestsList, setPriestsList] = useState([]);
    const [selectedPriestId, setSelectedPriestId] = useState("");

    const [recordedBy, setrecordedBy] = useState("");
    const [bookNumber, setbookNumber] = useState("");
    const [pageNumber, setpageNumber] = useState("");
    const [lineNumber, setlineNumber] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [birthCertificateImage, setbirthCertificateImage] = useState("");
    const [marriageCertificateImage, setmarriageCertificateImage] = useState("");
    const [baptismPermitImage, setbaptismPermitImage] = useState("");

    const [newDate, setNewDate] = useState("");
    const [reason, setReason] = useState("");
    const [updatedBaptismDate, setUpdatedBaptismDate] = useState(baptismDetails?.baptismDate || "");

    const [zoom, setZoom] = useState(1);
    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 1));
    const [offset, setOffset] = useState({ x: 0, y: 0 });


    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const predefinedComments = [
        "Confirmed and on schedule",
        "Rescheduled - awaiting response",
        "Pending final confirmation",
        "Cancelled by user",
    ];

    const [priests, setPriests] = useState([]);
    const [formData, setFormData] = useState({
        priest: '',
        recordedBy: '',
        bookNumber: '',
        pageNumber: '',
        lineNumber: ''
    });

    useEffect(() => {
        const fetchPriests = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllPriest`);
                setPriests(response.data);
                console.log("Fetched priests:", response.data);
            } catch (error) {
                console.error('Error fetching priests:', error);
            }
        };
        fetchPriests();
    }, []);


    useEffect(() => {
        const fetchBaptismDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getBaptism/${baptismId}`,
                    { withCredentials: true });

                console.log("API Response:", response.data);

                setBaptismDetails(response.data);
                setSelectedDate(response.data.baptismDate || "");
                setComments(response.data.comments || []);
                // setSelectedPriestId(response.data.counseling?.priest?._id || "");

                setUpdatedBaptismDate(response.data.baptismDate || " ");
                setbirthCertificateImage(response.data.birthCertificate || "");
                setmarriageCertificateImage(response.data.marriageCertificate || "");
                setbaptismPermitImage(response.data.baptismPermit || "");

            } catch (err) {
                console.error(err);
                setError("Failed to fetch baptism details");
            } finally {
                setLoading(false);
            }
        };

        // const fetchPriests = async () => {
        //     try {
        //         const response = await axios.get(
        //             `${process.env.REACT_APP_API}/api/v1/getAvailablePriest`,
        //             { withCredentials: true }
        //         );
        //         const fetchedPriests = response.data.priests;
        //         const formattedPriests = Array.isArray(fetchedPriests) ? fetchedPriests : [fetchedPriests];
        //         setPriestsList(formattedPriests);
        //         if (formattedPriests.length > 0) {
        //             setSelectedPriestId(formattedPriests[0]._id);
        //         }
        //     } catch (err) {
        //         console.error("Failed to fetch priests:", err);
        //         setPriestsList([]);
        //     }
        // };

        fetchBaptismDetails();
        // fetchPriests();

    }, []);


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

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwt");
        const newComment = {
            selectedComment,
            additionalComment,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/commentBaptism/${baptismId}`,
                newComment,
            );
            setComments([...comments, response.data]);
            setSelectedComment("");
            setAdditionalComment("");
            toast.success("Comment submitted.");
        } catch (error) {
            console.error("Error submitting comment:", error.response || error);
            toast.error("Failed to submit the comment.");
        }
    };

    const handleAdminNotes = async (e) => {
        e.preventDefault();

        if (!priest) {
            toast.error("Please select a priest.");
            return;
        }

        const newAdminNote = {
            priest,
            recordedBy,
            bookNumber,
            pageNumber,
            lineNumber,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/adminAdditionalNotes/${baptismId}`,
                newAdminNote
            );

            setAdminNotes(prevNotes => [...prevNotes, response.data]);

            // Reset fields
            setPriest("");
            setrecordedBy("");
            setbookNumber("");
            setpageNumber("");
            setlineNumber("");

            toast.success("Additional notes submitted.");
        } catch (error) {
            console.error("Error submitting additional notes:", error.response || error);
            toast.error("Failed to submit the additional notes.");
        }
    };

    const handleConfirm = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/${baptismId}/confirmBaptism`,
                { withCredentials: true },
            );
            toast.success("Baptism confirmed successfully!", { position: toast.POSITION.TOP_RIGHT });
            navigate("/admin/baptismList");
        } catch (error) {
            console.error("Error confirming baptism:", error.response || error);
            toast.error("Failed to confirm the baptism.");
        }
    };

    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a cancellation reason.", { position: toast.POSITION.TOP_RIGHT });
            return;
        }
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/declineBaptism/${baptismId}`,
                { reason: cancelReason },
                { withCredentials: true }
            );


            toast.success("Baptism cancelled successfully!", { position: toast.POSITION.TOP_RIGHT });
            setShowCancelModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel the baptism.", {
                position: toast.POSITION.TOP_RIGHT,
            });
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
                `${process.env.REACT_APP_API}/api/v1/${baptismDetails._id}/updateBaptismDate`,
                { newDate, reason }
            );

            setUpdatedBaptismDate(response.data.baptism.baptismDate);
            toast.success("Baptism date updated successfully!");
        } catch (error) {
            console.error("Error updating baptism date:", error);
            toast.error("Failed to update baptism date.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="baptism-details-page">
            <SideBar />
            <div className="baptism-details-box">
                <h2>Baptism Details</h2>

                <CardContent>

                    {/* <Divider sx={{ marginBottom: 2 }} /> */}
                    <Box >
                        <Card sx={{ flex: 1, marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h6" mt={2}>
                                    User Details
                                </Typography>
                                <Typography><strong>User:</strong> {baptismDetails?.userId?.name || "N/A"}</Typography>
                                <Typography><strong>Baptism Date:</strong> {baptismDetails?.baptismDate ? new Date(baptismDetails.baptismDate).toLocaleDateString() : "N/A"}</Typography>
                                <Typography>
                                    <strong>Baptism Time:</strong>{" "}
                                    {baptismDetails?.baptismTime ? (() => {
                                        try {
                                            const rawTime = baptismDetails.baptismTime;

                                            // If it's just a time string like "12:41", create a full date with today's date
                                            let date;
                                            if (/^\d{1,2}:\d{2}$/.test(rawTime)) {
                                                const today = new Date();
                                                const [hours, minutes] = rawTime.split(':');
                                                date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), +hours, +minutes);
                                            } else {
                                                date = new Date(rawTime);
                                            }

                                            if (isNaN(date.getTime())) {
                                                console.warn("Invalid weddingTime:", rawTime);
                                                return "N/A";
                                            }

                                            return format(date, 'h:mm a'); // e.g. "1:08 AM"
                                        } catch (e) {
                                            console.error("Error parsing baptismTime:", baptismDetails.baptismTime, e);
                                            return "N/A";
                                        }
                                    })() : "N/A"}
                                </Typography>
                                <Typography><strong>Contact Number:</strong> {baptismDetails?.phone || "N/A"}</Typography>
                            </CardContent>

                        </Card>
                        <Card sx={{ flex: 1, marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h6" mt={2}>Child Details</Typography>
                                <Typography><strong>Name:</strong> {baptismDetails?.child?.fullName || "N/A"}</Typography>
                                <Typography><strong>Birthdate:</strong> {baptismDetails?.child?.dateOfBirth ? new Date(baptismDetails.child.dateOfBirth).toLocaleDateString() : "N/A"}</Typography>
                                <Typography><strong>Sex:</strong> {baptismDetails?.child?.gender || "N/A"}</Typography>
                            </CardContent>
                        </Card>

                    </Box>
                    <Box>
                        <Card sx={{ flex: 1, marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h6" mt={2}>Parents</Typography>
                                <Typography><strong>Father:</strong> {baptismDetails?.parents?.fatherFullName || "N/A"}</Typography>
                                <Typography><strong>Father's Place of Birth:</strong> {baptismDetails?.parents?.placeOfFathersBirth || "N/A"}</Typography>
                                <Typography><strong>Mother:</strong> {baptismDetails?.parents?.motherFullName || "N/A"}</Typography>
                                <Typography><strong>Mother's Place of Birth:</strong> {baptismDetails?.parents?.placeOfMothersBirth || "N/A"}</Typography>
                                <Typography><strong>Address:</strong> {baptismDetails?.parents?.address || "N/A"}</Typography>
                                <Typography><strong>Marriage Status:</strong> {baptismDetails?.parents?.marriageStatus || "N/A"}</Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ flex: 1, marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h6" mt={2}>Primary Sponsors</Typography>
                                <Typography><strong>Primary Ninong:</strong> {baptismDetails?.ninong?.name || "N/A"}</Typography>
                                <Typography><strong>Primary Ninong Address:</strong> {baptismDetails?.ninong?.address || "N/A"}</Typography>
                                <Typography><strong>Primary Ninong Religion:</strong> {baptismDetails?.ninong?.religion || "N/A"}</Typography>
                                <Typography><strong>Primary Ninang:</strong> {baptismDetails?.ninang?.name || "N/A"}</Typography>
                                <Typography><strong>Primary Ninang Address:</strong> {baptismDetails?.ninang?.address || "N/A"}</Typography>
                                <Typography><strong>Primary Ninang Religion:</strong> {baptismDetails?.ninang?.religion || "N/A"}</Typography>
                                <Typography><strong>Additional Ninongs:</strong> {baptismDetails?.NinongGodparents?.map((gp) => gp.name).join(", ") || "N/A"}</Typography>
                                <Typography><strong>Additional Ninangs:</strong> {baptismDetails?.NinangGodparents?.map((gp) => gp.name).join(", ") || "N/A"}</Typography>
                            </CardContent>
                        </Card>
                    </Box>

                </CardContent>
                <Divider sx={{ marginBottom: 2 }} />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {['birthCertificate', 'marriageCertificate'].map((doc, index) => (
                        <Card key={index} sx={{ flex: "1 1 300px", maxWidth: "400px" }}>
                            <CardContent>
                                <Typography variant="body1" fontWeight="bold">
                                    {doc.replace(/([A-Z])/g, " $1").trim()}:
                                </Typography>

                                {baptismDetails?.Docs?.[doc]?.url ? (
                                    /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(baptismDetails.Docs[doc].url) ? (
                                        <>
                                            <Box
                                                component="img"
                                                src={baptismDetails.Docs[doc].url}
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
                                                onClick={() => openModal(baptismDetails.Docs[doc].url)}
                                            />
                                            <Button
                                                onClick={() => openModal(baptismDetails.Docs[doc].url)}
                                                variant="contained"
                                                sx={{ mt: 1, backgroundColor: "#d5edd9", color: "black" }}
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
                                                src={`${baptismDetails.Docs[doc].url}#toolbar=0&navpanes=0&scrollbar=0`}
                                                title={`${doc} Preview`}
                                                style={{
                                                    width: '100%',
                                                    height: '200px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: 4,
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {baptismDetails.Docs[doc]?.name || 'Document Preview'}
                                            </Typography>
                                            <Button
                                                onClick={() => window.open(baptismDetails.Docs[doc].url, "_blank")}
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
                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 2 }}>


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
                            {/* Show image or PDF/other file */}
                            {/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(selectedImage) ? (
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
                            ) : (
                                <iframe
                                    src={`${selectedImage}#toolbar=0&navpanes=0&scrollbar=0`}
                                    title="Document Preview"
                                    style={{
                                        width: "80vw",
                                        height: "70vh",
                                        border: "none",
                                        borderRadius: 8,
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Modal>

                {/* Display Updated Date  */}


            </div>
            <div className="baptism-details-box">
                <div className="wedding-date-box">
                    <h3>Updated Baptism Date</h3>
                    <p className="date">
                        {updatedBaptismDate ? new Date(updatedBaptismDate).toLocaleDateString() : "N/A"}
                    </p>

                    {baptismDetails?.adminRescheduled?.reason && (
                        <div className="reschedule-reason">
                            <h3>Reason for Rescheduling</h3>
                            <p>{baptismDetails.adminRescheduled.reason}</p>
                        </div>
                    )}
                </div>

                {/* Admin Comments Section */}
                <div className="house-comments-section">
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
                </div>

                {/* Display of Additional Notes */}
                <div className="admin-comments-section">
                    <h2>Additional Notes</h2>
                    {baptismDetails?.adminNotes?.length > 0 ? (
                        baptismDetails.adminNotes.map((note, index) => {
                            const priestInfo = priests.find(p => p._id === note.priest);
                            const priestName = priestInfo ? `${priestInfo.title} ${priestInfo.fullName}` : "Unknown Priest";

                            return (
                                <div key={index} className="admin-comment">
                                    <p><strong>Priest:</strong> {priestName}</p>
                                    {note.recordedBy && (
                                        <p><strong>Recorded By:</strong> {note.recordedBy}</p>
                                    )}
                                    {note.bookNumber && (
                                        <p><strong>Book Number:</strong> {note.bookNumber}</p>
                                    )}
                                    {note.pageNumber && (
                                        <p><strong>Page Number:</strong> {note.pageNumber}</p>
                                    )}
                                    {note.lineNumber && (
                                        <p><strong>Line Number:</strong> {note.lineNumber}</p>
                                    )}
                                    <hr />
                                </div>
                            );
                        })
                    ) : (
                        <p>No additional notes available.</p>
                    )}
                </div>


                {/* Creating Comments */}
                <form onSubmit={handleSubmitComment}>
                    <h3>Add Comment</h3>
                    <label>
                        Predefined Comment:
                        <select
                            value={selectedComment}
                            onChange={(e) => setSelectedComment(e.target.value)}
                        >
                            <option value="">Select a comment</option>
                            {predefinedComments.map((comment, index) => (
                                <option key={index} value={comment}>
                                    {comment}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Additional Comment:
                        <textarea
                            value={additionalComment}
                            onChange={(e) => setAdditionalComment(e.target.value)}
                        />
                    </label>
                    <button type="submit">Submit Comment</button>
                </form>

                {/*  Updated Date Create  */}
                <div className="admin-section">
                    <h2>Select Updated Baptism Date:</h2>
                    <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                    <label>Reason:</label>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>
                <div className="button-container">
                    <button onClick={handleUpdate} disabled={loading}>
                        {loading ? "Updating..." : "Update Baptism Date"}
                    </button>
                </div>

                {/* Adding of additional notes */}
                <div className="admin-section">
                    <h4>Priest Name</h4>
                    <select value={priest} onChange={(e) => setPriest(e.target.value)} required>
                        <option value="">Select a priest</option>
                        {priests.map(p => (
                            <option key={p._id} value={p._id}>
                                {p.fullName}
                            </option>
                        ))}
                    </select>


                    <h4>Recored By</h4>
                    <textarea
                        placeholder="Recorded By"
                        value={recordedBy}
                        onChange={(e) => setrecordedBy(e.target.value)}
                    />

                    <h4>Book Number</h4>
                    <textarea
                        placeholder="Book Number"
                        value={bookNumber}
                        onChange={(e) => setbookNumber(e.target.value)}
                    />

                    <h4>Page Number</h4>
                    <textarea
                        placeholder="Page Number"
                        value={pageNumber}
                        onChange={(e) => setpageNumber(e.target.value)}
                    />

                    <h4>Line Number</h4>
                    <textarea
                        placeholder="Line Number"
                        value={lineNumber}
                        onChange={(e) => setlineNumber(e.target.value)}
                    />
                    <div className="button-container">
                        <button onClick={handleAdminNotes}>Add Notes</button>
                    </div>
                </div>

                {/* Cancelling Reason Section */}



            </div>
            <div className="wedding-checklist-container">
                <BaptismChecklist baptismId={baptismId} />
                <button onClick={() => navigate(`/adminChat/${baptismDetails?.userId?._id}/${baptismDetails?.userId?.email}`)}>
                    Go to Admin Chat
                </button>

                <button
                    disabled={baptismDetails?.binyagStatus === "Cancelled" || baptismDetails?.binyagStatus === "Confirmed"}
                    onClick={() => setShowConfirmDialog(true)}
                    style={{
                        backgroundColor: baptismDetails?.binyagStatus === "Confirmed" ? "#bdbdbd" : "#1976d2",
                        color: "#fff",
                        cursor: baptismDetails?.binyagStatus === "Confirmed" ? "not-allowed" : "pointer",
                        border: "none",
                        padding: "10px 24px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginTop: "10px"
                    }}
                    
                >
                    {baptismDetails?.binyagStatus === "Confirmed" ? "Confirmed Baptism" : "Confirm Baptism"}
                </button>
                {baptismDetails?.binyagStatus === "Cancelled" && baptismDetails?.cancellingReason ? (
                    <div className="house-comments-section">
                        <h2>Cancellation Details</h2>
                        <div className="admin-comment">
                            <p><strong>Cancelled By:</strong> {baptismDetails.cancellingReason.user === "Admin" ? "Admin" : baptismDetails.cancellingReason.user}</p>
                            <p><strong>Reason:</strong> {baptismDetails.cancellingReason.reason || "No reason provided."}</p>
                        </div>
                    </div>
                ) : null}

                {/* Cancel Button */}
                <div className="button-container">
                    <button
                        onClick={() => setShowCancelModal(true)}
                        disabled={baptismDetails?.binyagStatus === "Cancelled" || baptismDetails?.binyagStatus === "Confirmed"}
                        style={{
                            backgroundColor: baptismDetails?.binyagStatus === "Cancelled" ? "#bdbdbd" : "#d32f2f",
                            color: "#fff",
                            cursor: baptismDetails?.binyagStatus === "Cancelled" ? "not-allowed" : "pointer",
                            border: "none",
                            padding: "10px 24px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            fontSize: "16px",
                            marginTop: "10px"
                        }}
                    >
                        Cancel Baptism
                    </button>
                </div>
                <Dialog open={showCancelModal} onClose={() => setShowCancelModal(false)} size="md">
                    <DialogTitle>Cancel Baptism</DialogTitle>
                    <DialogContent>
                        <Typography>Please provide a reason for cancellation:</Typography>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Enter reason..."
                            className="modal-textarea"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancel} color="primary" variant="outlined" disabled={!cancelReason.trim()}>
                            Confirm
                        </Button>
                        <Button onClick={() => setShowCancelModal(false)} color="error" variant="outlined">
                            Back
                        </Button>
                    </DialogActions>

                </Dialog>
                <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
                    <DialogTitle>Confirm Baptism</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to accept this?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowConfirmDialog(false)} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleConfirm(baptismId)}
                            color="success"
                            disabled={confirmLoading}
                            variant="contained"
                        >
                            {confirmLoading ? <CircularProgress size={24} /> : "Yes, Confirm"}
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>

        </div>
    );
};

export default BaptismDetails;
