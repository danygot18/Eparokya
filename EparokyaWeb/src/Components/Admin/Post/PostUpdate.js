import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../Layout/Loader';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SideBar from '../SideBar';
import { FaTrash } from 'react-icons/fa'; // Import delete icon

export const PostUpdate = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState('');
    const [images, setImages] = useState([]); // To handle new image uploads
    const [existingImages, setExistingImages] = useState([]); // Existing images from the post
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const config = {
        withCredentials: true,
    };

    useEffect(() => {
        // Fetch the existing post data
        const fetchPost = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/post/${id}`, config);
                setName(data.post.name);
                setDescription(data.post.description);
                setExistingImages(data.post.images); // Set existing images
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Error fetching post data:', error);
                toast.error('Error loading post data.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }
        };

        fetchPost();
    }, [id]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Preview the newly selected images
        const newImagePreviews = files.map(file => URL.createObjectURL(file));
        setExistingImages([...existingImages, ...newImagePreviews]);
    };

    // Function to handle image delete
    const handleImageDelete = (index) => {
        const updatedImages = [...existingImages];
        updatedImages.splice(index, 1); // Remove the image at the specified index
        setExistingImages(updatedImages); // Update the existing images state
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
            await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/post/${id}`, formData, config, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setLoading(false);
            toast.success('Post updated successfully.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
            navigate('/admin/postlist');
        } catch (error) {
            setLoading(false);
            console.error('Error updating post:', error);
            toast.error('Error updating post.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
        }
    };

    return (
        <div style={styles.wrapper}>
            <SideBar />
            <div style={styles.container}>
                <h2 style={styles.title}>Edit Post</h2>
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
                        <label style={styles.label}>Current Images:</label>
                        <div style={styles.imagePreviewContainer}>
                            {existingImages.map((image, index) => (
                                <div key={index} style={styles.imagePreviewWrapper}>
                                    <img src={image.url || image} alt="Existing Post" style={styles.imagePreview} />
                                    <FaTrash 
                                        onClick={() => handleImageDelete(index)} 
                                        style={styles.deleteIcon}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Upload New Images:</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleImageChange}
                            style={styles.fileInput}
                        />
                    </div>

                    <button type="submit" style={styles.submitButton} disabled={loading}>
                        {loading ? 'Updating...' : 'Update Post'}
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
        alignItems: 'flex-start',
    },
    container: {
        flex: 1,
        maxWidth: '700px',
        margin: '40px auto 0 auto',
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
    imagePreviewContainer: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
    },
    imagePreviewWrapper: {
        position: 'relative',
    },
    imagePreview: {
        width: '80px',
        height: '80px',
        borderRadius: '6px',
        objectFit: 'cover',
    },
    deleteIcon: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        color: '#fff',
        backgroundColor: '#e74c3c',
        borderRadius: '50%',
        padding: '5px',
        cursor: 'pointer',
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
    }
};

export default PostUpdate;
