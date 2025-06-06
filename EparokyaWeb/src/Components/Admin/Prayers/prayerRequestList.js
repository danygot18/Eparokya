import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";
import Loader from "../../Layout/Loader";

const PrayerRequestList = () => {
    const [prayerRequestForms, setprayerRequestForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

     const config = { withCredentials: true };
    const fetchPrayerRequestForms = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/getAllPrayerRequest`, config);
            console.log("Fetched Prayer Requests:", response.data); // Debugging
            setprayerRequestForms(response.data.prayerRequests || []);
            setFilteredForms(response.data.prayerRequests || []);
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

        if (activeFilter === "Today") {
            const today = new Date().toISOString().split("T")[0];
            filtered = filtered.filter((form) => {
                if (!form.prayerRequestDate) return false;
                const formDate = new Date(form.prayerRequestDate).toISOString().split("T")[0];
                return formDate === today;
            });
        } else if (activeFilter !== "All") {
            filtered = filtered.filter((form) =>
                form.prayerType.includes(activeFilter)
            );
        }


        if (searchTerm) {
            filtered = filtered.filter((form) =>
                form.offerrorsName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredForms(filtered);
    };

    const filterTodayPrayerRequests = () => {

        setActiveFilter("Today");
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
                    {["All", "Eternal Repose(Patay)", "Thanks Giving(Pasasalamat)", "Special Intentions(Natatanging Kahilingan)"].map((prayerType) => (
                        <button
                            key={prayerType}
                            className={`prayerRequest-filter-button ${activeFilter === prayerType ? "active" : ""}`}
                            onClick={() => setActiveFilter(prayerType)}
                        >
                            {prayerType}
                        </button>
                    ))}

                    <button
                        className={`prayerRequest-filter-button ${activeFilter === "Today" ? "active" : ""}`}
                        onClick={filterTodayPrayerRequests}
                        style={{ backgroundColor: "#007bff", color: "#fff", marginLeft: "10px" }}
                    >
                        Show Today's Prayers
                    </button>


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
                   <Loader/>
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
                                {/* <div className="status-badge">{item.prayerType}</div> */}
                                {/* <h3 className="card-title">Prayer #{index + 1}</h3> */}
                                <h3 className="card-title">{item.prayerType}</h3>
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

                                    {/* <p>
                                        <strong>Prayer Request Time:</strong>{" "}
                                        {item.prayerRequestDate
                                            ? new Date(item.prayerRequestDate).toLocaleDateString()
                                            : "N/A"}
                                    </p> */}


                                    <p>
                                        <strong>Intentions:</strong>{" "}
                                        {Array.isArray(item.Intentions) && item.Intentions.length > 0
                                            ? item.Intentions.map((Intentions, i) => (
                                                <span key={Intentions._id || i}>
                                                    {Intentions.name || "Unnamed"}
                                                    {i !== item.Intentions.length - 1 ? ", " : ""}
                                                </span>
                                            ))
                                            : "N/A"}
                                    </p>

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

export default PrayerRequestList;
