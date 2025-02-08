import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";

const AdminPrayerReview = () => {
    const [prayers, setPrayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const prayersPerPage = 10;
    const [totalPrayers, setTotalPrayers] = useState(0);
    const [filteredForms, setFilteredForms] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const config = {
        withCredentials: true,
    };

    useEffect(() => {
        const fetchPrayers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/getAllPrayers?page=${currentPage}&limit=${prayersPerPage}`,
                    config
                );
                setPrayers(response.data.prayers || []);
                setTotalPrayers(response.data.total || 0);
            } catch (error) {
                console.error(
                    "Error fetching prayers:",
                    error.response ? error.response.data : error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPrayers();
    }, [currentPage]);

    useEffect(() => {
        let filtered = prayers;

        if (activeFilter !== "All") {
            filtered = filtered.filter(
                (form) => form.prayerWallStatus === activeFilter
            );
        }
        if (searchTerm) {
            filtered = filtered.filter((form) =>
                form.prayerWallSharing?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredForms(filtered);
    }, [activeFilter, searchTerm, prayers]);

    const handleApprove = async (prayerId) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API}/api/v1/confirmPrayer/${prayerId}`,
                {},
                config
            );
            setPrayers((prev) =>
                prev.map((prayer) =>
                    prayer._id === prayerId
                        ? { ...prayer, prayerWallStatus: "Confirmed" }
                        : prayer
                )
            );
        } catch (error) {
            console.error(
                "Error approving prayer:",
                error.response ? error.response.data : error.message
            );
        }
    };

    const handleReject = async (prayerId) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API}/api/v1/rejectPrayer/${prayerId}`,
                {},
                config
            );
            setPrayers((prev) =>
                prev.map((prayer) =>
                    prayer._id === prayerId
                        ? { ...prayer, prayerWallStatus: "Cancelled" }
                        : prayer
                )
            );
        } catch (error) {
            console.error(
                "Error rejecting prayer:",
                error.response ? error.response.data : error.message
            );
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <SideBar />
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                <h1 className="adminPrayerReview-title">Admin Prayer Review</h1>

                <div className="houseBlessing-filters">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="houseBlessing-filter-input"
                    />
                    <button
                        className={`houseBlessing-filter-button ${activeFilter === "All" ? "active" : ""}`}
                        onClick={() => setActiveFilter("All")}
                    >
                        All
                    </button>
                    <button
                        className={`houseBlessing-filter-button ${activeFilter === "Pending" ? "active" : ""}`}
                        onClick={() => setActiveFilter("Pending")}
                    >
                        Pending
                    </button>
                    <button
                        className={`houseBlessing-filter-button ${activeFilter === "Confirmed" ? "active" : ""}`}
                        onClick={() => setActiveFilter("Confirmed")}
                    >
                        Confirmed
                    </button>
                    <button
                        className={`houseBlessing-filter-button ${activeFilter === "Cancelled" ? "active" : ""}`}
                        onClick={() => setActiveFilter("Cancelled")}
                    >
                        Cancelled
                    </button>
                </div>

                {loading ? (
                    <p className="loading-text">Loading prayers...</p>
                ) : filteredForms.length === 0 ? (
                    <p className="empty-text">No prayers match your criteria.</p>
                ) : (
                    <div className="adminPrayerReview-list">
                        {filteredForms.map((prayer) => (
                            <div
                                className={`prayer-box ${prayer.prayerWallStatus.toLowerCase()}`}
                                key={prayer._id}
                            >
                                <span
                                    className={`status-badge ${prayer.prayerWallStatus.toLowerCase()}`}
                                >
                                    {prayer.prayerWallStatus}
                                </span>
                                <h3 className="card-title">{prayer.title}</h3>
                                <div className="card-details">
                                    <p>{prayer.prayerRequest}</p>
                                    <p>
                                        <strong>Contact:</strong> {prayer.contact || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Submitted By:</strong>{" "}
                                        {prayer.prayerWallSharing === "myName"
                                            ? `${prayer.userId?.name} (${prayer.userId?._id})`
                                            : `Parishioner (${prayer.userId?._id})`}
                                    </p>
                                </div>
                                <div className="card-actions">
                                    {prayer.prayerWallStatus === "Pending" && (
                                        <>
                                            <button
                                                className="approve-button"
                                                onClick={() => handleApprove(prayer._id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="reject-button"
                                                onClick={() => handleReject(prayer._id)}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="pagination">
                    {Array.from(
                        { length: Math.ceil(totalPrayers / prayersPerPage) },
                        (_, i) => (
                            <button
                                key={i}
                                className={currentPage === i + 1 ? "active" : ""}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPrayerReview;
