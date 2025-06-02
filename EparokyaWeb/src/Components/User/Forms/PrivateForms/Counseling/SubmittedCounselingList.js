import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../../Layout/styles/style.css";
import GuestSideBar from "../../../../GuestSideBar";
import { useNavigate } from "react-router-dom";

const SubmittedCounselingList = () => {
    const [counselingForms, setCounselingForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fetchCounselingForms = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllUserSubmittedCounseling`, {
                withCredentials: true,
            });
            const forms = response.data.forms || [];
            // console.log(forms); 
            setCounselingForms(forms);
            setFilteredForms(forms);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching counseling forms.");
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (counselingId) => {
        navigate(`/user/mySubmittedCounselingForm/${counselingId}`);
    };

    const filterForms = () => {
        let filtered = counselingForms;

        if (activeFilter !== "All") {
            filtered = filtered.filter((form) => form.counselingStatus === activeFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter((form) =>
                form.person?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredForms(filtered);
    };

    useEffect(() => {
        fetchCounselingForms();
    }, []);

    useEffect(() => {
        filterForms();
    }, [activeFilter, searchTerm, counselingForms]);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <GuestSideBar />
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                <h1 className="counseling-title">My Submitted Counseling Records</h1>

                <div className="counseling-filters">
                    {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
                        <button
                            key={status}
                            className={`counseling-filter-button ${activeFilter === status ? "active" : ""}`}
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

                {/* {error && <p className="error-text">Error: {error}</p>} */}

                {loading ? (
                    <p className="loading-text">Loading submitted counseling forms...</p>
                ) : filteredForms.length === 0 ? (
                    <p className="empty-text">No counseling forms available.</p>
                ) : (
                    <div className="counseling-list">
                        {filteredForms.map((item, index) => (
                            <div
                                key={item._id}
                                className={`counseling-card ${item.counselingStatus?.toLowerCase() || ""}`}
                                onClick={() => handleCardClick(item._id)}
                            >
                                <div className="status-badge">{item.counselingStatus}</div>
                                <h3 className="card-title">Record #{index + 1}</h3>
                                <div className="card-details">
                                    <p>
                                        <strong>Full Name:</strong> {item.person?.fullName || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Purpose:</strong> {item.purpose || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Contact Number:</strong> {item.contactNumber || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Counseling Date:</strong>{" "}
                                        {item.counselingDate
                                            ? new Date(item.counselingDate).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                    <p>
                                        <strong>Counseling Time:</strong> {item.counselingTime || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Address:</strong>{" "}
                                        {item.address?.BldgNameTower ? `${item.address.BldgNameTower}, ` : ""}
                                        {item.address?.LotBlockPhaseHouseNo ? `${item.address.LotBlockPhaseHouseNo}, ` : ""}
                                        {item.address?.SubdivisionVillageZone ? `${item.address.SubdivisionVillageZone}, ` : ""}
                                        {item.address?.Street ? `${item.address.Street}, ` : ""}
                                        {item.address?.district ? `${item.address.district}, ` : ""}
                                        {item.address?.barangay === "Others"
                                            ? (item.address.customBarangay ? `${item.address.customBarangay}, ` : "")
                                            : (item.address?.barangay ? `${item.address.barangay}, ` : "")}
                                        {item.address?.city === "Others"
                                            ? (item.address.customCity ? `${item.address.customCity}` : "")
                                            : (item.address?.city || "")}
                                    </p>

                                    <p>
                                        <strong>Contact Person:</strong> {item.contactPerson?.fullName || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Contact Person Contact Number:</strong> {item.contactPerson?.contactNumber || "N/A"}
                                    </p>

                                    <p>
                                        <strong>Relationship:</strong> {item.contactPerson?.relationship || "N/A"}
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

export default SubmittedCounselingList;