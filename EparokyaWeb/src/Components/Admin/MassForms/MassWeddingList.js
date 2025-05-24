import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";

const MassWeddingList = () => {
  const [massWeddingForms, setMassWeddingForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMassWeddingForms();
  }, []);

  const fetchMassWeddingForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllMassWeddings`,
        {
          withCredentials: true,
        }
      );

      console.log("Frontend API Response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setMassWeddingForms(response.data);
      } else {
        setMassWeddingForms([]);
      }
    } catch (error) {
      console.error("Error fetching mass wedding forms:", error);
      window.alert("Unable to fetch mass wedding forms.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (massWeddingId) => {
    navigate(`/admin/massWeddingDetails/${massWeddingId}`);
  };

  const filterMassWeddingForms = () => {
    return massWeddingForms.filter((wedding) => {
      return (
        (filteredStatus === "All" ||
          wedding.weddingStatus === filteredStatus) &&
        (searchTerm === "" ||
          wedding.brideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          wedding.groomName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideBar />
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <h1 className="wedding-title">Mass Wedding Records</h1>

        <div className="wedding-filters">
          {["All", "Confirmed", "Pending", "Cancelled"].map((status) => (
            <button
              key={status}
              className={`wedding-filter-button ${
                filteredStatus === status ? "active" : ""
              }`}
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
            {filterMassWeddingForms().map((item, index) => {
              const statusColor =
                item.weddingStatus === "Confirmed"
                  ? "#4caf50"
                  : item.weddingStatus === "Cancelled"
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
                  <h3 className="card-title">
                    Mass Wedding # {index + 1}:{" "}
                    {item.brideName ?? "Unknown Bride"} &{" "}
                    {item.groomName ?? "Unknown Groom"}
                  </h3>

                  <div className="card-details">
                    <p>
                      <strong>Wedding Date:</strong>{" "}
                      {item.weddingDateTime?.date
                        ? new Date(
                            item.weddingDateTime.date
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Wedding Time:</strong>{" "}
                      {item.weddingDateTime?.time || "N/A"}
                    </p>
                    <p>
                      <strong>Bride Contact:</strong> {item.bridePhone ?? "N/A"}{" "}
                    </p>
                    <p>
                      <strong>Groom Contact:</strong> {item.groomPhone ?? "N/A"}
                    </p>
                    <p>
                      <strong>Submitted By:</strong>{" "}
                      {item.userId?.name || "Unknown"}
                    </p>
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

export default MassWeddingList;
