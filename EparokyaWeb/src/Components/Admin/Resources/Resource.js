import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar from '../SideBar';
import { FaTrash } from 'react-icons/fa';

const Resource = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [resourceCategory, setResourceCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Media states
  const [file, setFile] = useState(null); // single file upload (raw file)
  const [image, setImage] = useState(null); // single image
  const [images, setImages] = useState([]); // multiple images
  const [videos, setVideos] = useState([]); // multiple videos

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch resource categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllResourceCategory`);
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Error fetching resource categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Handlers for file inputs
  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleMultipleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleVideosUpload = (e) => {
    const files = Array.from(e.target.files);
    setVideos(files);
  };

  const removeImageFromMultiple = (fileToRemove) => {
    setImages(images.filter((img) => img !== fileToRemove));
  };

  const removeVideoFromMultiple = (fileToRemove) => {
    setVideos(videos.filter((vid) => vid !== fileToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('link', link);
    formData.append('resourceCategory', resourceCategory);

    if (file) {
      formData.append('file', file);
    }
    if (image) {
      formData.append('image', image);
    }
    if (images.length > 0) {
      images.forEach((img) => {
        formData.append('images', img);
      });
    }
    if (videos.length > 0) {
      videos.forEach((vid) => {
        formData.append('videos', vid);
      });
    }

    try {
      await axios.post(`${process.env.REACT_APP_API}/api/v1/createResource`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin/resourceList');
    } catch (error) {
      console.error('Error creating resource:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar 
        categories={categories} 
        selectedCategory={resourceCategory} 
        setSelectedCategory={setResourceCategory} 
      />
  
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Create Resource</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter resource title"
              required
            />
          </div>
  
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter resource description"
              required
            />
          </div>
  
          <div className="form-group">
            <label>Link</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter resource link (URL)"
              required
            />
          </div>
  
          <div className="form-group">
            <label>Upload File (Optional)</label>
            <input
              type="file"
              onChange={handleFileUpload}
              accept="*/*"
            />
            {file && (
              <div>
                <p>File selected: {file.name}</p>
              </div>
            )}
          </div>
  
          <div className="form-group">
            <label>Upload Single Image (Optional)</label>
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
            />
            {image && (
              <div className="image-preview">
                <img src={URL.createObjectURL(image)} alt="Selected" width="150" />
              </div>
            )}
          </div>
  
          <div className="form-group">
            <label>Upload Multiple Images (Optional)</label>
            <input
              type="file"
              multiple
              onChange={handleMultipleImagesUpload}
              accept="image/*"
            />
            {images.length > 0 && (
              <div>
                <h4>Selected Images</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {images.map((img, index) => (
                    <div key={index} className="image-preview" style={{ marginRight: '10px' }}>
                      <img src={URL.createObjectURL(img)} alt={`Preview ${index + 1}`} width="150" />
                      <FaTrash 
                        style={{ cursor: 'pointer', color: 'red' }} 
                        onClick={() => removeImageFromMultiple(img)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
  
          <div className="form-group">
            <label>Upload Videos (Optional)</label>
            <input
              type="file"
              multiple
              onChange={handleVideosUpload}
              accept="video/*"
            />
            {videos.length > 0 && (
              <div>
                <h4>Selected Videos</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {videos.map((vid, index) => (
                    <div key={index} className="video-preview" style={{ marginRight: '10px' }}>
                      <video width="200" controls>
                        <source src={URL.createObjectURL(vid)} type="video/mp4" />
                      </video>
                      <FaTrash 
                        style={{ cursor: 'pointer', color: 'red' }} 
                        onClick={() => removeVideoFromMultiple(vid)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
  
          <div className="form-group">
            <label>Category</label>
            <select
              value={resourceCategory}
              onChange={(e) => setResourceCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
  
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default Resource;
