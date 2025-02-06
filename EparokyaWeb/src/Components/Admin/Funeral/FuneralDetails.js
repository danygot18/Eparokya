import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import "../../Layout/styles/style.css";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';
import { toast, ToastContainer } from 'react-toastify';
// import { useFocusEffect } from '@react-navigation/native';

Modal.setAppElement("#root");

const FuneralDetails = () => {
    const { funeralId } = useParams();
    const [funeralDetails, setFuneralDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [priest, setPriest] = useState("");
    const [selectedComment, setSelectedComment] = useState("");
    const [additionalComment, setAdditionalComment] = useState("");
    const [comments, setComments] = useState([]);

    const [newDate, setNewDate] = useState("");
    const [reason, setReason] = useState("");
    const [updatedFuneralDate, setUpdatedFuneralDate] = useState(funeralDetails?.funeralDate || "");

    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [deathCertificateImage, setDeathCertificateImage] = useState("");


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
                setPriest(response.data.priest);
                setDeathCertificateImage(response.data.deathCertificate || "");
                
                setUpdatedFuneralDate(response.data.funeralDate || ""); 
            } catch (err) {
                console.error("API Error:", err);
                setError("Failed to fetch funeral details.");
            } finally {
                setLoading(false);
            }
        };
        fetchFuneralDetails();
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

    const handleDecline = async (funeralId, token) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/declineFuneral/${funeralId}`,
                { withCredentials: true },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // console.log("Declining response:", response.data);
            toast.success("Funeral declined successfully!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Error decline funeral:", error.response || error.message);
            toast.error(
                error.response?.data?.message || "Failed to decline the funeral.",
                {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                }
            );
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
        if (!priest) {
            alert("Please enter priest name.");
            return;
        }
        const commentData = {
            name: priest || "",

        };
        // console.log("Sending comment:", commentData); 
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API}/api/v1/addPriest/${funeralId}`,
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
                throw new Error(data.message || "Failed to submit priest.");
            }
            alert("Priest submitted successfully!");
        } catch (error) {
            console.error("Error submitting priest:", error);
            alert("Failed to submit priest comment.");
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="wedding-details-page">
            <SideBar />
            <div className="house-details-content">
                
                <div className="house-details-grid">
                    {/* Funeral Details Box */}
                    <div className="house-details-box">
                        <h3>Funeral Details</h3>
                        <div className="house-details-item">
                            <p><strong>Name:</strong> {funeralDetails?.name || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Age:</strong> {funeralDetails?.age || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Contact Person:</strong> {funeralDetails?.contactPerson || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Relationship:</strong> {funeralDetails?.relationship || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Phone:</strong> {funeralDetails?.phone || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Address:</strong> {funeralDetails?.address?.state || "N/A"}, {funeralDetails?.address?.country || "N/A"}, {funeralDetails?.address?.zip || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Place of Death:</strong> {funeralDetails?.placeOfDeath || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Funeral Date:</strong> {funeralDetails?.funeralDate ? new Date(funeralDetails.funeralDate).toLocaleDateString() : "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Time:</strong> {funeralDetails?.funeraltime || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Service Type:</strong> {funeralDetails?.serviceType || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Priest Visit:</strong> {funeralDetails?.priestVisit || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Reason of Death:</strong> {funeralDetails?.reasonOfDeath || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Funeral Mass Date:</strong> {funeralDetails?.funeralMassDate ? new Date(funeralDetails.funeralMassDate).toLocaleDateString() : "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Funeral Mass Time:</strong> {funeralDetails?.funeralMasstime || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Funeral Mass:</strong> {funeralDetails?.funeralMass || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Funeral Status:</strong> {funeralDetails?.funeralStatus || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Confirmed At:</strong> {funeralDetails?.confirmedAt ? new Date(funeralDetails.confirmedAt).toLocaleDateString() : "N/A"}</p>
                        </div>
                        {funeralDetails?.placingOfPall?.by && (
                            <div className="house-details-item">
                                <p><strong>Placing of Pall by:</strong> {funeralDetails.placingOfPall.by}</p>
                            </div>
                        )}
                        {funeralDetails?.placingOfPall?.familyMembers?.length > 0 && (
                            <div className="house-details-item">
                                <p><strong>Family Members Placing Pall:</strong> {funeralDetails.placingOfPall.familyMembers.join(", ")}</p>
                            </div>
                        )}
                    </div>
    
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
                        {funeralDetails?.Priest?.name ? (
                            <div className="admin-comment">
                                <p><strong>Priest:</strong> {funeralDetails.Priest.name}</p>
                            </div>
                        ) : (
                            <p>No priest.</p>
                        )}
                    </div>
    
                    {/* Admin Section for Updating Funeral Date */}
                    <div className="house-section">
                        <h2>Select Updated Funeral Date:</h2>
                        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                        <label>Reason:</label>
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
                        <h2>Priest Name</h2>
                        <textarea
                            placeholder="Priest Name"
                            value={priest}
                            onChange={(e) => setPriest(e.target.value)}
                        />
                        <div className="button-container">
                            <button onClick={handleAddPriest}>Add Priest</button>
                        </div>
                    </div>
    
                    {/* Confirmation and Decline Buttons */}
                    <div className="button-container">
                        <button onClick={() => handleConfirm(funeralId)}>Confirm Funeral</button>
                        <button onClick={() => handleDecline(funeralId)}>Decline</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FuneralDetails;
