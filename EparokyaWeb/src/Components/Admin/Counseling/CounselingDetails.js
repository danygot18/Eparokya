import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';
import { toast, ToastContainer } from 'react-toastify';

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
    }, [ ]);


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

    const handleDecline = async (counselingId) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/${counselingId}/declineCounseling`,
                { withCredentials: true }
            );
            console.log("Declining response:", response.data);
            toast.success("Counseling declined successfully!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Error declining counseling:", error.response || error.message);
            toast.error(
                error.response?.data?.message || "Failed to decline the counseling.",
                {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                }
            );
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
        <div className="wedding-details-page">
            <SideBar />
            <div className="house-details-content">
                <div className="house-details-grid">
                    {/* Counseling Details Box */}
                    <div className="house-details-box">
                        <h3>Counseling Details</h3>
                        <div className="house-details-item">
                            <p><strong>Full Name:</strong> {counselingDetails?.person?.fullName || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Date of Birth:</strong> {counselingDetails?.person?.dateOfBirth ? new Date(counselingDetails.person.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Purpose:</strong> {counselingDetails?.purpose || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Contact Person:</strong> {counselingDetails?.contactPerson?.fullName || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Contact Number:</strong> {counselingDetails?.contactPerson?.contactNumber || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Relationship:</strong> {counselingDetails?.contactPerson?.relationship || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Address:</strong> {counselingDetails?.address?.block || "N/A"},
                                {counselingDetails?.address?.lot || "N/A"},
                                {counselingDetails?.address?.street || "N/A"},
                                {counselingDetails?.address?.phase || "N/A"},
                                {counselingDetails?.address?.baranggay || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Counseling Date:</strong> {counselingDetails?.counselingDate ? new Date(counselingDetails.counselingDate).toLocaleDateString() : "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Counseling Time:</strong> {counselingDetails?.counselingTime || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Counseling Status:</strong> {counselingDetails?.counselingStatus || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Confirmed At:</strong> {counselingDetails?.confirmedAt ? new Date(counselingDetails.confirmedAt).toLocaleDateString() : "N/A"}</p>
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

                    {/* Updated Counseling Date Section */}
                    <div className="blessing-date-box">
                        <h3>Updated Counseling Date</h3>
                        <p className="date">
                            {updatedCounselingDate ? new Date(updatedCounselingDate).toLocaleDateString() : "N/A"}
                        </p>
                        {counselingDetails?.adminRescheduled?.reason && (
                            <div className="reschedule-reason">
                                <h3>Reason for Rescheduling</h3>
                                <p>{counselingDetails.adminRescheduled.reason}</p>
                            </div>
                        )}
                    </div>

                    {/* Priest Section */}
                    <div className="house-comments-section">
                        <h2>Assigned Priest</h2>
                        {counselingDetails?.priest ? (
                            <p><strong>{counselingDetails.priest.title} {counselingDetails.priest.fullName}</strong></p>
                        ) : (
                            <p>No priest assigned.</p>
                        )}
                    </div>

                    {/* Admin Section for Updating Counseling Date */}
                    <div className="house-section">
                        <h2>Select Updated Counseling Date:</h2>
                        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                        <label>Reason:</label>
                        <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
                        <div className="button-container">
                            <button onClick={handleUpdate} disabled={loading}>
                                {loading ? "Updating..." : "Update Counseling Date"}
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

                    {/* Confirmation and Decline Buttons */}
                    <div className="button-container">
                        <button onClick={() => handleConfirm(counselingId)}>Confirm Counseling</button>
                        <button onClick={() => handleDecline(counselingId)}>Decline</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CounselingDetails;