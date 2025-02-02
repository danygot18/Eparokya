import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";

const PrayerRequestList = () => {
    const [prayerRequestForms, setprayerRequestForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fetchPrayerRequestForms = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/getAllPrayerRequest`);
            const forms = response.data.prayerRequests || []; 
            setprayerRequestForms(forms);
            setFilteredForms(forms);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching prayer requests forms.");
        } finally {
            setLoading(false);
        }
    };
    
    
    const handleCardClick = (prayerId) => {
        navigate(`/admin/prayerRequestDetails/${prayerId}`);
    };

    const filterForms = () => {
        let filtered = prayerRequestForms;

        if (activeFilter !== "All") {
            filtered = filtered.filter((form) => form.prayerType === activeFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter((form) =>
                form.offerorsName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredForms(filtered);
    };

    useEffect(() => {
        fetchPrayerRequestForms();
    }, []);

    useEffect(() => {
        filterForms();
    }, [activeFilter, searchTerm, prayerRequestForms]);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <SideBar />
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                <h1 className="prayerRequest-title">Prayer Request Records</h1>

                <div className="prayerRequest-filters">
                    {["All", "Eternal Repose", "Thanks Giving", "Special Intentions"].map((prayerType) => (
                        <button
                            key={prayerType}
                            className={`prayerRequest-filter-button ${activeFilter === prayerType ? "active" : ""}`}
                            onClick={() => setActiveFilter(prayerType)}
                        >
                            {prayerType}
                        </button>
                    ))}
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by Full Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: "10px", marginBottom: "20px", width: "100%" }}
                    />
                </div>

                {error && <p className="error-text">Error: {error}</p>}

                {loading ? (
                    <p className="loading-text">Loading submitted prayer requests...</p>
                ) : filteredForms.length === 0 ? (
                    <p className="empty-text">No prayer requests available.</p>
                ) : (
                    <div className="prayerRequest-list">
                        {filteredForms.map((item, index) => (
                            <div
                                key={item._id}
                                className={`prayerRequest-card ${item.prayerType?.toLowerCase() || ""}`}
                                onClick={() => handleCardClick(item._id)}
                            >
                                <div className="status-badge">{item.prayerType}</div>
                                <h3 className="card-title">Record #{index + 1}</h3>
                                <div className="card-details">
                                    <p>
                                        <strong>Offeror's Full Name:</strong> {item.
offerrorsName || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Prayer Request Date:</strong>{" "}
                                        {item.prayerRequestDate
                                            ? new Date(item.prayerRequestDate).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                    <p>
                                        <strong>Intentions:</strong>
                                        {item.intentions?.name || "N/A"},
                                    </p>
                                    <p>
                                        <strong>Submitted By:</strong>
                                    </p>
                                    <p>
                                        <strong>Name:</strong> {item.userId?.name || "Unknown"}
                                    </p>
                                    <p>
                                        <strong>User ID:</strong> {item.userId?._id || "Unknown"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrayerRequestList;
