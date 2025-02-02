import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "../../Layout/styles/style.css";
import SideBar from '../SideBar';

const AdminAnnouncementList = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllAnnouncements`);
                setAnnouncements(response.data.announcements || []);
            } catch (error) {
                console.error('Error fetching announcements:', error);
                setAnnouncements([]);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllannouncementCategory`);
                setCategories(response.data.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        };

        fetchAnnouncements();
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API}/api/v1/delete/announcement/${id}`);
                setAnnouncements(announcements.filter((a) => a._id !== id));
            } catch (error) {
                console.error('Error deleting announcement:', error);
            }
        }
    };

    const toggleFeatured = async (id, isFeatured) => {
        try {
            await axios.put(`${process.env.REACT_APP_API}/api/v1/update/announcement/${id}`, { isFeatured: !isFeatured });
            setAnnouncements(
                announcements.map((a) =>
                    a._id === id ? { ...a, isFeatured: !isFeatured } : a
                )
            );
        } catch (error) {
            console.error('Error updating announcement feature status:', error);
        }
    };

    const filteredAnnouncements = announcements
        .filter((a) =>
            selectedCategory ? a.announcementCategory?._id === selectedCategory : true
        )
        .filter(
            (a) =>
                a.name.toLowerCase().includes(searchQuery) ||
                a.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
        );

    return (
        <div className="announcement-list">
            <SideBar />
            <div className="announcement-container">
                {filteredAnnouncements.map((announcement) => (
                    <div className="announcement-box" key={announcement._id}>
                        {/* Announcement Header */}
                        <div className="announcement-header">
                            <img
                                src="/public/../../../../EPAROKYA-SYST.png"
                                alt="Saint Joseph Parish"
                                className="profile-pic"
                            />
                            <div>
                                <h3>{announcement.name}</h3>
                                <p>
                                    Created on:{" "}
                                    {new Date(announcement.dateCreated).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="actions">
                                <FaEdit
                                    onClick={() =>
                                        navigate(`/admin/updateAnnouncementPage/${announcement._id}`)
                                    }
                                />
                                <FaTrash onClick={() => handleDelete(announcement._id)} />
                            </div>
                        </div>

                        <div className="announcement-body">
                            <p>{announcement.description}</p>
                            <p className="rich-description">{announcement.richDescription}</p>
                            {announcement.images && Array.isArray(announcement.images) && announcement.images.length > 0 ? (
                                <div className="image-slider">
                                    {announcement.images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img.url}
                                            alt={`Slide ${index + 1}`}
                                            onClick={() => setPreviewImage(img.url)}
                                        />
                                    ))}
                                </div>
                            ) : announcement.image ? (
                                <img
                                    src={announcement.image}
                                    alt="Announcement"
                                    className="single-image"
                                />
                            ) : null}
                        </div>

                        {/* Announcement Footer */}
                        <div className="announcement-footer">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={announcement.isFeatured}
                                    onChange={() =>
                                        toggleFeatured(announcement._id, announcement.isFeatured)
                                    }
                                />
                                Featured
                            </label>
                            <p>Tags: {announcement.tags.join(", ")}</p>
                            <p>
                                Category: {announcement.announcementCategory?.name || "N/A"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminAnnouncementList;
