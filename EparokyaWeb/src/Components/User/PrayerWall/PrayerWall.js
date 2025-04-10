import React, { useState, useEffect } from "react";
import axios from "axios";
import GuestSidebar from '../../GuestSideBar';
import "../../Layout/styles/style.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { CircularProgress } from "@mui/material";

const PrayerWall = () => {
  const [prayers, setPrayers] = useState([]);
  const [newPrayer, setNewPrayer] = useState({
    title: "",
    prayerRequest: "",
    prayerWallSharing: "anonymous",
    contact: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const prayersPerPage = 10;
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPrayers, setTotalPrayers] = useState(0);
  const [loadingPrayerId, setLoadingPrayerId] = useState(null);
  const config = {
    withCredentials: true,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/profile`, config);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error.message);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/prayer-wall?page=${currentPage}&limit=${prayersPerPage}`,
          { withCredentials: true }
        );
  
        const { prayers, total } = response.data;
        
        setPrayers(
          prayers.map(prayer => ({
            ...prayer,
            includedByUser: prayer.includedByUser || false, // Default to false if not present
          }))
        );
        setTotalPrayers(total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prayers:", error);
        setLoading(false);
      }
    };
  
    fetchPrayers();
  }, [currentPage]);
  
  const handleNewPrayerSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to post a prayer.");
      return;
    }

    try {
      const prayerData = { ...newPrayer, userId: user._id };
      await axios.post(`${process.env.REACT_APP_API}/api/v1/submitPrayer`, prayerData, config);
      setNewPrayer({ title: "", prayerRequest: "", prayerWallSharing: "anonymous", contact: "" });
      alert("Successful! Please wait for the admin confirmation for your prayer to be posted");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error posting prayer:", error);
      alert("Failed to post prayer. Please try again.");
    }
  };

  const handleLike = async (prayerId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/toggleLike/${prayerId}`,
        {},
        { withCredentials: true }
      );

      setPrayers((prevPrayers) =>
        prevPrayers.map((prayer) =>
          prayer._id === prayerId
            ? {
              ...prayer,
              likes: response.data.likes,
              likedByUser: response.data.likedByUser, // Update state based on backend response
            }
            : prayer
        )
      );
    } catch (error) {
      console.error("Error liking prayer:", error);
    }
  };


  const handleInclude = async (prayerId) => {
    if (!user) {
      alert("You must be logged in to include a prayer.");
      return;
    }
  
    try {
      setLoadingPrayerId(prayerId);
  
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/toggleInclude/${prayerId}`,
        {},
        { withCredentials: true }
      );
  
      setPrayers((prevPrayers) =>
        prevPrayers.map((prayer) =>
          prayer._id === prayerId
            ? {
                ...prayer,
                includeCount: response.data.includeCount,
                includedByUser: response.data.includedByUser, // Ensure we get this from backend
              }
            : prayer
        )
      );
    } catch (error) {
      console.error("Error including prayer:", error);
    } finally {
      setLoadingPrayerId(null);
    }
  };

  if (loading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </div>
      );
    }
  
  

  return (
    <div className="prayer-wall-container">
      <div >
        <GuestSidebar />
      </div>

      <div className="prayer-wall">
        <div className="prayer-share" style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="share-button"
            style={{
              backgroundColor: "#154314",
              color: "white",
              padding: "10px 20px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              border: "none",
              borderRadius: "5px",
              width: "60%",
              maxWidth: "300px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            Click here to Share a Prayer
          </button>
        </div>


        {isModalOpen && (
          <>
            <div
              className="prayerModal-overlay"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <div className="prayerModal">
              <h3>Share a Prayer</h3>
              <form onSubmit={handleNewPrayerSubmit}>
                <input
                  type="text"
                  placeholder="Title"
                  value={newPrayer.title}
                  onChange={(e) => setNewPrayer({ ...newPrayer, title: e.target.value })}
                />

                <textarea
                  placeholder="Your prayer request"
                  value={newPrayer.prayerRequest}
                  onChange={(e) => setNewPrayer({ ...newPrayer, prayerRequest: e.target.value })}
                  required
                />

                <input
                  type="text"
                  placeholder="Contact"
                  value={newPrayer.contact}
                  onChange={(e) => setNewPrayer({ ...newPrayer, contact: e.target.value })}
                />

                <div>
                  <label>
                    <input
                      type="radio"
                      name="prayerWallSharing"
                      value="anonymous"
                      checked={newPrayer.prayerWallSharing === 'anonymous'}
                      onChange={(e) => setNewPrayer({ ...newPrayer, prayerWallSharing: e.target.value })}
                      required
                    />
                    Share anonymously
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="prayerWallSharing"
                      value="myName"
                      checked={newPrayer.prayerWallSharing === 'myName'}
                      onChange={(e) => setNewPrayer({ ...newPrayer, prayerWallSharing: e.target.value })}
                      required
                    />
                    Share with my name
                  </label>
                </div>

                <button type="submit">Post Prayer</button>
              </form>

              <button onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </>
        )}

        {loading ? (
          <p>Loading prayers...</p>
        ) : (
          prayers.map((prayer) => (
            <div className="prayer-box" key={prayer._id}>
              <div className="prayer-header" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={
                    prayer.prayerWallSharing === "anonymous"
                      ? "/public/../../../../EPAROKYA-SYST.png"
                      : prayer.user?.avatar?.url || "/path/to/default-avatar.png"
                  }
                  alt="Profile"
                  className="avatar"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
                <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                  {prayer.prayerWallSharing === "anonymous" ? "Anonymous" : prayer.user?.name || "Unknown User"}
                </span>
              </div>



              <h4 className="prayer-title">{prayer.title}</h4>
              <p className="prayer-description">{prayer.prayerRequest}</p>
              <div className="prayer-actions">

                {/* Like Button */}
                <div
                  onClick={() => handleLike(prayer._id)}
                  style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                >
                  {prayer.likedByUser ? (
                    <FaHeart style={{ fontSize: "1.5rem", transition: "transform 0.2s" }} />
                  ) : (
                    <FaRegHeart style={{ fontSize: "1.5rem", transition: "transform 0.2s" }} />
                  )}
                  <span style={{ fontSize: "1.2rem" }}>{prayer.likes || 0}</span>
                </div>


                <div>
                  <button
                    onClick={() => handleInclude(prayer._id)}
                    disabled={prayer.includedByUser || loadingPrayerId === prayer._id}
                    style={{
                      backgroundColor: "#6c757d", 
                      color: "white",
                      padding: "10px 20px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      border: "none",
                      borderRadius: "5px",
                      width: "60%", 
                      maxWidth: "300px", 
                      cursor: prayer.includedByUser ? "not-allowed" : "pointer",
                      textAlign: "center",
                      transition: "background-color 0.2s",
                    }}
                  >
                    {prayer.includedByUser
                      ? "You have included this in your prayer"
                      : loadingPrayerId === prayer._id
                        ? "Processing..."
                        : `Include (${prayer.includeCount || 0})`}
                  </button>

                  {/* Indicator box */}
                  {prayer.includedByUser && (
                    <div style={{
                      marginTop: "10px",
                      padding: "8px",
                      backgroundColor: "#d4edda",
                      borderRadius: "5px",
                      color: "#155724",
                      textAlign: "center",
                      fontWeight: "bold"
                    }}>
                      ✅ You have already included this in your prayer.
                    </div>
                  )}
                </div>



              </div>
              <div className="prayer-meta" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <span>Created: {new Date(prayer.createdAt).toLocaleDateString()}</span>
                {prayer.confirmedAt && (
                  <span>Confirmed: {new Date(prayer.confirmedAt).toLocaleDateString()}</span>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PrayerWall;
