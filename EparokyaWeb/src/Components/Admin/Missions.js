import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Box,
    Button,
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
    Tooltip,
    Checkbox
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import MetaData from '../Layout/MetaData';

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

const CreateMission = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [singleImage, setSingleImage] = useState(null);
    const [multipleImages, setMultipleImages] = useState([]);
    const [facilitators, setFacilitators] = useState(['']);
    const [volunteers, setVolunteers] = useState(['']);
    const [ministries, setMinistries] = useState([]);
    const [selectedMinistries, setSelectedMinistries] = useState([]);
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [budget, setBudget] = useState('');
    const [budgetFrom, setBudgetFrom] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMinistries = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`);
                setMinistries(res.data.categories || []);
            } catch (err) {
                setMinistries([]);
            }
        };
        fetchMinistries();
    }, []);

    const handleSingleImageUpload = (e) => {
        setSingleImage(e.target.files[0]);
    };

    const handleMultipleImagesUpload = (e) => {
        setMultipleImages(Array.from(e.target.files));
    };

    const handleFacilitatorChange = (idx, value) => {
        const updated = [...facilitators];
        updated[idx] = value;
        setFacilitators(updated);
    };

    const addFacilitator = () => setFacilitators([...facilitators, '']);
    const removeFacilitator = (idx) => setFacilitators(facilitators.filter((_, i) => i !== idx));

    const handleVolunteerChange = (idx, value) => {
        const updated = [...volunteers];
        updated[idx] = value;
        setVolunteers(updated);
    };

    const addVolunteer = () => setVolunteers([...volunteers, '']);
    const removeVolunteer = (idx) => setVolunteers(volunteers.filter((_, i) => i !== idx));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Description', description);
        formData.append('Location', location);
        if (singleImage) formData.append('Image[single]', singleImage);
        multipleImages.forEach(img => formData.append('Image[multiple]', img));
        facilitators.forEach(f => formData.append('Facilitators[]', f));
        volunteers.forEach(v => formData.append('Volunteers[]', v));
        selectedMinistries.forEach(m => formData.append('Ministry[]', m));
        formData.append('Budget', budget);
        formData.append('BudgetFrom', budgetFrom);
        formData.append('Author', author);
        formData.append('Date', date);
        formData.append('Time', time);

        try {
            await axios.post(`${process.env.REACT_APP_API}/api/v1/createMission`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Mission created successfully!');
            setTimeout(() => navigate('/admin/missionList'), 1500);
        } catch (err) {
            toast.error('Failed to create mission. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <ToastContainer position="top-right" autoClose={2000} />
            <SideBar />
            <MetaData title="Create Mission" />
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
                <Paper elevation={3} sx={{ padding: 3, width: "100%", maxWidth: 900 }}>
                    <Typography variant="h4" gutterBottom>
                        Create New Mission
                    </Typography>
                    {loading && <LinearProgress sx={{ mb: 2 }} />}
                    <StyledForm onSubmit={handleSubmit} encType="multipart/form-data">
                        <FormSection elevation={3}>
                            <Typography variant="h6" gutterBottom>Basic Information</Typography>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    variant="outlined"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    variant="outlined"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    required
                                    multiline
                                    rows={3}
                                />
                                <TextField
                                    fullWidth
                                    label="Location"
                                    variant="outlined"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    required
                                />
                            </Stack>
                        </FormSection>
                        <FormSection elevation={3}>
                            <Typography variant="h6" gutterBottom>Budget Information</Typography>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Budget"
                                    variant="outlined"
                                    value={budget}
                                    onChange={e => setBudget(e.target.value)}
                                />
                                <TextField
                                    fullWidth
                                    label="Budget From"
                                    variant="outlined"
                                    value={budgetFrom}
                                    onChange={e => setBudgetFrom(e.target.value)}
                                />
                            </Stack>
                        </FormSection>

                        <FormSection elevation={3}>
                            <Typography variant="h6" gutterBottom>Images</Typography>
                            <Stack spacing={3}>
                                <div>
                                    <InputLabel>Single Image</InputLabel>
                                    <FileUploadContainer>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleSingleImageUpload}
                                            id="single-image-upload"
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="single-image-upload">
                                            <Button variant="outlined" component="span">
                                                Upload Single Image
                                            </Button>
                                        </label>
                                        <FormHelperText>Only one image allowed</FormHelperText>
                                    </FileUploadContainer>
                                    {singleImage && (
                                        <PreviewItem>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ImageIcon sx={{ mr: 1 }} />
                                                <Typography variant="body2">{singleImage.name}</Typography>
                                            </Box>
                                            <Tooltip title="Remove">
                                                <IconButton color="error" onClick={() => setSingleImage(null)}>
                                                    <FaTrash fontSize={14} />
                                                </IconButton>
                                            </Tooltip>
                                        </PreviewItem>
                                    )}
                                </div>
                                <div>
                                    <InputLabel>Multiple Images</InputLabel>
                                    <FileUploadContainer>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleMultipleImagesUpload}
                                            id="multiple-images-upload"
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="multiple-images-upload">
                                            <Button variant="outlined" component="span">
                                                Upload Multiple Images
                                            </Button>
                                        </label>
                                        <FormHelperText>You can select multiple images</FormHelperText>
                                    </FileUploadContainer>
                                    {multipleImages.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle1" gutterBottom>Uploaded Images</Typography>
                                            <TableContainer component={Paper} variant="outlined">
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell width={60}></TableCell>
                                                            <TableCell>File</TableCell>
                                                            <TableCell>Details</TableCell>
                                                            <TableCell width={80} align="right">Actions</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {multipleImages.map((img, idx) => (
                                                            <TableRow key={idx} hover>
                                                                <TableCell>
                                                                    <Box sx={{
                                                                        width: 40, height: 40, bgcolor: 'divider', borderRadius: 1,
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                                    }}>
                                                                        <ImageIcon />
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography
                                                                        component="a"
                                                                        href={URL.createObjectURL(img)}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        sx={{
                                                                            fontWeight: 500,
                                                                            textDecoration: 'none',
                                                                            color: 'text.primary',
                                                                            '&:hover': { textDecoration: 'underline' }
                                                                        }}
                                                                    >
                                                                        Image Preview {idx + 1}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {img.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {(img.size / 1024).toFixed(1)} KB
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <Tooltip title="Remove">
                                                                        <IconButton
                                                                            onClick={() => setMultipleImages(multipleImages.filter((i) => i !== img))}
                                                                            size="small"
                                                                            color="error"
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
                                    )}
                                </div>
                            </Stack>
                        </FormSection>

                        <FormSection elevation={3}>
                            <Typography variant="h6" gutterBottom>Facilitators</Typography>
                            <Stack spacing={2}>
                                {facilitators.map((f, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <TextField
                                            fullWidth
                                            label={`Facilitator ${idx + 1}`}
                                            value={f}
                                            onChange={e => handleFacilitatorChange(idx, e.target.value)}
                                            required
                                        />
                                        <IconButton
                                            color="error"
                                            sx={{ ml: 1 }}
                                            onClick={() => removeFacilitator(idx)}
                                            disabled={facilitators.length === 1}
                                        >
                                            <FaTrash fontSize={14} />
                                        </IconButton>
                                    </Box>
                                ))}
                                <Button onClick={addFacilitator} variant="outlined" size="small">Add Facilitator</Button>
                            </Stack>
                        </FormSection>

                        <FormSection elevation={3}>
                            <Typography variant="h6" gutterBottom>Volunteers</Typography>
                            <Stack spacing={2}>
                                {volunteers.map((v, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <TextField
                                            fullWidth
                                            label={`Volunteer ${idx + 1}`}
                                            value={v}
                                            onChange={e => handleVolunteerChange(idx, e.target.value)}
                                            required
                                        />
                                        <IconButton
                                            color="error"
                                            sx={{ ml: 1 }}
                                            onClick={() => removeVolunteer(idx)}
                                            disabled={volunteers.length === 1}
                                        >
                                            <FaTrash fontSize={14} />
                                        </IconButton>
                                    </Box>
                                ))}
                                <Button onClick={addVolunteer} variant="outlined" size="small">Add Volunteer</Button>
                            </Stack>
                        </FormSection>

                        <FormSection elevation={3}>
                            <Typography variant="h6" gutterBottom>Ministry (optional)</Typography>
                            <FormControl component="fieldset" variant="standard">
                                <FormHelperText>Select one or more ministries (optional)</FormHelperText>
                                <Stack direction="column" spacing={1}>
                                    {[...ministries]
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map((ministry) => (
                                            <Box key={ministry._id} sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Checkbox
                                                    checked={selectedMinistries.includes(ministry._id)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setSelectedMinistries([...selectedMinistries, ministry._id]);
                                                        } else {
                                                            setSelectedMinistries(selectedMinistries.filter(id => id !== ministry._id));
                                                        }
                                                    }}
                                                    value={ministry._id}
                                                    id={`ministry-checkbox-${ministry._id}`}
                                                />
                                                <label htmlFor={`ministry-checkbox-${ministry._id}`}>{ministry.name}</label>
                                            </Box>
                                        ))}
                                </Stack>
                            </FormControl>
                        </FormSection>

                        <FormSection elevation={3}>
                            <Typography variant="h6" gutterBottom>Date & Time</Typography>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="Date"
                                    type="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    fullWidth
                                    helperText="Select or enter a date"
                                />
                                <TextField
                                    label="Time"
                                    type="time"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    fullWidth
                                    helperText="Select or enter a time"
                                />
                            </Stack>
                        </FormSection>

                        <FormSection elevation={3}>
                            <TextField
                                fullWidth
                                label="Author"
                                variant="outlined"
                                value={author}
                                onChange={e => setAuthor(e.target.value)}
                                required
                                helperText="This will be displayed in italic"
                            />
                        </FormSection>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Create Mission'}
                            </Button>
                        </Box>
                    </StyledForm>
                </Paper>
            </Box>
        </Box>
    );
};

export default CreateMission;