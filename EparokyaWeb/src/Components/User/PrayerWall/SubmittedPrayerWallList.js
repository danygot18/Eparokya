import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "../../Layout/styles/style.css";
import GuestSideBar from "../../GuestSideBar";

const SubmittedPrayerWallList = () => {
    const [prayers, setPrayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const prayersPerPage = 10;
    const [totalPrayers, setTotalPrayers] = useState(0);
    const [filteredForms, setFilteredForms] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const config = { withCredentials: true };

    useEffect(() => {
        const fetchUserPrayers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/getAllUserSubmittedPrayerWall?page=${currentPage}&limit=${prayersPerPage}`,
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

        fetchUserPrayers();
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
                form.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredForms(filtered);
    }, [activeFilter, searchTerm, prayers]);

    const handleSoftDelete = async (prayerId) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API}/api/v1/hidePrayer/${prayerId}`,
                {},
                config
            );
            setPrayers((prev) =>
                prev.map((prayer) =>
                    prayer._id === prayerId ? { ...prayer, hidden: true } : prayer
                )
            );
        } catch (error) {
            console.error("Error deleting prayer:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <GuestSideBar />    
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                <h1 className="adminPrayerReview-title">My Submitted Prayers</h1>

                {/* Filters */}
                <div className="houseBlessing-filters">
                    <input
                        type="text"
                        placeholder="Search by title..."
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
                        Posted
                    </button>
                    <button
                        className={`houseBlessing-filter-button ${activeFilter === "Cancelled" ? "active" : ""}`}
                        onClick={() => setActiveFilter("Cancelled")}
                    >
                        Cancelled by Admin
                    </button>
                </div>

                {/* Prayer List */}
                {loading ? (
                    <p className="loading-text">Loading prayers...</p>
                ) : filteredForms.length === 0 ? (
                    <p className="empty-text">No prayers found.</p>
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
                                    {prayer.prayerWallStatus === "Confirmed" ? "Posted" : prayer.prayerWallStatus}
                                </span>
                                <h3 className="card-title">{prayer.title}</h3>
                                <div className="card-details">
                                    <p>{prayer.prayerRequest}</p>
                                </div>
                                <div className="card-actions">
                                    <FontAwesomeIcon icon={faEdit} className="edit-icon" />
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className="delete-icon"
                                        onClick={() => handleSoftDelete(prayer._id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
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

export default SubmittedPrayerWallList;