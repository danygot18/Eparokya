import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "../SideBar";
import Modal from 'react-modal';
import BaptismChecklist from "./BaptismChecklist";


Modal.setAppElement('#root');


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
    const [recordedBy, setrecordedBy] = useState("");
    const [bookNumber, setbookNumber] = useState("");
    const [pageNumber, setpageNumber] = useState("");
    const [lineNumber, setlineNumber] = useState("");

    const [newDate, setNewDate] = useState("");
    const [reason, setReason] = useState("");
    const [updatedBaptismDate, setUpdatedBaptismDate] = useState(baptismDetails?.baptismDate || "");

    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [birthCertificateImage, setbirthCertificateImage] = useState("");
    const [marriageCertificateImage, setmarriageCertificateImage] = useState("");
    const [baptismPermitImage, setbaptismPermitImage] = useState("");

    const predefinedComments = [
        "Confirmed and on schedule",
        "Rescheduled - awaiting response",
        "Pending final confirmation",
        "Cancelled by user",
    ];

    useEffect(() => {
        const fetchBaptismDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getBaptism/${baptismId}`,
                    { withCredentials: true });

                console.log("API Response:", response.data);

                setBaptismDetails(response.data);
                setSelectedDate(response.data.baptismDate || "");
                setComments(response.data.comments || []);

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
                `${process.env.REACT_APP_API}/api/v1/commentBaptism/${baptismId}`,
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
                `${process.env.REACT_APP_API}/api/v1/adminAdditionalNotes/${baptismId}`,
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
                `${process.env.REACT_APP_API}/api/v1/${baptismId}/confirmBaptism`,
                { withCredentials: true },
            );
            alert(response.data.message);
            navigate("/admin/baptismList");
        } catch (error) {
            console.error("Error confirming baptism:", error.response || error);
            alert("Failed to confirm the baptism.");
        }
    };

    const handleDecline = async () => {
        const token = localStorage.getItem("jwt");
        try {
            await axios.post(`${process.env.REACT_APP_API}/api/v1/${baptismId}/declineBaptism`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Baptism declined.");
            navigate("/admin/baptismList");
        } catch (error) {
            alert("Failed to decline the baptism.");
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
            <div className="baptism-details">
                <h2>Baptism Details</h2>
                <div>
                    <p>User: {baptismDetails?.userId?.name || "N/A"}</p>

                    <p>
                        Baptism Date:{" "}
                        {baptismDetails?.baptismDate
                            ? new Date(baptismDetails.baptismDate).toLocaleDateString()
                            : "N/A"}
                    </p>
                    <p>Baptism Time: {baptismDetails?.baptismTime || "N/A"}</p>
                    <p>Contact Number: {baptismDetails?.phone || "N/A"}</p>

                    <p>Child Name: {baptismDetails?.child?.fullName || "N/A"}</p>
                    <p>
                        Birthdate:{" "}
                        {baptismDetails?.child?.dateOfBirth
                            ? new Date(baptismDetails.child.dateOfBirth).toLocaleDateString()
                            : "N/A"}
                    </p>
                    <p>Sex: {baptismDetails?.child?.gender || "N/A"}</p>

                    <p>Father: {baptismDetails?.parents?.fatherFullName || "N/A"}</p>
                    <p>Father's Place of Birth: {baptismDetails?.parents?.placeOfFathersBirth || "N/A"}</p>

                    <p>Mother: {baptismDetails?.parents?.motherFullName || "N/A"}</p>
                    <p>Mother's Place of Birth: {baptismDetails?.parents?.placeOfMothersBirth || "N/A"}</p>


                    <p>Address: {baptismDetails?.parents?.address || "N/A"}</p>
                    <p>Marriage Status: {baptismDetails?.parents?.marriageStatus || "N/A"}</p>

                    <p>Primary Ninong: {baptismDetails?.ninong?.name || "N/A"}</p>
                    <p>Primary Ninong Address: {baptismDetails?.ninong?.address || "N/A"}</p>
                    <p>Primary Ninong Religion: {baptismDetails?.ninong?.religion || "N/A"}</p>

                    <p>Primary Ninang: {baptismDetails?.ninang?.name || "N/A"}</p>
                    <p>Primary Ninang Address: {baptismDetails?.ninang?.address || "N/A"}</p>
                    <p>Primary Ninang Religion: {baptismDetails?.ninang?.religion || "N/A"}</p>

                    <p>
                        Ninong:{" "}
                        {baptismDetails?.NinongGodparents?.map((gp) => gp.name).join(", ") || "N/A"}
                    </p>
                    <p>
                        Ninang:{" "}
                        {baptismDetails?.NinangGodparents?.map((gp) => gp.name).join(", ") || "N/A"}
                    </p>

                    <div className="details-box">
                        <h3>Baptismal Documents</h3>
                        {['birthCertificate', 'marriageCertificate'].map((doc, index) => (
                            <div key={index} className="grid-row">
                                <p>{doc.replace(/([A-Z])/g, ' $1').trim()}:</p>
                                {baptismDetails?.Docs?.[doc]?.url ? (
                                    <img
                                        src={baptismDetails.Docs[doc].url}
                                        alt={doc}
                                        style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", cursor: "pointer" }}
                                        onClick={() => openModal(baptismDetails.Docs[doc].url)}
                                    />
                                ) : (
                                    "N/A"
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Modal with Zoom and Drag Functionality */}
                    <Modal
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
                    </Modal>



                </div>

                {/* Display Updated Date  */}
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

                <div className="button-container">
                    <button onClick={handleConfirm}>Confirm</button>
                    <button onClick={handleDecline}>Decline</button>
                </div>

            </div>
            <div className="wedding-checklist-container">
                <BaptismChecklist baptismId={baptismId} />

            </div>
            <div className="button-container">
                <button onClick={() => navigate(`/adminChat/${baptismDetails?.userId?._id}/${baptismDetails?.userId?.email}`)}>
                    Go to Admin Chat
                </button>
            </div>
        </div>
    );
};

export default BaptismDetails;
