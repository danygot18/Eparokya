import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SideBar from '../SideBar';
import '@fortawesome/fontawesome-free/css/all.min.css';

const styles = {
    wrapper: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#e8f5e9',
    },
    content: {
        display: 'flex',
        flex: 1,
        padding: '20px',
        gap: '40px',
    },
    leftPane: {
        flex: 1,
        backgroundColor: '#d9ead3',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    rightPane: {
        flex: 2,
        backgroundColor: '#d9ead3',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '5px',
        fontSize: '16px',
    },
    input: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    textarea: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '16px',
        minHeight: '80px',
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
    },
    submitButton: {
        flex: 1,
        padding: '10px',
        borderRadius: '6px',
        backgroundColor: '#388e3c',
        color: '#fff',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
    },
    cancelButton: {
        flex: 1,
        padding: '10px',
        borderRadius: '6px',
        backgroundColor: '#d32f2f',
        color: '#fff',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
    },
    searchInput: {
        padding: '10px',
        width: '100%',
        borderRadius: '6px',
        border: '1px solid #ccc',
        marginBottom: '20px',
        fontSize: '16px',
    },
    listTitle: {
        marginBottom: '10px',
        fontSize: '20px',
        fontWeight: 'bold',
    },
    list: {
        listStyleType: 'none',
        padding: '0',
        marginBottom: '20px',
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        borderBottom: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#e6f4e9',
        marginBottom: '10px',
        fontSize: '16px',
    },
    categoryText: {
        flex: 1,
        marginRight: '15px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
    },
    editButton: {
        padding: '6px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#2e7d32',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '14px',
    },
    deleteButton: {
        padding: '6px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#c62828',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '14px',
    },
    imageContainer: {
        marginRight: '10px',
        width: '50px',
        height: '50px',
        overflow: 'hidden',
        borderRadius: '50%',
        border: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    categoryImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },

}

const CreateAnnouncementCategory = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const navigate = useNavigate();
    // const API_URL = process.env.REACT_APP_API || 'http://localhost:5000';

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllannouncementCategory`, {
                withCredentials: true,
            });

            console.log('Fetched categories:', response.data);

            // Ensure we extract the categories array correctly
            if (response.data && Array.isArray(response.data.categories)) {
                setCategories(response.data.categories);
            } else {
                console.error('Unexpected data structure:', response.data);
                setCategories([]); // Set default empty array to avoid errors
            }

        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load announcement categories.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        images.forEach((image) => formData.append('images', image));

        try {
            setLoading(true);
            if (editMode) {
                await axios.put(`${process.env.REACT_APP_API}/api/v1/updateAnnouncementCategory/${editId}`, formData, {
                    // headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });
                toast.success('Announcement Category Updated Successfully.');
            } else {
                await axios.post(`${process.env.REACT_APP_API}/api/v1/create/announcementCategory`, formData, {
                    //headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });
                toast.success('Announcement Category Created Successfully.');
            }
            setLoading(false);
            setName('');
            setDescription('');
            setImages([]);
            setEditMode(false);
            setEditId(null);
            fetchCategories();
        } catch (error) {
            setLoading(false);
            toast.error('Error while saving Announcement Category.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/deleteAnnouncementCategory/${id}`, {
                withCredentials: true,
            });
            toast.success('Announcement Category Deleted Successfully.');
            fetchCategories();
        } catch (error) {
            toast.error('Error deleting Announcement Category.');
        }
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    return (
        <div style={styles.wrapper}>
            <SideBar />
            <div style={styles.content}>
                <div style={styles.leftPane}>
                    <h2 style={styles.title}>
                        {editMode ? 'Edit Announcement Category' : 'Create Announcement Category'}
                    </h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description:</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                style={styles.textarea}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Choose Images:</label>
                            <input
                                type="file"
                                multiple
                                onChange={handleImageChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.buttonGroup}>
                            <button
                                type="submit"
                                style={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Submit'}
                            </button>
                            {editMode && (
                                <button
                                    type="button"
                                    style={styles.cancelButton}
                                    onClick={() => {
                                        setEditMode(false);
                                        setName('');
                                        setDescription('');
                                        setImages([]);
                                        setEditId(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <div style={styles.rightPane}>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    <h2 style={styles.listTitle}>Categories</h2>
                    <ul style={styles.list}>
                        {categories
                            .filter((category) =>
                                category.name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((category) => (
                                <li key={category._id} style={styles.listItem}>
                                    <div style={styles.imageContainer}>
                                        <img
                                            src={
                                                typeof category.image === 'string'
                                                    ? category.image || 'default-image-url.jpg'  // Mobile string image
                                                    : category.image?.url || 'default-image-url.jpg'  // Web object image
                                            }
                                            alt={category.name}
                                            style={styles.categoryImage}
                                        />
                                    </div>
                                    <div style={styles.categoryText}>{category.name}</div>
                                    <div style={styles.buttonContainer}>
                                        <button
                                            style={styles.editButton}
                                            onClick={() => {
                                                setEditMode(true);
                                                setEditId(category._id);
                                                setName(category.name);
                                                setDescription(category.description);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            style={styles.deleteButton}
                                            onClick={() => handleDelete(category._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                    </ul>


                </div>
            </div>
        </div>
    );
};


export default CreateAnnouncementCategory;
