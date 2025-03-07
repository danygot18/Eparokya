import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SideBar from '../SideBar';
import '@fortawesome/fontawesome-free/css/all.min.css';

const MinistryCategory = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const itemsPerPage = 5;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`, {
                withCredentials: true,
            });
    
            console.log("Fetched categories:", response.data);
            // Ensure we're extracting the array properly
            setCategories(response.data.categories || []); 
        } catch (error) {
            toast.error('Failed to load ministry categories.');
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description) {
            toast.error('Both name and description are required.');
            return;
        }

        const formData = { name, description };

        try {
            setLoading(true);

            if (editMode) {
                await axios.put(
                    `${process.env.REACT_APP_API}/api/v1/ministryCategory/updateMinistryCategory/${editId}`,
                    formData,
                    { withCredentials: true }
                );
                toast.success('Ministry category updated successfully.');
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API}/api/v1/ministryCategory/ministryCategory/create`,
                    formData,
                    { withCredentials: true }
                );
                toast.success('Ministry category created successfully.');
            }

            setName('');
            setDescription('');
            setEditMode(false); 
            setEditId(null);
            fetchCategories();
        } catch (error) {
            console.error('Submission Error:', error);
            toast.error(
                error.response?.data?.message || 'There was an error submitting the form.'
            );
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (ministryId) => {
        if (!window.confirm('Are you sure you want to delete this ministry?')) {
            return;
        }

        try {
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/ministryCategory/deleteMinistryCategory/${ministryId}`, {
                withCredentials: true,
            });
            toast.success('Ministry category deleted successfully.');
            fetchCategories();
        } catch (error) {
            console.error('Delete Error:', error);
            toast.error('Failed to delete the ministry category.');
        }
    };

    const handleEdit = (category) => {
        setName(category.name);
        setDescription(category.description);
        setEditMode(true);
        setEditId(category._id);
    };

    const handleCardClick = (ministryId) => {
        navigate(`/admin/ministryCategoryDetails/${ministryId}`);
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div style={styles.wrapper}>
            <SideBar />
            <div style={styles.content}>
                <div style={styles.leftPane}>
                    <h2 style={styles.title}>Create Ministry</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={styles.textarea}
                            />
                        </div>
                        <div style={styles.buttonGroup}>
                            <button type="submit" style={styles.submitButton} disabled={loading}>
                                {loading ? 'Creating...' : 'Submit'}
                            </button>
                            <button
                                type="button"
                                style={styles.cancelButton}
                                onClick={() => navigate('/home')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <div style={styles.rightPane}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    {/*  ministry list */}
                    <h3 style={styles.listTitle}>Ministry Category List</h3>
                    <ul style={styles.list}>
                        {currentItems.length > 0 ? (
                            currentItems.map((category) => (
                                <li key={category._id} style={styles.listItem} onClick={() => handleCardClick(category._id)}>
                                    <span style={styles.categoryText}>
                                        <strong>{category.name}</strong>: {category.description}
                                    </span>
                                    <div style={styles.buttonContainer}>
                                        <button
                                            style={styles.editButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(category);
                                            }}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            style={styles.deleteButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(category._id);
                                            }}
                                        >
                                            <i className="fas fa-trash-alt"></i> 
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p style={styles.noData}>No ministry categories found.</p>
                        )}
                    </ul>

                    {/* pagination  */}
                    <div style={styles.pagination}>
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            style={styles.paginationButton}
                        >
                            &lt; Previous
                        </button>
                        <span style={styles.paginationText}>
                            {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            style={styles.paginationButton}
                        >
                            Next &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
            padding: '10px',
            borderBottom: '1px solid #ccc',
        },
        pagination: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px 0',
        },
        paginationButton: {
            padding: '5px 10px',
            border: 'none',
            backgroundColor: '#d9ead3',
            cursor: 'pointer',
            fontSize: '16px',
        },

        paginationText: {
            fontSize: '16px',
            fontWeight: 'bold',
        },
        actions: {
            marginTop: '10px',
            display: 'flex',
            gap: '10px',
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
    };

export default MinistryCategory;