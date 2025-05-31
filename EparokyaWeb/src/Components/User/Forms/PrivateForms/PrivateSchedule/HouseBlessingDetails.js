import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import "./houseBlessing.css";
import SideBar from "../SideBar";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';
import { toast, ToastContainer } from 'react-toastify';

Modal.setAppElement("#root");

const UserHouseBlessingsDetails = () => {
    const { blessingId } = useParams();
    const [blessingDetails, setBlessingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [priest, setPriest] = useState("");

    const [priestsList, setPriestsList] = useState([]);
    const [selectedPriestId, setSelectedPriestId] = useState("");

    const [selectedComment, setSelectedComment] = useState("");
    const [rescheduledDate, setRescheduledDate] = useState("");
    const [rescheduledReason, setRescheduledReason] = useState("");
    const [additionalComment, setAdditionalComment] = useState("");
    const [comments, setComments] = useState([]);

    const [newDate, setNewDate] = useState("");
    const [reason, setReason] = useState("");
    const [updatedBlessingDate, setUpdatedBlessingDate] = useState(blessingDetails?.blessingDate || "");

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
                setUpdatedBlessingDate(response.data.blessingDate);
                setSelectedPriestId(response.data.counseling?.priest?._id || "");

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

        fetchBlessingDetails();
        fetchPriests();
    }, [blessingId]);

    const handleConfirm = async (blessingId) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/${blessingId}/confirmBlessing`,
                { withCredentials: true }
            );
            toast.success("House blessing confirmed successfully!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to confirm the house blessing.",
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
                `${process.env.REACT_APP_API}/api/v1/declineBlessing/${blessingId}`,
                { reason: cancelReason },
                { withCredentials: true }
            );

            toast.success("House Blessing cancelled successfully!", { position: toast.POSITION.TOP_RIGHT });
            setShowCancelModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel the house blessing.", {
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
                `${process.env.REACT_APP_API}/api/v1/updateHouseBlessingDate/${blessingId}`,
                { newDate, reason }
            );

            setUpdatedBlessingDate(response.data.blessingDate);
            alert("Blessing date updated successfully!");
        } catch (error) {
            console.error("Error updating blessing date:", error);
            alert("Failed to update blessing date.");
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
                `${process.env.REACT_APP_API}/api/v1/${blessingId}/commentBlessing`,
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
                `${process.env.REACT_APP_API}/api/v1/addPriestBlessing/${blessingId}`,
                { priestId: selectedPriestId },
                { withCredentials: true }
            );
            toast.success("Priest assigned successfully!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            setBlessingDetails(prev => ({
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
        <div className="wedding-details-page">
            <SideBar />
            <div className="house-details-content">
                <div className="house-details-grid">
                    {/* House Details Box */}
                    <div className="house-details-box">
                        <h3>House Blessing Details</h3>
                        <div className="house-details-item">
                            <p><strong>Full Name:</strong> {blessingDetails?.fullName || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Contact Number:</strong> {blessingDetails?.contactNumber || "N/A"}</p>
                        </div>
                        {/* <div className="house-details-item">
                            <p><strong>Address:</strong>
                                {blessingDetails?.address?.houseDetails || "N/A"},
                                {blessingDetails?.address?.phase || "N/A"},
                                {blessingDetails?.address?.street || "N/A"},
                                {blessingDetails?.address?.baranggay === 'Others' ? blessingDetails?.address?.customBarangay || "N/A" : blessingDetails?.address?.baranggay || "N/A"},
                                {blessingDetails?.address?.district || "N/A"},
                                {blessingDetails?.address?.city === 'Others' ? blessingDetails?.address?.customCity || "N/A" : blessingDetails?.address?.city || "N/A"}
                            </p>
                        </div> */}

                        <div className="house-details-item">
                            <p><strong>House Details:</strong> {blessingDetails?.address?.houseDetails || "N/A"}</p>
                            <p><strong>Block:</strong> {blessingDetails?.address?.block || "N/A"}</p>
                            <p><strong>Phase:</strong> {blessingDetails?.address?.phase || "N/A"}</p>
                            <p><strong>Street:</strong> {blessingDetails?.address?.street || "N/A"}</p>
                            <p><strong>Barangay:</strong> {blessingDetails?.address?.baranggay === 'Others' ? blessingDetails?.address?.customBarangay || "N/A" : blessingDetails?.address?.baranggay || "N/A"}</p>
                            <p><strong>District:</strong> {blessingDetails?.address?.district || "N/A"}</p>
                            <p><strong>City:</strong> {blessingDetails?.address?.city === 'Others' ? blessingDetails?.address?.customCity || "N/A" : blessingDetails?.address?.city || "N/A"}</p>
                        </div>


                        <div className="house-details-item">
                            <p><strong>Blessing Date:</strong> {blessingDetails?.blessingDate ? new Date(blessingDetails.blessingDate).toLocaleDateString() : "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Blessing Time:</strong> {blessingDetails?.blessingTime || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Blessing Status:</strong> {blessingDetails?.blessingStatus || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Confirmed At:</strong> {blessingDetails?.confirmedAt ? new Date(blessingDetails.confirmedAt).toLocaleDateString() : "N/A"}</p>
                        </div>
                    </div>

                    {/* Admin Comments Section */}
                    <div className="house-comments-section">
                        <h2>Admin Comments</h2>
                        {(comments && comments.length > 0) ? (
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

                    {/* Updated Blessing Date Section */}
                    <div className="blessing-date-box">
                        <h3>Updated Blessing Date</h3>
                        <p className="date">
                            {blessingDetails?.adminRescheduled?.date ? new Date(blessingDetails.adminRescheduled.date).toLocaleDateString() : "N/A"}
                        </p>
                        {blessingDetails?.adminRescheduled?.reason && (
                            <div className="reschedule-reason">
                                <h3>Reason for Rescheduling</h3>
                                <p>{blessingDetails.adminRescheduled.reason}</p>
                            </div>
                        )}
                    </div>

                    {/* Priest Section */}
                    <div className="house-comments-section">
                        <h2>Priest</h2>
                        <p><strong>Priest:</strong> {blessingDetails?.priest || "N/A"}</p>
                    </div>

                    {/* Admin Section for Updating Blessing Date */}
                    <div className="house-section">
                        <h2>Select Updated Blessing Date:</h2>
                        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                        <label>Reason:</label>
                        <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
                    </div>
                    <div className="button-container">
                        <button onClick={handleUpdate} disabled={loading}>
                            {loading ? "Updating..." : "Update Blessing Date"}
                        </button></div>


                    {/* Admin Comment Submission */}
                    <div className="house-section">
                        <h2>Submit Admin Comment</h2>
                        <select value={selectedComment} onChange={(e) => setSelectedComment(e.target.value)}>
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
                        <button onClick={handleAddPriest}>Add Priest</button>
                    </div>

                    {/* Cancelling Reason Section */}
                    {blessingDetails?.blessingStatus === "Cancelled" && blessingDetails?.cancellingReason ? (
                        <div className="house-comments-section">
                            <h2>Cancellation Details</h2>
                            <div className="admin-comment">
                                <p><strong>Cancelled By:</strong> {blessingDetails.cancellingReason.user === "Admin" ? "Admin" : blessingDetails.cancellingReason.user}</p>
                                <p><strong>Reason:</strong> {blessingDetails.cancellingReason.reason || "No reason provided."}</p>
                            </div>
                        </div>
                    ) : null}

                    {/* Cancel Button */}
                    <div className="button-container">
                        <button onClick={() => setShowCancelModal(true)}>Cancel House Blessing</button>
                    </div>

                    {/* Cancellation Modal */}
                    {showCancelModal && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h3>Cancel House Blessing</h3>
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
                        <button onClick={() => handleConfirm(blessingId)}>Confirm Blessing</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default UserHouseBlessingsDetails;