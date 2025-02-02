import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar from '../SideBar';
import { FaTrash } from 'react-icons/fa';

const CreateAnnouncement = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [richDescription, setRichDescription] = useState('');
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);
    const [announcementCategory, setAnnouncementCategory] = useState('');
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isFeatured, setIsFeatured] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllannouncementCategory`);
                setCategories(response.data.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        setVideo(file);
    };

    const handleTagChange = (e) => {
        const newTags = e.target.value.split(',').map((tag) => tag.trim());
        setTags(newTags);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('richDescription', richDescription);
        formData.append('tags', tags);
        formData.append('announcementCategory', announcementCategory);
        formData.append('isFeatured', isFeatured);

        if (images.length > 0) {
            images.forEach((image) => {
                formData.append('images', image);
            });
        }

        if (video) {
            formData.append('video', video);
        }

        try {
            await axios.post(`${process.env.REACT_APP_API}/api/v1/create/announcement`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/admin/announcementList');
        } catch (error) {
            console.error('Error creating announcement:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-announcement">
            <SideBar categories={categories} selectedCategory={announcementCategory} setSelectedCategory={setAnnouncementCategory} />
            <div className="container">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter announcement title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter short description"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Rich Description</label>
                        <textarea
                            value={richDescription}
                            onChange={(e) => setRichDescription(e.target.value)}
                            placeholder="Enter rich description"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Images</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleImageUpload}
                            accept="image/*"
                        />
                        {images.length > 0 && (
                            <div>
                                <h4>Uploaded Images</h4>
                                {images.map((image, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={URL.createObjectURL(image)} alt={`Uploaded ${index + 1}`} />
                                        <FaTrash onClick={() => setImages(images.filter((img) => img !== image))} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Video</label>
                        <input
                            type="file"
                            onChange={handleVideoUpload}
                            accept="video/*"
                        />
                        {video && (
                            <div>
                                <h4>Uploaded Video</h4>
                                <video width="300" controls>
                                    <source src={URL.createObjectURL(video)} type="video/mp4" />
                                </video>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={announcementCategory}
                            onChange={(e) => setAnnouncementCategory(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Tags</label>
                        <input
                            type="text"
                            value={tags.join(', ')}
                            onChange={handleTagChange}
                            placeholder="Enter tags, separated by commas"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={isFeatured}
                                onChange={() => setIsFeatured(!isFeatured)}
                            />
                            Featured
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Create Announcement'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAnnouncement;
