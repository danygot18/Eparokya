import React, { useState, useEffect } from "react";
import axios from "axios";
import GuestSidebar from '../../GuestSideBar';
import "../../Layout/styles/style.css";

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
          `${process.env.REACT_APP_API}/api/v1/prayer-wall?page=${currentPage}&limit=${prayersPerPage}`
        );
        setPrayers(response.data.prayers || []);
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
      alert("Prayer posted successfully!");
      setIsModalOpen(false);  
    } catch (error) {
      console.error("Error posting prayer:", error);
      alert("Failed to post prayer. Please try again.");
    }
  };

  const handleLike = async (prayerId) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API}/api/v1/toggle-like/${prayerId}`, {}, config);
      setPrayers((prevPrayers) =>
        prevPrayers.map((prayer) =>
          prayer._id === prayerId ? { ...prayer, likes: response.data.likes } : prayer
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
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/toggleInclude/${prayerId}`,
        {},
        config
      );
  
      const { includes, includedByUser } = response.data;
  
      setPrayers((prevPrayers) =>
        prevPrayers.map((prayer) =>
          prayer._id === prayerId
            ? { ...prayer, includedByUser, includes }
            : prayer
        )
      );
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error("Error including prayer:", error);
      }
    }
  };
  

  return (
    <div className="prayer-wall-container">
      {/* Guest Sidebar */}
      <div className="guest-sidebar">
        <GuestSidebar />
      </div>

      {/* Main Prayer Wall */}
      <div className="prayer-wall">
        {/* Share a Prayer */}
        <div className="prayer-share">
          <button
            onClick={() => setIsModalOpen(true)}  // Open the modal on click
            className="share-button"
          >
            Share a Prayer
          </button>
        </div>

        {/* Prayer Modal */}
        {isModalOpen && (
          <div id="prayer-modal" className="modal">
            <div className="modal-content">
              <h3>Share a Prayer</h3>
              <form onSubmit={handleNewPrayerSubmit}>
                <input
                  type="text"
                  placeholder="Title (Optional)"
                  value={newPrayer.title}
                  onChange={(e) => setNewPrayer({ ...newPrayer, title: e.target.value })}
                />
                <textarea
                  placeholder="Your prayer request"
                  value={newPrayer.prayerRequest}
                  onChange={(e) => setNewPrayer({ ...newPrayer, prayerRequest: e.target.value })}
                  required
                />
                <select
                  value={newPrayer.prayerWallSharing}
                  onChange={(e) => setNewPrayer({ ...newPrayer, prayerWallSharing: e.target.value })}
                >
                  <option value="anonymous">Post as Anonymous</option>
                  <option value="myName">Post with My Name</option>
                </select>
                <input
                  type="text"
                  placeholder="Contact (Optional)"
                  value={newPrayer.contact}
                  onChange={(e) => setNewPrayer({ ...newPrayer, contact: e.target.value })}
                />
                <button type="submit">Post Prayer</button>
              </form>
              <button onClick={() => setIsModalOpen(false)}>Close</button> {/* Close the modal */}
            </div>
          </div>
        )}

        {/* Prayer List */}
        {loading ? (
          <p>Loading prayers...</p>
        ) : (
          prayers.map((prayer) => (
            <div className="prayer-box" key={prayer._id}>
              <div className="prayer-header">
                <img
                  src={
                    prayer.prayerWallSharing === "anonymous"
                      ? "/public/../../../../EPAROKYA-SYST.png"
                      : prayer.user.profilePicture
                  }
                  alt="Profile"
                  className="avatar"
                />
                <span>{prayer.prayerWallSharing === "anonymous" ? "Anonymous" : prayer.user.name}</span>
              </div>
              <h4 className="prayer-title">{prayer.title}</h4>
              <p className="prayer-description">{prayer.prayerRequest}</p>
              <div className="prayer-actions">
                <button onClick={() => handleLike(prayer._id)}>
                  {prayer.likedByUser ? "Unlike" : "Like"} ({prayer.likes || 0})
                </button>
                <button
                  onClick={() => handleInclude(prayer._id)}
                  disabled={prayer.includedByUser}
                >
                  Include ({prayer.includes || 0})
                </button>
                <span className="included-count">
                  Users who have included and prayed for you: {prayer.includes || 0}
                </span>
              </div>
              <div className="prayer-meta">
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
