import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "../SideBar";

import MassBaptismDetails from "../Baptism/BaptismChecklist";
import { toast, ToastContainer } from 'react-toastify';
import "../Baptism/baptism.css";
import { Card, CardContent, Typography, Divider, Box, Button, Modal } from "@mui/material";

const BaptismDetails = () => {
    const { massBaptismId } = useParams();
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

    const predefinedComments = [
        "Confirmed and on schedule",
        "Rescheduled - awaiting response",
        "Pending final confirmation",
        "Cancelled by user",
    ];

    useEffect(() => {
        const fetchBaptismDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getMassBaptismForm/${massBaptismId}`,
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

        fetchBaptismDetails();

    }, []);


    const openModal = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedImage("");
        setIsModalOpen(false);
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
                `${process.env.REACT_APP_API}/api/v1/commentBaptism/${massBaptismId}`,
                newComment,
            );
            setComments([...comments, response.data]);
            setSelectedComment("");
            setAdditionalComment("");
            alert("Comment submitted.");
        } catch (error) {
            console.error("Error submitting comment:", error.response || error);
            alert("Failed to submit the comment.");
        }
    };

    const handleAdminNotes = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwt");

        const newAdminNote = {
            priest,
            recordedBy,
            bookNumber,
            pageNumber,
            lineNumber,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/adminAdditionalNotes/${massBaptismId}`,
                newAdminNote
            );

            // Added
            setAdminNotes(prevNotes => [...prevNotes, response.data]);

            setPriest("");
            setrecordedBy("");
            setbookNumber("");
            setpageNumber("");
            setlineNumber("");

            alert("Additional notes submitted.");
        } catch (error) {
            console.error("Error submitting additional notes:", error.response || error);
            alert("Failed to submit the additional notes.");
        }
    };


    const handleConfirm = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/${massBaptismId}/confirmBaptism`,
                { withCredentials: true },
            );
            alert(response.data.message);
            navigate("/admin/baptismList");
        } catch (error) {
            console.error("Error confirming baptism:", error.response || error);
            alert("Failed to confirm the baptism.");
        }
    };

    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a cancellation reason.", { position: toast.POSITION.TOP_RIGHT });
            return;
        }
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/declineBaptism/${massBaptismId}`,
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
            alert("Please select a date and provide a reason.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/${baptismDetails._id}/updateBaptismDate`,
                { newDate, reason }
            );

            setUpdatedBaptismDate(response.data.baptism.baptsimDate);
            alert("Baptism date updated successfully!");
        } catch (error) {
            console.error("Error updating baptism date:", error);
            alert("Failed to update baptism date.");
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
                                <Typography><strong>Baptism Time:</strong> {baptismDetails?.baptismTime || "N/A"}</Typography>
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
                <Card sx={{ maxWidth: 600, margin: "auto", padding: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Baptism Details
                        </Typography>
                        <Divider sx={{ marginBottom: 2 }} />
                        <Box>
                            <Typography variant="h6" mt={2}>Baptismal Documents</Typography>
                            <Divider sx={{ marginBottom: 2 }} />
                            {['birthCertificate', 'marriageCertificate'].map((doc, index) => (
                                <Box key={index} sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                                    <Typography sx={{ flex: 1 }}><strong>{doc.replace(/([A-Z])/g, ' $1').trim()}:</strong></Typography>
                                    {baptismDetails?.Docs?.[doc]?.url ? (
                                        <img
                                            src={baptismDetails.Docs[doc].url}
                                            alt={doc}
                                            style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", cursor: "pointer", borderRadius: 8, boxShadow: 1 }}
                                            onClick={() => openModal(baptismDetails.Docs[doc].url)}
                                        />
                                    ) : (
                                        <Typography>N/A</Typography>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
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
                                <Button onClick={closeModal} variant="contained" sx={{ mx: 1 }} size="small">
                                    Close
                                </Button>
                                <Box>
                                    <Button onClick={handleZoomIn} variant="outlined" sx={{ mx: 1 }}>
                                        Zoom In
                                    </Button>
                                    <Button onClick={handleZoomOut} variant="outlined" sx={{ mx: 1 }}>
                                        Zoom Out
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
                </Card>

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
                        baptismDetails.adminNotes.map((note, index) => (
                            <div key={index} className="admin-comment">
                                {note.priest && (
                                    <p><strong>Priest:</strong> {note.priest}</p>
                                )}
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
                        ))
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
                    <textarea
                        placeholder="Priest Name"
                        value={priest}
                        onChange={(e) => setPriest(e.target.value)}
                    />

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
                    <button onClick={() => setShowCancelModal(true)}>Cancel Baptism</button>
                </div>

                {/* Cancellation Modal */}
                {showCancelModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Cancel Baptism</h3>
                            <p>Please provide a reason for cancellation:</p>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Enter reason..."
                                className="modal-textarea"
                            />
                            <div className="modal-buttons">
                                <button onClick={handleCancel}>Confirm Cancel</button>
                                <button onClick={() => setShowCancelModal(false)}>Back</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="button-container">
                    <button onClick={handleConfirm}>Confirm</button>
                </div>
            </div>
            <div className="wedding-checklist-container">
                <MassBaptismDetails massBaptismId={massBaptismId} />
                <button onClick={() => navigate(`/adminChat/${baptismDetails?.userId?._id}/${baptismDetails?.userId?.email}`)}>
                    Go to Admin Chat
                </button>
            </div>

        </div>
    );
};

export default MassBaptismDetails;
