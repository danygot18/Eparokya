import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SideBar from "../SideBar";
import "./ministryCategoryDetails.css";

const MinistryCategoryDetails = () => {
  const { id: ministryCategoryId } = useParams();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!ministryCategoryId) return;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/${ministryCategoryId}/getUsers`
        );
        setUsers(response.data.users || []); // Ensure data.users exists
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [ministryCategoryId]);

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ministry-category-details">
      <SideBar />

      {/* right side user list */}
      <div className="user-list-container">
        <h3 className="user-list-title">Members</h3>

        {/* Search */}
        <input
          type="text"
          placeholder="Search user..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* List of Users */}
        <div className="user-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="user-item">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                />
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
