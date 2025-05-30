import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Pagination,
  Divider,
  Stack,
  Container,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Search, Cancel, Check } from '@mui/icons-material';

const MinistryCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`,
        { withCredentials: true }
      );
      setCategories(response.data.categories || []);
    } catch (error) {
      toast.error('Failed to load ministry categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      toast.error('Both name and description are required.');
      return;
    }

    const formData = { name, description };

    try {
      setLoading(true);

      if (editMode) {
        await axios.put(
          `${process.env.REACT_APP_API}/api/v1/ministryCategory/updateMinistryCategory/${editId}`,
          formData,
          { withCredentials: true }
        );
        toast.success('Ministry category updated successfully.');
      } else {
        await axios.post(
          `${process.env.REACT_APP_API}/api/v1/ministryCategory/ministryCategory/create`,
          formData,
          { withCredentials: true }
        );
        toast.success('Ministry category created successfully.');
      }

      setName('');
      setDescription('');
      setEditMode(false);
      setEditId(null);
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

  const handleOpenDeleteDialog = (ministryId) => {
    setSelectedId(ministryId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      setDeleteLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/ministryCategory/deleteMinistryCategory/${selectedId}`,
        { withCredentials: true }
      );
      toast.success('Ministry category deleted successfully.');
      fetchCategories();
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error('Failed to delete the ministry category.');
    } finally {
      setDeleteLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setDescription(category.description);
    setEditMode(true);
    setEditId(category._id);
  };

  const handleCardClick = (ministryId) => {
    navigate(`/admin/ministryCategoryDetails/${ministryId}`);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const currentItems = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <SideBar />
      <Container maxWidth="xl" sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Left Pane - Form */}
          <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
            <Typography variant="h5" component="h2" gutterBottom align="center">
              {editMode ? 'Edit Ministry' : 'Create Ministry'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={editMode ? <Check /> : null}
                >
                  {loading
                    ? <CircularProgress size={24} />
                    : editMode
                      ? 'Update'
                      : 'Create'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setName('');
                    setDescription('');
                    setEditMode(false);
                    setEditId(null);
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Paper>

          {/* Right Pane - List */}

          <Paper elevation={3} sx={{ p: 3, flex: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              Ministry Category List
            </Typography>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              margin="normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1 }} />,
              }}
            />

            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : currentItems.length > 0 ? (
              <>
                <List>
                  {currentItems.map((category) => (
                    <React.Fragment key={category._id}>
                      <ListItem
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'action.hover' },
                        }}
                        onClick={() => handleCardClick(category._id)}
                      >
                        <ListItemText
                          primary={category.name}
                          secondary={category.description}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                          sx={{ flex: 1 }}
                        />
                        <Box>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(category);
                            }}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDeleteDialog(category._id);
                            }}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>

                <div style={{ position: "relative", width: "50%", height: "100%", alignItems: "center", margin: "auto" }}>
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
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    // showFirstButton
                    // showLastButton
                  />
                </div>

              </>
            ) : (
              <Typography variant="body1" color="textSecondary" align="center">
                No ministry categories found.
              </Typography>
            )}
          </Paper>
        </Stack>

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
              Are you sure you want to delete this ministry category? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
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

export default MinistryCategory;