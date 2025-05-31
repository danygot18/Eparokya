import React, { useEffect, useState } from "react";
import axios from "axios";
// import "../../../Layout/styles/style.css";
import GuestSideBar from "../../../../GuestSideBar";
import { useNavigate } from "react-router-dom";

const SubmittedWeddingList = () => {
  const [weddingForms, setWeddingForms] = useState([]);
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
        `${process.env.REACT_APP_API}/api/v1/getAllUserSubmittedWedding`,
        { withCredentials: true }
      );

      console.log("Frontend API Response:", response.data);

      if (response.data && Array.isArray(response.data.forms)) {
        setWeddingForms(response.data.forms);
      } else {
        setWeddingForms([]);
      }
    } catch (error) {
      console.error("Error fetching wedding forms:", error);
      setError("Unable to fetch wedding forms.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (weddingId) => {
    navigate(`/user/mySubmittedWeddingForm/${weddingId}`);
    console.log("Card clicked:", weddingId);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <GuestSideBar />
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <h1 className="wedding-title">My Submitted Wedding Forms</h1>

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : weddingForms.length === 0 ? (
          <p className="no-records-text">No submitted wedding forms found.</p>
        ) : (
          <div className="wedding-list">
            {weddingForms.map((item, index) => {
              const statusColor =
                item.weddingStatus === "Confirmed"
                  ? "#4caf50"
                  : item.weddingStatus === "Declined"
                  ? "#ff5722"
                  : "#ffd700";

              return (
                <div
                  key={item._id}
                  className={`wedding-card ${
                    item.weddingStatus?.toLowerCase() || ""
                  }`}
                  onClick={() => handleCardClick(item._id)}
                  style={{ borderLeft: `6px solid ${statusColor}` }}
                >
                  <div className="status-badge">
                    {item.weddingStatus ?? "Unknown"}
                  </div>
                  <h3 className="card-title">
                    Record # {index + 1}: {item.brideName ?? "Unknown Bride"} &{" "}
                    {item.groomName ?? "Unknown Groom"}
                  </h3>
                  <div className="card-details">
                    <p>
                      <strong>Wedding Date:</strong>{" "}
                      {item.weddingDate
                        ? new Date(item.weddingDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Wedding Time:</strong> {item.weddingTime ?? "N/A"}
                    </p>
                    <strong>Bride Contact:</strong> {item.bridePhone ?? "N/A"} |{" "}
                    <strong>Groom Contact:</strong> {item.groomPhone ?? "N/A"}
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

export default SubmittedWeddingList;
