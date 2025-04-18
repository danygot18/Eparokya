import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";

const MassBaptismList = () => {
    const [massBaptismForms, setMassBaptismForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fetchMassBaptismForms = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllMassBaptism`);
            const forms = response.data.massBaptismForms || [];
            setMassBaptismForms(forms);
            setFilteredForms(forms);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching mass baptism forms.");
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (baptismId) => {
        navigate(`/admin/massBaptismDetails/${baptismId}`);
    };

    const filterForms = () => {
        let filtered = massBaptismForms;

        if (activeFilter !== "All") {
            filtered = filtered.filter((form) => form.binyagStatus === activeFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter((form) =>
                form.child?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredForms(filtered);
    };

    useEffect(() => {
        fetchMassBaptismForms();
    }, []);

    useEffect(() => {
        filterForms();
    }, [activeFilter, searchTerm, massBaptismForms]);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <SideBar />
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                <h1 className="baptism-title">Mass Baptism Records</h1>

                <div className="baptism-filters">
                    {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
                        <button
                            key={status}
                            className={`baptism-filter-button ${activeFilter === status ? "active" : ""}`}
                            onClick={() => setActiveFilter(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by Child Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: "10px", marginBottom: "20px", width: "100%" }}
                    />
                </div>

                {error && <p className="error-text">Error: {error}</p>}

                {loading ? (
                    <p className="loading-text">Loading mass baptism forms...</p>
                ) : filteredForms.length === 0 ? (
                    <p className="empty-text">No mass baptism forms available.</p>
                ) : (
                    <div className="baptism-list">
                        {filteredForms.map((item, index) => (
                            <div
                                key={item._id}
                                className={`baptism-card ${item.binyagStatus?.toLowerCase() || ""}`}
                                onClick={() => handleCardClick(item._id)}
                            >
                                <h3 className="card-title">Mass Baptism #{index + 1}</h3>
                                <div className="card-details">
                                    <p>
                                        <strong>Name of the Child:</strong> {item.child?.fullName || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Father:</strong> {item.parents?.fatherFullName || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Mother:</strong> {item.parents?.motherFullName || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Contact Info:</strong> {item.phone || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Baptism Date:</strong>{" "}
                                        {item.baptismDateTime?.date
                                            ? new Date(item.baptismDateTime.date).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                    <p>
                                        <strong>Baptism Time:</strong> {item.baptismDateTime?.time || "Unknown"}
                                    </p>


                                    <p>
                                        <strong>Submitted By:</strong> {item.userId?.name || "Unknown"}
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

export default MassBaptismList;