import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../SideBar';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Typography,
    TextField,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Container,
    Stack,
    CircularProgress,
    Avatar
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const CreateAnnouncementCategory = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllannouncementCategory`, {
                withCredentials: true,
            });

            if (response.data && Array.isArray(response.data.categories)) {
                setCategories(response.data.categories);
            } else {
                console.error('Unexpected data structure:', response.data);
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load announcement categories.');
        } finally {
            setLoading(false);
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
                    withCredentials: true,
                });
                toast.success('Announcement Category Updated Successfully.');
            } else {
                await axios.post(`${process.env.REACT_APP_API}/api/v1/create/announcementCategory`, formData, {
                    withCredentials: true,
                });
                toast.success('Announcement Category Created Successfully.');
            }
            setName('');
            setDescription('');
            setImages([]);
            setEditMode(false);
            setEditId(null);
            fetchCategories();
        } catch (error) {
            toast.error('Error while saving Announcement Category. Check your File Inputs');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (id) => {
        setSelectedId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedId(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedId) return;
         console.log("Deleting EventType ID:", selectedId);

        try {
            setDeleteLoading(true);
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/deleteAnnouncementCategory/${selectedId}`, {
                withCredentials: true,
            });
            toast.success('Announcement Category Deleted Successfully.');
            fetchCategories();
        } catch (error) {
            toast.error('Error deleting Announcement Category.');
        } finally {
            setDeleteLoading(false);
            handleCloseDialog();
        }
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setName('');
        setDescription('');
        setImages([]);
        setEditId(null);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <SideBar />
            <Container maxWidth="xl" sx={{ p: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    {/* Left Pane - Form */}
                    <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            {editMode ? 'Edit Announcement Category' : 'Create Announcement Category'}
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <Button
                                    variant="contained"
                                    component="label"
                                    disabled={loading}
                                >
                                    Upload Images
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        onChange={handleImageChange}
                                    />
                                </Button>
                                {images.length > 0 && (
                                    <Typography variant="body2">
                                        {images.length} file(s) selected
                                    </Typography>
                                )}
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                        fullWidth
                                    >
                                        {loading ? <CircularProgress size={24} /> : 'Submit'}
                                    </Button>
                                    {editMode && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleCancelEdit}
                                            fullWidth
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>
                        </form>
                    </Paper>

                    {/* Right Pane - Table */}
                    <Paper elevation={3} sx={{ p: 3, flex: 2 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Announcement Categories
                        </Typography>
                        <TextField
                            label="Search categories"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        {loading ? (
                            <Box display="flex" justifyContent="center" py={4}>
                                <CircularProgress />
                            </Box>
                        ) : categories.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="right">
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {categories
                                            .filter((category) =>
                                                category.name.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((category) => (
                                                <TableRow key={category._id} hover>
                                                    <TableCell>
                                                        <Avatar
                                                            src={
                                                                typeof category.image === 'string'
                                                                    ? category.image || ''
                                                                    : category.image?.url || ''
                                                            }
                                                            alt={category.name}
                                                            sx={{ width: 56, height: 56 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{category.name}</TableCell>

                                                    <TableCell align="right">
                                                        <div style={{  gap: '8px', maxWidth: '50px', }}>
                                                            <IconButton
                                                                onClick={() => {
                                                                    setEditMode(true);
                                                                    setEditId(category._id);
                                                                    setName(category.name);
                                                                    setDescription(category.description);
                                                                }}
                                                                color="primary"
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => handleOpenDialog(category._id)}
                                                                color="error"
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body1" color="textSecondary" py={2}>
                                No announcement categories found
                            </Typography>
                        )}
                    </Paper>
                </Stack>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Confirm Deletion
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this announcement category? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} disabled={deleteLoading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            color="error"
                            autoFocus
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default CreateAnnouncementCategory;