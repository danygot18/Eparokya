import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SideBar from "../SideBar";
import "./ministryCategoryDetails.css";

const MinistryCategoryDetails = () => {
  const { id: ministryCategoryId } = useParams();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    title: "",
    description: "",
    tags: "",
    notedBy: "",
    isPinned: false,
    images: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!ministryCategoryId) return;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/${ministryCategoryId}/getUsers`
        );
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [ministryCategoryId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAnnouncementData({ ...announcementData, images: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (
      !announcementData.title || 
      !announcementData.description || 
      !announcementData.tags || 
      !announcementData.notedBy
    ) {
      alert("All fields are required.");
      return;
    }
  
    try {
      const formData = new FormData();
      
      Object.entries(announcementData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value)); 
        } else {
          formData.append(key, value);
        }
      });
  
      formData.append('ministryCategory', ministryCategoryId);
  
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/ministryAnnouncementCreate/${ministryCategoryId}`,
        formData, 
        { withCredentials: true }
      );
  
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };
  

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ministry-category-details">
      <SideBar />

      <div className="ministryCategoryDetails-middlePane">
        <button className="add-announcement-btn" onClick={() => setIsModalOpen(true)}>
          Add Announcement
        </button>

        {isModalOpen && (
          <div className="announcement-modal">
            <h3>Create Announcement</h3>
            <input type="text" placeholder="Title" value={announcementData.title} onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })} />
            <textarea placeholder="Description" value={announcementData.description} onChange={(e) => setAnnouncementData({ ...announcementData, description: e.target.value })} />
            <input type="text" placeholder="Tags (comma-separated)" value={announcementData.tags} onChange={(e) => setAnnouncementData({ ...announcementData, tags: e.target.value })} />
            <input type="text" placeholder="Noted By" value={announcementData.notedBy} onChange={(e) => setAnnouncementData({ ...announcementData, notedBy: e.target.value })} />
            <button className={`pin-btn ${announcementData.isPinned ? 'pinned' : 'unpinned'}`} onClick={() => setAnnouncementData({ ...announcementData, isPinned: !announcementData.isPinned })}>
              {announcementData.isPinned ? 'Pinned' : 'Unpinned'}
            </button>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        )}
      </div>

      <div className="user-list-container">
        <h3 className="user-list-title">Members</h3>
        <input
          type="text"
          placeholder="Search user..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="user-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="user-item">
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <span className="user-name">{user.name}</span>
              </div>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinistryCategoryDetails;
