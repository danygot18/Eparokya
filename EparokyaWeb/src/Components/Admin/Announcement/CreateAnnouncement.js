import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar from '../SideBar';
import { FaTrash } from 'react-icons/fa';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    Paper,
    Divider,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,

    IconButton,
    Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import VideocamIcon from '@mui/icons-material/Videocam';
import MetaData from '../../Layout/MetaData';

const StyledForm = styled('form')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(2),
}));

const FormSection = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const FileUploadContainer = styled(Box)(({ theme }) => ({
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const PreviewItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
}));

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
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <SideBar

            />
            <MetaData title="Create Announcement" />

            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
                <Paper elevation={3} sx={{ padding: 3, width: "100%", maxWidth: 900 }}>
                    <Typography variant="h4" gutterBottom>
                        Create New Announcement
                    </Typography>

                    {loading && <LinearProgress sx={{ mb: 2 }} />}

                    <StyledForm onSubmit={handleSubmit} encType="multipart/form-data">
                        <FormSection elevation={3}>
                            <Typography variant="h6" gutterBottom>
                                Basic Information
                            </Typography>

                            <Stack spacing={3}>
                                <TextField
                                    fullWidthr
                                    label="Title"
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter announcement title"
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Description"
                                    variant="outlined"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter short description"
                                    required
                                    multiline
                                    rows={3}
                                />

                                <TextField
                                    fullWidth
                                    label="Rich Description"
                                    variant="outlined"
                                    value={richDescription}
                                    onChange={(e) => setRichDescription(e.target.value)}
                                    placeholder="Enter rich description"
                                    required
                                    multiline
                                    rows={6}
                                />
                            </Stack>
                        </FormSection>

                        <FormSection elevation={3}>
                            <Typography variant="h6" gutterBottom>
                                Media
                            </Typography>

                            <Stack spacing={3}>
                                <div>
                                    <InputLabel>Images</InputLabel>
                                    <FileUploadContainer>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            id="image-upload"
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="image-upload">
                                            <Button variant="outlined" component="span">
                                                Upload Images
                                            </Button>
                                        </label>
                                        <FormHelperText>You can select multiple images</FormHelperText>
                                    </FileUploadContainer>

                                    {images.length > 0 && (
                                        <Box >
                                            <Typography variant="subtitle1" gutterBottom>
                                                Uploaded Images
                                            </Typography>

                                            <Box sx={{ width: '100%', overflow: 'hidden' }}>
                                                <TableContainer component={Paper} variant="outlined">
                                                    <Table size="small" aria-label="uploaded images table">
                                                        <TableHead>
                                                            <TableRow sx={{ bgcolor: (theme) => theme.palette.grey[100] }}>
                                                                <TableCell width={60}></TableCell>
                                                                <TableCell>File</TableCell>
                                                                <TableCell>Details</TableCell>
                                                                <TableCell width={80} align="right">Actions</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {images.map((image, index) => (
                                                                <TableRow
                                                                    key={index}
                                                                    hover
                                                                    sx={{
                                                                        '&:last-child td': { borderBottom: 0 },
                                                                        '& .MuiTableCell-root': { py: 1.5 }
                                                                    }}
                                                                >
                                                                    <TableCell>
                                                                        <Box sx={{
                                                                            width: 40,
                                                                            height: 40,
                                                                            bgcolor: 'divider',
                                                                            borderRadius: 1,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}>
                                                                            <ImageIcon />
                                                                        </Box>
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <Typography
                                                                            component="a"
                                                                            href={URL.createObjectURL(image)}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            sx={{
                                                                                fontWeight: 500,
                                                                                textDecoration: 'none',
                                                                                color: 'text.primary',
                                                                                '&:hover': { textDecoration: 'underline' }
                                                                            }}
                                                                        >
                                                                            Image Preview {index + 1}
                                                                        </Typography>
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {image.name}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {(image.size / 1024).toFixed(1)} KB
                                                                        </Typography>
                                                                    </TableCell>

                                                                    <TableCell align="right">
                                                                        <Tooltip title="Remove">
                                                                            <IconButton
                                                                                onClick={() => setImages(images.filter((img) => img !== image))}
                                                                                size="small"
                                                                                color="error"
                                                                                sx={{
                                                                                    '&:hover': {
                                                                                        backgroundColor: (theme) => theme.palette.error.light,
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <FaTrash fontSize={14} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Box>
                                        </Box>
                                    )}
                                </div>

                                <Divider />

                                <Box sx={{ mt: 3, width: '100%' }}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                                        Video Upload
                                    </Typography>

                                    <FileUploadContainer sx={{ mb: 3 }}>
                                        <input
                                            type="file"
                                            onChange={handleVideoUpload}
                                            accept="video/*"
                                            id="video-upload"
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="video-upload">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<VideoFileIcon />}
                                                sx={{ py: 1.5 }}
                                            >
                                                Select Video File
                                            </Button>
                                        </label>
                                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                            MP4, WebM or MOV. Max 100MB.
                                        </Typography>
                                    </FileUploadContainer>

                                    {video && (
                                        <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow sx={{ bgcolor: (theme) => theme.palette.grey[100] }}>
                                                        <TableCell width={60}></TableCell>
                                                        <TableCell>Video File</TableCell>
                                                        <TableCell>Details</TableCell>
                                                        <TableCell width={80} align="right">Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow hover>
                                                        <TableCell>
                                                            <Box sx={{
                                                                width: 40,
                                                                height: 40,
                                                                bgcolor: 'divider',
                                                                borderRadius: 1,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <VideocamIcon color="action" fontSize="small" />
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography
                                                                component="a"
                                                                href={URL.createObjectURL(video)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    textDecoration: 'none',
                                                                    color: 'text.primary',
                                                                    '&:hover': { textDecoration: 'underline' }
                                                                }}
                                                            >
                                                                {video.name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {(video.size / (1024 * 1024)).toFixed(2)} MB
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {video.type}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Tooltip title="Remove video">
                                                                <IconButton
                                                                    onClick={() => setVideo(null)}
                                                                    size="small"
                                                                    color="error"
                                                                    sx={{
                                                                        '&:hover': {
                                                                            backgroundColor: (theme) => theme.palette.error.light,
                                                                        }
                                                                    }}
                                                                >
                                                                    <FaTrash fontSize={14} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </Box>
                            </Stack>
                        </FormSection>

                        <FormSection elevation={3}>
                            <Typography variant="h6" gutterBottom>
                                Categorization
                            </Typography>

                            <Stack spacing={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        value={announcementCategory}
                                        onChange={(e) => setAnnouncementCategory(e.target.value)}
                                        label="Category"
                                        required
                                    >
                                        <MenuItem value="">
                                            <em>Select Category</em>
                                        </MenuItem>
                                        {categories.map((category) => (
                                            <MenuItem key={category._id} value={category._id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Tags"
                                    variant="outlined"
                                    value={tags.join(', ')}
                                    onChange={handleTagChange}
                                    placeholder="Enter tags, separated by commas"
                                    required
                                    helperText="Separate tags with commas"
                                />
                            </Stack>
                        </FormSection>

                        <FormSection elevation={3}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Checkbox
                                    checked={isFeatured}
                                    onChange={() => setIsFeatured(!isFeatured)}
                                    inputProps={{ 'aria-label': 'Featured announcement' }}
                                />
                                <Typography variant="body1">Featured Announcement</Typography>
                            </Stack>
                        </FormSection>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Create Announcement'}
                            </Button>
                        </Box>
                    </StyledForm>
                </Paper>
            </Box>

        </Box >
    );
};

export default CreateAnnouncement;