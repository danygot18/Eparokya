// components/Post.js
import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../../Layout/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SideBar from '../SideBar';

export const Post = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const config = {
        withCredentials: true,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);

        images.forEach(image => {
            formData.append('images', image);
        });

        try {
            setLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/admin/post/create`, formData, config, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setLoading(false);
            console.log('Post created:', response.data);
            navigate('/admin/postlist');
            toast.success('Post Successfully Created.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            setLoading(false);
            console.error('Error creating post:', error);
            toast.error('Error creating post.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <div style={styles.wrapper}>
            <SideBar />
            <div style={styles.container}>
                <h2 style={styles.title}>Create a New Post</h2>
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
                        <label style={styles.label}>Images:</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleImageChange}
                            required
                            style={styles.fileInput}
                        />
                    </div>
                    <button type="submit" style={styles.submitButton} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        alignItems: 'flex-start', // This aligns items at the top
    },
    container: {
        flex: 1,
        maxWidth: '700px',
        margin: '40px auto 0 auto', // Adjusts the top margin to bring it closer to the top
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        fontSize: '26px',
        fontWeight: 'bold',
        marginBottom: '25px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '5px',
        fontWeight: '500',
    },
    input: {
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    textarea: {
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '16px',
        minHeight: '120px',
        resize: 'vertical',
    },
    fileInput: {
        fontSize: '16px',
        padding: '10px 0',
    },
    submitButton: {
        padding: '12px',
        borderRadius: '6px',
        backgroundColor: '#007bff',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    submitButtonHover: {
        backgroundColor: '#0056b3',
    }
};

export default Post;
