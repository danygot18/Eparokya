import React, { useEffect, useState } from "react";
import axios from "axios";
import GuestSideBar from "../../../../GuestSideBar";
import { useNavigate } from "react-router-dom";

const SubmittedBaptismList = () => {
    const [baptismForms, setBaptismForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMySubmittedForms();
    }, []);

const fetchMySubmittedForms = async () => {
    setLoading(true);
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/getAllUserMassSubmittedBaptism`,
            { withCredentials: true }
        );

        const forms = response.data?.forms;
        if (Array.isArray(forms)) {
            setBaptismForms(forms);
        } else {
            setBaptismForms([]);
        }
    } catch (error) {
        console.error("Error fetching baptism forms:", error);
        const message = error.response?.data?.message || "Failed to fetch baptism forms.";
        setError(message);
    } finally {
        setLoading(false);
    }
};


    const handleCardClick = (baptismId) => {
        navigate(`/user/mySubmittedBaptismForm/${baptismId}`);
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <GuestSideBar />
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                <h1 className="baptism-title">My Submitted Mass Baptism Forms</h1>

                {loading ? (
                    <p className="loading-text">Loading...</p>
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : baptismForms.length === 0 ? (
                    <p className="no-records-text">No submitted baptism forms found.</p>
                ) : (
                    <div className="baptism-list">
                        {baptismForms.map((item, index) => {
                            const statusColor =
                                item.binyagStatus === "Confirmed" ? "#4caf50" :
                                    item.binyagStatus === "Declined" ? "#ff5722" : "#ffd700";

                            return (
                                <div
                                    key={item._id}
                                    className={`baptism-card ${item.binyagStatus?.toLowerCase() || ""}`}
                                    onClick={() => handleCardClick(item._id)}
                                    style={{ borderLeft: `6px solid ${statusColor}` }}
                                >
                                    <div className="status-badge">{item.binyagStatus ?? "Unknown"}</div>
                                    <h3 className="card-title">
                                        Record # {index + 1}: {item.child.fullName ?? "Unknown Child"}
                                    </h3>
                                    <div className="card-details">
                                        <p><strong>Baptism Date:</strong> {item.baptismDate ? new Date(item.baptismDate).toLocaleDateString() : "N/A"}</p>
                                        <p><strong>Baptism Time:</strong> {item.baptismTime ?? "N/A"}</p>
                                        <strong>Parent Contact:</strong> {item.phone ?? "N/A"}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmittedBaptismList;