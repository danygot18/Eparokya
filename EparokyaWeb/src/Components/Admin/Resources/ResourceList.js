import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    Button,
    Pagination,
    Modal,
    Avatar,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import SideBar from '../SideBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { toast } from 'react-toastify';

const AdminResourceList = () => {
    const [resources, setResources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLink, setSelectedLink] = useState('');
    const [openLinkModal, setOpenLinkModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState(null);

    const resourcesPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        fetchResources();
        fetchCategories();
    }, [currentPage]);

    const fetchResources = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllResource`);

            if (!response.data || !Array.isArray(response.data.data)) {
                console.error("Invalid API response format:", response.data);
                setResources([]);
                return;
            }

            const sortedResources = response.data.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            console.log("Fetched resources:", response.data);
            setResources(sortedResources);
        } catch (error) {
            console.error("Error fetching resources:", error);
            setResources([]);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllResourceCategory`);
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const handleDeleteClick = (id) => {
        setResourceToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setResourceToDelete(null);
    };

    const handleDelete = async () => {
        if (!resourceToDelete) return;
        

        setDeleteLoading(true);
        try {
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/deleteResource/${resourceToDelete}`);
            setResources(resources.filter((r) => r._id !== resourceToDelete));
            setOpenDeleteDialog(false);
            toast.success("Success Deleting resource")
        } catch (error) {
            console.error('Error deleting resource:', error);
            toast.error("Error Deleting resource")
        } finally {
            setDeleteLoading(false);
            setResourceToDelete(null);
        }
    };

    const toggleFeatured = async (id, isFeatured) => {
        try {
            await axios.put(`${process.env.REACT_APP_API}/api/v1/update/resource/${id}`, { isFeatured: !isFeatured });
            setResources(
                resources.map((r) =>
                    r._id === id ? { ...r, isFeatured: !isFeatured } : r
                )
            );
            toast.success("Success updating resource feature status")
        } catch (error) {
            console.error('Error updating resource feature status:', error);
            toast.error("Error updating resource feature status")
        }
    };

    const filteredResources = resources
        .filter((r) =>
            selectedCategory ? r.resourceCategory?._id === selectedCategory : true
        )
        .filter(
            (r) =>
                r.title.toLowerCase().includes(searchQuery) ||
                r.description.toLowerCase().includes(searchQuery)
        );

    const indexOfLastResource = currentPage * resourcesPerPage;
    const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
    const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);
    const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);

    return (
        <Box sx={{ display: 'flex' }}>
            <SideBar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Resources List
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <TextField
                        label="Search Resources"
                        variant="outlined"
                        size="small"
                        onChange={handleSearch}
                        sx={{ width: 300 }}
                    />
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Filter by Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            label="Filter by Category"
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category._id} value={category._id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                        gap: 3,
                        mb: 4
                    }}
                >
                    {currentResources.map((resource) => (
                        <Card key={resource._id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardHeader
                                avatar={<Avatar src="/public/../../../../EPAROKYA-SYST.png" alt="Saint Joseph Parish" />}
                                action={
                                    <Box>
                                        <Button
                                            size="small"
                                            onClick={() => navigate(`/admin/updateResourcePage/${resource._id}`)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => handleDeleteClick(resource._id)}
                                            color="error"
                                        >
                                            <FaTrash />
                                        </Button>
                                    </Box>
                                }
                                title={resource.title}
                                subheader={`Created on: ${new Date(resource.createdAt).toLocaleDateString()}`}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {resource.description}
                                </Typography>
                                {resource.images && Array.isArray(resource.images) && resource.images.length > 0 ? (
                                    <Box sx={{ mt: 2 }}>
                                        {resource.images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img.url}
                                                alt={`Slide ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    marginBottom: '8px',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => setPreviewImage(img.url)}
                                            />
                                        ))}
                                    </Box>
                                ) : resource.image ? (
                                    <img
                                        src={resource.image.url}
                                        alt="Resource"
                                        style={{ width: '100%', height: 'auto', marginTop: '8px' }}
                                    />
                                ) : null}
                            </CardContent>

                            <CardActions sx={{ justifyContent: 'space-between' }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={resource.isFeatured}
                                            onChange={() => toggleFeatured(resource._id, resource.isFeatured)}
                                        />
                                    }
                                    label="Featured"
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {resource.resourceCategory?.name || "N/A"}
                                </Typography>
                            </CardActions>

                            {resource.link && (
                                <Box sx={{ px: 2, pb: 2 }}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => {
                                            setSelectedLink(resource.link);
                                            setOpenLinkModal(true);
                                        }}
                                    >
                                        Link
                                    </Button>
                                </Box>
                            )}

                            <Box sx={{ px: 2, pb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Bookmarked by {resource.bookmarkedBy?.length || 0} user(s)
                                </Typography>
                            </Box>
                        </Card>
                    ))}
                </Box>

                {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                        color="primary"
                    />
                </Box> */}
                <div style={{ position: "relative", width: "50%", height: "100%", alignItems: "center", margin: "auto" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 2,
                            mt: 3,
                        }}
                    >
                        <div>
                            <Button
                                variant="outlined"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                startIcon={<ChevronLeftIcon />}
                            >
                                Previous
                            </Button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Typography variant="body1" color="text.secondary">
                                Page {currentPage} of {totalPages}
                            </Typography>
                        </div>



                        <div>
                            <Button
                                variant="outlined"
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
                                disabled={currentPage === totalPages}
                                endIcon={<ChevronRightIcon />}
                            >
                                Next
                            </Button>
                        </div>
                    </Box>
                </div>
                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Confirm Deletion
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this resource?
                            <br />
                            This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseDeleteDialog}
                            disabled={deleteLoading}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            color="error"
                            autoFocus
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Link Modal */}
                <Dialog open={openLinkModal} onClose={() => setOpenLinkModal(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Resource Link</DialogTitle>
                    <DialogContent>
                        {selectedLink ? (
                            <Typography>
                                <a href={selectedLink} target="_blank" rel="noopener noreferrer">
                                    {selectedLink}
                                </a>
                            </Typography>
                        ) : (
                            <Typography>No link available.</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenLinkModal(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default AdminResourceList;