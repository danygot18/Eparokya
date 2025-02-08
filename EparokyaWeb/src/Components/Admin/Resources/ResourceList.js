import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "../../Layout/styles/style.css";
import SideBar from '../SideBar';

const AdminResourceList = () => {
    const [resources, setResources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const resourcesPerPage = 10; // Adjust the number of items per page
    const navigate = useNavigate();

    useEffect(() => {
        fetchResources();
        fetchCategories();
    }, [currentPage]);

    const fetchResources = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllResource`);
    
            if (!response.data || !Array.isArray(response.data.data)) {
                console.error("Invalid API response format:", response.data);
                setResources([]);
                return;
            }
    
            const sortedResources = response.data.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt) 
            );
    
            setResources(sortedResources);
        } catch (error) {
            console.error("Error fetching resources:", error);
            setResources([]); 
        }
    };
    
    

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllResourceCategory`);
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
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API}/api/v1/deleteResource/${id}`);
                setResources(resources.filter((r) => r._id !== id));
            } catch (error) {
                console.error('Error deleting resource:', error);
            }
        }
    };

    const toggleFeatured = async (id, isFeatured) => {
        try {
            await axios.put(`${process.env.REACT_APP_API}/api/v1/update/resource/${id}`, { isFeatured: !isFeatured });
            setResources(
                resources.map((r) =>
                    r._id === id ? { ...r, isFeatured: !isFeatured } : r
                )
            );
        } catch (error) {
            console.error('Error updating resource feature status:', error);
        }
    };

    const filteredResources = resources
        .filter((r) =>
            selectedCategory ? r.resourceCategory?._id === selectedCategory : true
        )
        .filter(
            (r) =>
                r.title.toLowerCase().includes(searchQuery) ||
                r.description.toLowerCase().includes(searchQuery)
        );

    const indexOfLastResource = currentPage * resourcesPerPage;
    const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
    const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);
    const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);

    return (
        <div className="resource-list">
            <SideBar />
            <div className="resource-container">
                <h2 className="text-2xl font-bold mb-4 text-center">Resources List</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center">
                    {currentResources.map((resource) => (
                        <div className="resource-box" key={resource._id}>
                            <div className="resource-header">
                                <img
                                    src="/public/../../../../EPAROKYA-SYST.png"
                                    alt="Saint Joseph Parish"
                                    className="profile-pic"
                                />
                                <div>
                                    <h3>{resource.title}</h3>
                                    <p>
                                        Created on:{" "}
                                        {new Date(resource.dateCreated).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="actions">
                                    <FaEdit
                                        onClick={() =>
                                            navigate(`/admin/updateResourcePage/${resource._id}`)
                                        }
                                    />
                                    <FaTrash onClick={() => handleDelete(resource._id)} />
                                </div>
                            </div>

                            {/* Resource Body */}
                            <div className="resource-body">
                                <p>{resource.description}</p>
                                {resource.images && Array.isArray(resource.images) && resource.images.length > 0 ? (
                                    <div className="image-slider">
                                        {resource.images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img.url}
                                                alt={`Slide ${index + 1}`}
                                                onClick={() => setPreviewImage(img.url)}
                                            />
                                        ))}
                                    </div>
                                ) : resource.image ? (
                                    <img
                                        src={resource.image.url}
                                        alt="Resource"
                                        className="single-image"
                                    />
                                ) : null}
                            </div>

                            {/* Resource Footer */}
                            <div className="resource-footer">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={resource.isFeatured}
                                        onChange={() =>
                                            toggleFeatured(resource._id, resource.isFeatured)
                                        }
                                    />
                                    Featured
                                </label>
                                <p>Link: <a href={resource.link} target="_blank" rel="noopener noreferrer">{resource.link}</a></p>
                                <p>
                                    Category: {resource.resourceCategory?.name || "N/A"}
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

export default AdminResourceList;