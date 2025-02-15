import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";

const FuneralList = () => {
    const [funeralList, setFuneralList] = useState([]);
    const [filteredFuneralList, setFilteredFuneralList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const fetchFunerals = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/getAllFunerals`,
                { withCredentials: true }
            );

            if (response.data && Array.isArray(response.data)) {
                setFuneralList(response.data);
                setFilteredFuneralList(response.data);
            } else {
                setFuneralList([]);
                setFilteredFuneralList([]);
            }
        } catch (err) {
            console.error("Error fetching funeral records:", err);
            setError("Unable to fetch funeral records. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (funeralId) => {
        navigate(`/admin/funeralDetails/${funeralId}`);
    };

    const filterFunerals = (status) => {
        setActiveFilter(status);
        const filtered = status === "All" 
            ? funeralList 
            : funeralList.filter((funeral) => funeral.funeralStatus === status);
        setFilteredFuneralList(filtered);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowercasedQuery = query.toLowerCase();
        const filtered = funeralList.filter((funeral) =>
            funeral?.name?.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredFuneralList(filtered);
    };

    useEffect(() => {
        fetchFunerals();
    }, []);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <SideBar />
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                <h1 className="funeral-title">Funeral Records</h1>
                <div className="funeral-controls">
                    <div className="funeral-filters">
                        {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
                            <button
                                key={status}
                                className={`funeral-filter-button ${activeFilter === status ? "active" : ""}`}
                                onClick={() => filterFunerals(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="search-bar"
                    />
                </div>

                {loading ? (
                    <p className="loading-text">Loading funeral records...</p>
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : filteredFuneralList.length === 0 ? (
                    <p className="empty-text">No funeral records available.</p>
                ) : (
                    <div className="funeral-list">
                        {filteredFuneralList.map((item, index) => (
                            <div
                                key={item._id}
                                className={`funeral-card ${item.funeralStatus?.toLowerCase() || ""}`}
                                onClick={() => handleCardClick(item._id)}
                            >
                                <div className="status-badge">{item.funeralStatus || "Unknown"}</div>
                                <h3 className="card-title">Funeral #{index + 1}</h3>
                                <div className="card-details">
                                    <p><strong>Name:</strong> {item.name ?? "N/A"}</p>
                                    {/* <p><strong>Place of Death:</strong> {item.placeOfDeath || "N/A"}</p> */}
                                    <p><strong>Reason of Death:</strong> {item.reasonOfDeath || "N/A"}</p>
                                    {/* <p><strong>Funeral Date:</strong> {item.funeralDate ? new Date(item.funeralDate).toLocaleDateString() : "N/A"}</p>
                                    <p><strong>Funeral Time:</strong> {item.funeraltime || "N/A"}</p> */}
                                    <p><strong>Funeral Mass Date:</strong> {item.funeralMassDate ? new Date(item.funeralMassDate).toLocaleDateString() : "N/A"}</p>
                                    <p><strong>Funeral Mass Time:</strong> {item.funeralMasstime || "N/A"}</p>
                                    {/* <p><strong>Service Type:</strong> {item.serviceType || "N/A"}</p> */}
                                    <p><strong>Contact Person:</strong> {item.contactPerson || "N/A"}</p>
                                    <p><strong>Phone:</strong> {item.phone || "N/A"}</p>
                                    <p><strong>Submitted By:</strong> {item.userId?.name || "Unknown"} </p>
                                    {/* <p><strong>Name:</strong> {item.userId?.name || "Unknown"}</p> */}
                                    {/* <p><strong>User ID:</strong> {item.userId?._id || "Unknown"}</p> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FuneralList;
