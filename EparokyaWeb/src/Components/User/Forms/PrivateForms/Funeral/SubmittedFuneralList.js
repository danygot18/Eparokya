import React, { useEffect, useState } from "react";
import axios from "axios";
import GuestSideBar from "../../../../GuestSideBar";
import { useNavigate } from "react-router-dom";

const SubmittedFuneralList = () => {
    const [funeralForms, setFuneralForms] = useState([]);
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
                `${process.env.REACT_APP_API}/api/v1/getAllUserSubmittedFuneral`,
                { withCredentials: true }
            );

            console.log("Frontend API Response:", response.data);

            if (response.data && Array.isArray(response.data.forms)) {
                setFuneralForms(response.data.forms);
            } else {
                setFuneralForms([]);
            }
        } catch (error) {
            console.error("Error fetching funeral forms:", error);
            setError("No Funeral forms have been submitted yet.");
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (funeralId) => {
        navigate(`/user/mySubmittedFuneralForm/${funeralId}`);
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <GuestSideBar />
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                <h1 className="funeral-title">My Submitted Funeral Forms</h1>

                {loading ? (
                    <p className="loading-text">Loading...</p>
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : funeralForms.length === 0 ? (
                    <p className="no-records-text">No submitted funeral forms found.</p>
                ) : (
                    <div className="funeral-list">
                        {funeralForms.map((item, index) => {
                            const statusColor =
                                item.funeralStatus === "Confirmed" ? "#4caf50" :
                                    item.funeralStatus === "Cancelled" ? "#ff5722" : "#ffd700";

                            return (
                                <div
                                    key={item._id}
                                    className={`funeral-card ${item.funeralStatus?.toLowerCase() || ""}`}
                                    onClick={() => handleCardClick(item._id)}
                                    style={{ borderLeft: `6px solid ${statusColor}` }}
                                >
                                    <div className="status-badge">{item.funeralStatus ?? "Unknown"}</div>
                                    <h3 className="card-title">
                                        Record # {index + 1}: {item.name ?? "Unknown Name"}
                                    </h3>
                                    <div className="card-details">
                                        <p><strong>Place of Death:</strong> {item.placeOfDeath ?? "N/A"}</p>
                                        <p><strong>Reason of Death:</strong> {item.reasonOfDeath ?? "N/A"}</p>
                                        <p><strong>Funeral Date:</strong> {item.funeralDate ? new Date(item.funeralDate).toLocaleDateString() : "N/A"}</p>
                                        <p><strong>Funeral Time:</strong> {item.funeraltime ?? "N/A"}</p>
                                        <p><strong>Funeral Mass Date:</strong> {item.funeralMassDate ? new Date(item.funeralMassDate).toLocaleDateString() : "N/A"}</p>
                                        <p><strong>Funeral Mass Time:</strong> {item.funeralMasstime ?? "N/A"}</p>
                                        <p><strong>Service Type:</strong> {item.serviceType ?? "N/A"}</p>
                                        <p><strong>Contact Person:</strong> {item.contactPerson ?? "N/A"}</p>
                                        <p><strong>Phone:</strong> {item.phone ?? "N/A"}</p>
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

export default SubmittedFuneralList;