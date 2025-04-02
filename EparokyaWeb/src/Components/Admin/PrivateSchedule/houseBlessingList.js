import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";

const HouseBlessingList = () => {
    const [houseBlessingForms, setHouseBlessingForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fetchHouseBlessingForms = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllhouseBlessing`);
            const forms = response.data.houseBlessingRequests || [];
            setHouseBlessingForms(forms);
            setFilteredForms(forms);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching house blessings forms.");
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (houseBlessingId) => {
        navigate(`/admin/houseBlessingDetails/${houseBlessingId}`);
    };

    const filterForms = () => {
        let filtered = houseBlessingForms;

        if (activeFilter !== "All") {
            filtered = filtered.filter((form) => form.blessingStatus === activeFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter((form) =>
                form.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredForms(filtered);
    };

    useEffect(() => {
        fetchHouseBlessingForms();
    }, []);

    useEffect(() => {
        filterForms();
    }, [activeFilter, searchTerm, houseBlessingForms]);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <SideBar />
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                <h1 className="houseBlessing-title">House Blessing Records</h1>

                <div className="houseBlessing-filters">
                    {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
                        <button
                            key={status}
                            className={`houseBlessing-filter-button ${activeFilter === status ? "active" : ""}`}
                            onClick={() => setActiveFilter(status)}
                        >
                            {status}
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
                    <p className="loading-text">Loading submitted house blessings forms...</p>
                ) : filteredForms.length === 0 ? (
                    <p className="empty-text">No house blessings forms available.</p>
                ) : (
                    <div className="houseBlessing-list">
                        {filteredForms.map((item, index) => (
                            <div
                                key={item._id}
                                className={`houseBlessing-card ${item.blessingStatus?.toLowerCase() || ""}`}
                                onClick={() => handleCardClick(item._id)}
                            >
                                {/* <div className="status-badge">{item.blessingStatus}</div> */}
                                <h3 className="card-title">Record #{index + 1}</h3>
                                <div className="card-details">
                                    <p>
                                        <strong>Full Name:</strong> {item.fullName || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Contact Number:</strong> {item.contactNumber || "N/A"}
                                    </p>
                                    <p>
                                        <strong>House Blessing Date:</strong> {item.blessingDate ? new Date(item.blessingDate).toLocaleDateString() : "N/A"}
                                    </p>
                                    <p>
                                        <strong>House Blessing Time:</strong> {item.blessingTime || "N/A"}
                                    </p>
                                    {/* <p>
                                        <strong>Address:</strong>
                                        {item.address?.houseDetails || "N/A"},
                                        {item.address?.block || "N/A"},
                                        {item.address?.lot || "N/A"},
                                        {item.address?.phase || "N/A"},
                                        {item.address?.street || "N/A"},
                                        {item.address?.baranggay || "N/A"},
                                        {item.address?.district || "N/A"},
                                        {item.address?.city || "N/A"},
                                    </p> */}
                                    <p>
                                        <strong>Submitted By:</strong> {item.userId?.name || "Unknown"}
                                    </p>
                                    {/* <p>
                                        <strong>Name:</strong> {item.userId?.name || "Unknown"}
                                    </p> */}
                                    {/* <p>
                                        <strong>User ID:</strong> {item.userId?._id || "Unknown"}
                                    </p> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HouseBlessingList;
