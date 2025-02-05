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
    const [currentPage, setCurrentPage] = useState(1);
    const announcementsPerPage = 10; // Adjust the number of items per page
    const navigate = useNavigate();

    useEffect(() => {
        fetchAnnouncements();
        fetchCategories();
    }, [currentPage]);

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllAnnouncements`);
            const sortedAnnouncements = response.data.announcements.sort(
                (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated) // Sort latest first
            );
            setAnnouncements(sortedAnnouncements || []);
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

    // Apply filtering and pagination
    const filteredAnnouncements = announcements
        .filter((a) =>
            selectedCategory ? a.announcementCategory?._id === selectedCategory : true
        )
        .filter(
            (a) =>
                a.name.toLowerCase().includes(searchQuery) ||
                a.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
        );

    // Pagination logic
    const indexOfLastAnnouncement = currentPage * announcementsPerPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
    const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
    const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);

    return (
        <div className="announcement-list">
            <SideBar />
            <div className="announcement-container">
                <h2 className="text-2xl font-bold mb-4 text-center">Announcements</h2>

                {/* Display Announcements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center">
                    {currentAnnouncements.map((announcement) => (
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

                            {/* Announcement Body */}
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

                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-6">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="btn mx-2"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="btn mx-2"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminAnnouncementList;
