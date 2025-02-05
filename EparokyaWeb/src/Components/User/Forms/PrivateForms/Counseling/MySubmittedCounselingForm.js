import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../../Layout/styles/style.css";
import GuestSideBar from "../../../../GuestSideBar";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

const MySubmittedCounselingForms = () => {
    const { formId } = useParams();
    const [counselingDetails, setCounselingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [priest, setPriest] = useState("");
    const [updatedCounselingDate, setUpdatedCounselingDate] = useState("");

    useEffect(() => {
        const fetchCounselingDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/getCounselingForm/${formId}`,
                    { withCredentials: true }
                );

                setCounselingDetails(response.data);
                setComments(response.data.comments || []);
                setPriest(response.data.priest || "");
                setUpdatedCounselingDate(response.data.counselingDate || "");

            } catch (err) {
                setError("Failed to fetch counseling details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCounselingDetails();
    }, [formId]);

    const handleCancel = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/${formId}/cancelCounseling`,
                { withCredentials: true }
            );
            toast.success("Counseling cancelled successfully!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to cancel the counseling.",
                {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                }
            );
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="wedding-details-page">
            <GuestSideBar />
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
                        <h2>Priest</h2>
                        {counselingDetails?.priest?.name ? (
                            <div className="admin-comment">
                                <p><strong>Priest:</strong> {counselingDetails.priest.name}</p>
                            </div>
                        ) : (
                            <p>No priest.</p>
                        )}
                    </div>

                    {/* Cancel Button */}
                    <div className="button-container">
                        <button onClick={handleCancel}>Cancel Counseling</button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default MySubmittedCounselingForms;