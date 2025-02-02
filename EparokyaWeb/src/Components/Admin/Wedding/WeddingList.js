import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";

const WeddingList = () => {
    const [weddingForms, setWeddingForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredStatus, setFilteredStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState(""); 
    const navigate = useNavigate();

    const fetchWeddingForms = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllWeddings`, {
                withCredentials: true,
            });

            if (response.data && Array.isArray(response.data)) {
                setWeddingForms(response.data);
            } else {
                setWeddingForms([]);
            }
        } catch (error) {
            window.alert("Unable to fetch wedding forms.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeddingForms();
    }, []);

    const handleCardClick = (weddingId) => {
        navigate(`/admin/weddingDetails/${weddingId}`);
    };

    const filterWeddingForms = (status) => {
        let filtered = weddingForms;

        if (status !== "All") {
            filtered = filtered.filter((wedding) => wedding.weddingStatus === status);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (wedding) =>
                    wedding.bride.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    wedding.groom.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const renderWeddingForm = (item, index) => {
        const { bride, groom, attendees, flowerGirl, ringBearer, weddingDate, weddingStatus, user } = item;

        const statusColor =
            weddingStatus === "Confirmed"
                ? "#4caf50"
                : weddingStatus === "Declined"
                ? "#ff5722"
                : "#ffd700";

        return (
            <div
                key={item._id}
                className={`wedding-card ${weddingStatus?.toLowerCase() || ""}`}
                onClick={() => handleCardClick(item._id)}
                style={{ borderLeft: `6px solid ${statusColor}` }}
            >
                <div className="status-badge">{weddingStatus || "Unknown"}</div>
                <h3 className="card-title">
                    Record # {index + 1}: {bride && groom ? `${bride} & ${groom}` : "Names not available"}
                </h3>
                <div className="card-details">
                    <p>
                        <strong>Wedding Date:</strong> {weddingDate ? new Date(weddingDate).toLocaleDateString() : "N/A"}
                    </p>
                    <p>
                        <strong>Attendees:</strong> {attendees ?? "N/A"}
                    </p>
                    <p>
                        <strong>Flower Girl:</strong> {flowerGirl || "N/A"} |{" "}
                        <strong>Ring Bearer:</strong> {ringBearer || "N/A"}
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
        );
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <SideBar />
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                <h1 className="wedding-title">Wedding Records</h1>

                <div className="wedding-filters">
                    {["All", "Confirmed", "Pending", "Declined"].map((status) => (
                        <button
                            key={status}
                            className={`wedding-filter-button ${filteredStatus === status ? "active" : ""}`}
                            onClick={() => setFilteredStatus(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by Bride or Groom Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: "10px", marginBottom: "20px", width: "100%" }}
                    />
                </div>

                {loading ? (
                    <p className="loading-text">Loading...</p>
                ) : (
                    <div className="wedding-list">
                        {filterWeddingForms(filteredStatus).map(renderWeddingForm)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeddingList;
