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
    Pagination,
    TablePagination,
    Avatar
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const ResourceCategory = () => {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/getAllResourceCategory`,
                { withCredentials: true }
            );

            if (Array.isArray(response.data.data)) {
                setCategories(response.data.data);
            } else {
                console.error('Unexpected response format:', response.data);
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load resource categories.');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            toast.error('Name is required.');
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                `${process.env.REACT_APP_API}/api/v1/createResourceCategory`,
                { name },
                { withCredentials: true }
            );
            toast.success('Resource category created successfully.');
            setName('');
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

        try {
            setDeleteLoading(true);
            await axios.delete(
                `${process.env.REACT_APP_API}/api/v1/deleteResourceCategory/${selectedId}`,
                { withCredentials: true }
            );
            toast.success('Resource category deleted successfully.');
            fetchCategories();
        } catch (error) {
            console.error('Delete Error:', error);
            toast.error('Failed to delete the resource category.');
        } finally {
            setDeleteLoading(false);
            handleCloseDialog();
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <SideBar />
            <Container maxWidth="xl" sx={{ p: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    {/* Left Pane - Form */}
                    <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Create Resource Category
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
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading || !name.trim()}
                                        fullWidth
                                    >
                                        {loading ? <CircularProgress size={24} /> : 'Submit'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => navigate('/admin/dashboard')}
                                        fullWidth
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </Stack>
                        </form>
                    </Paper>

                    {/* Right Pane - Table */}
                    <Paper elevation={3} sx={{ p: 3, flex: 2 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Resource Category Name List
                        </Typography>
                        <TextField
                            label="Search"
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
                        ) : filteredCategories.length > 0 ? (
                            <>
                                <TableContainer>
                                    <Table>
                                        {/* <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead> */}
                                        <TableBody>

                                            {filteredCategories
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((category) => (
                                                    <TableRow key={category._id} hover>
                                                        <TableCell>{category.name}</TableCell>
                                                        <TableCell alignItem='right'>
                                                            <div style={{ gap: '8px', maxWidth: '50px', }}>
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
                                <div style={{ position: "relative", width: "40%", height: "100%", alignItems: "center", margin: "auto" }}>
                                    <Pagination
                                        sx={{
                                            transform: "scale(0.7)",
                                            padding: 2,
                                            '& .MuiPagination-ul': {
                                                gap: '9px', // This adds space between all pagination items
                                            },
                                            '& .MuiPaginationItem-root': {
                                                margin: 0, // Remove default margins if needed
                                            },
                                        }}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </div>
                            </>
                        ) : (
                            <Typography variant="body1" color="textSecondary" py={2}>
                                No resource categories found
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
                            Are you sure you want to delete this resource category? This action cannot be undone.
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

export default ResourceCategory;