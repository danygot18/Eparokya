import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar from '../SideBar';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Stack,
  IconButton,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';

const Resource = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [resourceCategory, setResourceCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Media states
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      toast.success("Success creating resource")
      navigate('/admin/resourceList');
    } catch (error) {
      console.error('Error creating resource:', error);
       toast.success("Error creating resource")
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar 
        categories={categories} 
        selectedCategory={resourceCategory} 
        setSelectedCategory={setResourceCategory} 
      />
  
      <Container component="main" sx={{ flex: 1, p: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Create Resource
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
            <Stack spacing={3}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter resource title"
                required
                fullWidth
              />
              
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter resource description"
                required
                multiline
                rows={4}
                fullWidth
              />
              
              <TextField
                label="Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter resource link (URL)"
                required
                fullWidth
              />
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Upload File (Optional)
                </Typography>
                <Button variant="contained" component="label">
                  Choose File
                  <input type="file" hidden onChange={handleFileUpload} accept="*/*" />
                </Button>
                {file && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    File selected: {file.name}
                  </Typography>
                )}
              </Box>
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Upload Single Image (Optional)
                </Typography>
                <Button variant="contained" component="label">
                  Choose Image
                  <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                </Button>
                {image && (
                  <Box sx={{ mt: 2 }}>
                    <img src={URL.createObjectURL(image)} alt="Selected" width="150" />
                  </Box>
                )}
              </Box>
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Upload Multiple Images (Optional)
                </Typography>
                <Button variant="contained" component="label">
                  Choose Images
                  <input type="file" multiple hidden onChange={handleMultipleImagesUpload} accept="image/*" />
                </Button>
                {images.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Selected Images</Typography>
                    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', mt: 2 }}>
                      {images.map((img, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <img src={URL.createObjectURL(img)} alt={`Preview ${index + 1}`} width="150" />
                          <IconButton 
                            sx={{ position: 'absolute', top: 0, right: 0, color: 'error.main' }}
                            onClick={() => removeImageFromMultiple(img)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Upload Videos (Optional)
                </Typography>
                <Button variant="contained" component="label">
                  Choose Videos
                  <input type="file" multiple hidden onChange={handleVideosUpload} accept="video/*" />
                </Button>
                {videos.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Selected Videos</Typography>
                    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', mt: 2 }}>
                      {videos.map((vid, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <video width="200" controls>
                            <source src={URL.createObjectURL(vid)} type="video/mp4" />
                          </video>
                          <IconButton 
                            sx={{ position: 'absolute', top: 0, right: 0, color: 'error.main' }}
                            onClick={() => removeVideoFromMultiple(vid)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
              
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={resourceCategory}
                  onChange={(e) => setResourceCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">Select Category</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Submitting...' : 'Create Resource'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Resource;