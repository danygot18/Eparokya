import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../../Layout/styles/style.css";
import GuestSideBar from "../../../../GuestSideBar";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../../Layout/Loader";

const MySubmittedHouseBlessingForm = () => {
    const { formId } = useParams();
    const [blessingDetails, setBlessingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlessingDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/getHouseBlessingForm/${formId}`,
                    { withCredentials: true }
                );
                setBlessingDetails(response.data);
            } catch (err) {
                setError("Failed to fetch house blessing details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlessingDetails();
    }, [formId]);

    const handleCancel = async () => {
        try {
            const confirmCancel = window.confirm("Are you sure you want to cancel this house blessing request?");
            if (!confirmCancel) return;

            const response = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/cancelHouseBlessing/${formId}`,
                {},
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success("House blessing request cancelled successfully!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                navigate("/user/profile");
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Error cancelling the house blessing request.",
                {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                }
            );
        }
    };

    if (loading) {
      return <Loader />; 
    }


    return (
        <div className="wedding-details-page">
            <GuestSideBar />
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
                        <div className="house-details-item">
                            <p>
                                <strong>Address:</strong>{" "}
                                {blessingDetails?.address?.BldgNameTower ? `${blessingDetails.address.BldgNameTower}, ` : ""}
                                {blessingDetails?.address?.LotBlockPhaseHouseNo ? `${blessingDetails.address.LotBlockPhaseHouseNo}, ` : ""}
                                {blessingDetails?.address?.SubdivisionVillageZone ? `${blessingDetails.address.SubdivisionVillageZone}, ` : ""}
                                {blessingDetails?.address?.Street ? `${blessingDetails.address.Street}, ` : ""}
                                {blessingDetails?.address?.district ? `${blessingDetails.address.district}, ` : ""}
                                {blessingDetails?.address?.barangay === "Others"
                                    ? (blessingDetails.address.customBarangay ? `${blessingDetails.address.customBarangay}, ` : "")
                                    : (blessingDetails?.address?.barangay ? `${blessingDetails.address.barangay}, ` : "")}
                                {blessingDetails?.address?.city === "Others"
                                    ? (blessingDetails.address.customCity ? `${blessingDetails.address.customCity}` : "")
                                    : (blessingDetails?.address?.city || "")}
                            </p>
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
                        {blessingDetails?.comments && blessingDetails.comments.length > 0 ? (
                            blessingDetails.comments.map((comment, index) => (
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

                    {/* Cancel Button (only for Pending status) */}
                    {blessingDetails?.blessingStatus === "Pending" && (
                        <div className="button-container">
                            <button onClick={handleCancel} className="cancel-button">
                                Cancel Request
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default MySubmittedHouseBlessingForm;