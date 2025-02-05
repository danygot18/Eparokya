import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import "../../../../Layout/styles/style.css";
import GuestSideBar from "../../../../GuestSideBar";
import { useParams } from "react-router-dom";
import UserBaptismChecklist from "./UserBaptismChecklist";

Modal.setAppElement('#root');

const MySubmittedBaptismForm = () => {
    const navigate = useNavigate();
    const { baptismId } = useParams();
    const [baptismDetails, setBaptismDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const [comments, setComments] = useState([]);
    const [updatedBaptismDate, setUpdatedBaptismDate] = useState(baptismDetails?.baptismDate || "");
    const [adminNotes, setAdminNotes] = useState([]);
    const { formId } = useParams();

    useEffect(() => {
        const fetchBaptismDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/getBaptismForm/${formId}`,
                    { withCredentials: true }
                );
                console.log("API Response:", response.data);
    
                if (response.data) {
                    setBaptismDetails(response.data);
                    setAdminNotes(response.data.adminNotes);
                    setComments(response.data.comments || []);
    
                    if (response.data.baptismDate) {
                        setUpdatedBaptismDate(response.data.baptismDate);
                    }
                }
            } catch (err) {
                console.error("API Error:", err);
                setError("Failed to fetch baptism details.");
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
            await axios.post(`${process.env.REACT_APP_API}/api/v1/${baptismDetails._id}/declineBaptism`, null, {
                withCredentials: true,
            });
            alert("Baptism request cancelled.");
            navigate("/user/dashboard");
        } catch (error) {
            console.error("Error cancelling baptism:", error);
            alert("Failed to cancel the baptism request.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="baptism-details-page">
            <GuestSideBar />
            <div className="baptism-details">
                <h2>My Submitted Baptism Form</h2>
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
                                {baptismDetails?.docs?.[doc]?.url ? (
                                    <img
                                        src={baptismDetails.docs[doc].url}
                                        alt={doc}
                                        style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", cursor: "pointer" }}
                                        onClick={() => openModal(baptismDetails.docs[doc].url)}
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

                    <div className="admin-comments-section">
                        <h3>Admin Comments</h3>
                        {baptismDetails?.comments && Array.isArray(baptismDetails.comments) && baptismDetails.comments.length > 0 ? ( 
                            baptismDetails.comments.map((comment, index) => (
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

                    
                    {/* Display of Additional Notes */}
                    <div className="admin-comments-section">
                        <h2>Additional Notes</h2>
                        {baptismDetails?.adminNotes?.priest ? (
                            <div className="admin-comment">
                                <p>
                                    <strong>Priest:</strong> {baptismDetails.adminNotes.priest}
                                </p>
                            </div>
                        ) : (
                            <p>No priest.</p>
                        )}

                        {baptismDetails?.adminNotes?.recordedBy ? (
                            <div className="admin-comment">
                                <p>
                                    <strong>Recorded By:</strong> {baptismDetails.adminNotes.recordedBy}
                                </p>
                            </div>
                        ) : (
                            <p>No record.</p>
                        )}

                        {baptismDetails?.adminNotes?.bookNumber ? (
                            <div className="admin-comment">
                                <p>
                                    <strong>Book Number:</strong> {baptismDetails.adminNotes.bookNumber}
                                </p>
                            </div>
                        ) : (
                            <p>No book number.</p>
                        )}

                        {baptismDetails?.adminNotes?.pageNumber ? (
                            <div className="admin-comment">
                                <p>
                                    <strong>Page Number:</strong> {baptismDetails.adminNotes.pageNumber}
                                </p>
                            </div>
                        ) : (
                            <p>No page number.</p>
                        )}

                        {baptismDetails?.adminNotes?.lineNumber ? (
                            <div className="admin-comment">
                                <p>
                                    <strong>Line Number:</strong> {baptismDetails.adminNotes.lineNumber}
                                </p>
                            </div>
                        ) : (
                            <p>No line number.</p>
                        )}
                    </div>

                    {/* for Rescheduling */}
                    <div className="wedding-date-box">
                        <h3>Updated Baptism Date</h3>
                        <p className="date">
                            {baptismDetails?.updatedBaptismDate
                                ? new Date(baptismDetails.updatedBaptismDate).toLocaleDateString()
                                : "N/A"}
                        </p>

                        {baptismDetails?.adminRescheduled?.reason && (
                            <div className="reschedule-reason">
                                <h3>Reason for Rescheduling</h3>
                                <p>{baptismDetails.adminRescheduled.reason}</p>
                            </div>
                        )}
                    </div>

                    <div className="actions">
                        <button onClick={handleCancel}>Cancel Baptism Request</button>
                    </div>
                </div>
            </div>
            <div className="wedding-checklist-container">
                <UserBaptismChecklist baptismId={baptismId} />
            </div>
        </div>
    );
};

export default MySubmittedBaptismForm;