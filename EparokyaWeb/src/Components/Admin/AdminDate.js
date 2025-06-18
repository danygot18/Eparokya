import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Switch,
  IconButton
} from '@mui/material';
import {
  Delete,
  Edit,
  Save,
  Cancel,
  ToggleOn,
  ToggleOff,
  Add
} from '@mui/icons-material';
import SideBar from './SideBar';
import { toast } from 'react-toastify';

const AdminDates = () => {
  const [dates, setDates] = useState([]);
  const [form, setForm] = useState({
    category: '',
    date: '',
    time: '',
    maxParticipants: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [editingDate, setEditingDate] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dateToDelete, setDateToDelete] = useState(null);

  const location = useLocation();
  const config = { withCredentials: true };

  const fetchDates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllDates`,
        config
      );
      setDates(response.data);
      console.log('Fetched dates:', response.data);
    } catch (error) {
      console.error('Failed to fetch dates', error);
      toast.error('Failed to load dates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDates();
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCreateDate = async () => {
    if (!form.category || !form.date || !form.time) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/createDate`,
        form,
        config
      );
      toast.success('Date created successfully');
      fetchDates();
      setForm({ category: '', date: '', time: '', maxParticipants: 0 });
    } catch (error) {
      console.error('Failed to create date', error);
      toast.error(error.response?.data?.message || 'Failed to create date');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDate = async (adminDateId) => {
    try {
      const toggleUrl = `${process.env.REACT_APP_API}/api/v1/${adminDateId}/switchDate`;
      const response = await axios.put(toggleUrl, {}, config);

      if (response.status === 200) {
        const updatedAdminDate = response.data.adminDate;
        const updatedDates = dates.map(date =>
          date._id === adminDateId ? updatedAdminDate : date
        );
        setDates(updatedDates);
        toast.success(`Date ${updatedAdminDate.isEnabled ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error('Failed to toggle date', error);
      toast.error('Failed to toggle date status');
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setDateToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDateToDelete(null);
  };

  const handleDeleteDate = async () => {
    if (!dateToDelete) return;

    try {
      setDeleteLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/${dateToDelete}/delete`,
        config
      );
      fetchDates();
      toast.success('Date deleted successfully');
    } catch (error) {
      console.error('Failed to delete date', error);
      toast.error('Failed to delete date');
    } finally {
      setDeleteLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const handleEditDate = async (id, newMaxParticipants) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/${id}/editMax`,
        { maxParticipants: newMaxParticipants },
        config
      );
      setEditingDate(null);
      fetchDates();
      toast.success('Date updated successfully');
    } catch (error) {
      console.error('Failed to edit date', error);
      toast.error('Failed to update date');
    }
  };

  const filteredDates = dates.filter(
    (date) =>
      (!search || date.category.toLowerCase().includes(search.toLowerCase())) &&
      (!filter || date.category === filter)
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', maxWidth: "100%" }}>
      <SideBar />
      <Container maxWidth="lg" sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Left Pane - Form */}
          <Paper elevation={3} sx={{ p: 3, flex: 1, width: 1 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Manage Dates
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                label="Category"
                required
              >
                <MenuItem value="">Select Category</MenuItem>
                <MenuItem value="Wedding">Wedding</MenuItem>
                <MenuItem value="Baptism">Baptism</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
              required
            />

            <TextField
              label="Time"
              type="time"
              name="time"
              value={form.time}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
              required
            />

            <TextField
              label="Max Participants"
              type="number"
              name="maxParticipants"
              value={form.maxParticipants}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{ min: 0 }}
            />

            <Button
              variant="contained"
              onClick={handleCreateDate}
              disabled={isLoading}
              fullWidth
              startIcon={<Add />}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Create Date'}
            </Button>
          </Paper>

          {/* Right Pane - Table */}
          <Paper elevation={3} sx={{ p: 3, flex: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
              Dates List
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                placeholder="Search by category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                size="small"
              />

              <FormControl fullWidth size="small">
                <InputLabel>Filter by Category</InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  label="Filter by Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="Wedding">Wedding</MenuItem>
                  <MenuItem value="Baptism">Baptism</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {isLoading && dates.length === 0 ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Max Participants</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Available</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Confirmed</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>User Submitted</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDates.length > 0 ? (
                      filteredDates
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((date) => (
                          <TableRow key={date._id}>
                            <TableCell>{date.category}</TableCell>
                            <TableCell>{new Date(date.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {new Date(`1970-01-01T${date.time}Z`).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </TableCell>
                            <TableCell>
                              {editingDate === date._id ? (
                                <TextField
                                  type="number"
                                  value={date.maxParticipants}
                                  onChange={(e) => setDates(dates.map(d =>
                                    d._id === date._id ? { ...d, maxParticipants: e.target.value } : d
                                  ))}
                                  size="small"
                                  sx={{ width: 80 }}
                                />
                              ) : (
                                date.maxParticipants
                              )}
                            </TableCell>
                            <TableCell>
                              {date.maxParticipants - date.confirmedParticipants || 0}
                            </TableCell>
                            <TableCell>
                              {date.confirmedParticipants}
                            </TableCell>
                            <TableCell>
                              {date.submittedParticipants}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Switch
                                  checked={date.isEnabled}
                                  onChange={() => handleToggleDate(date._id)}
                                  color="success"
                                />
                                <Typography variant="body2">
                                  {date.isEnabled ? 'Enabled' : 'Disabled'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>

                              <div>

                                {editingDate === date._id ? (
                                  <>
                                    <IconButton
                                      color="primary"
                                      onClick={() => handleEditDate(date._id, date.maxParticipants)}
                                    >
                                      <Save fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      color="secondary"
                                      onClick={() => setEditingDate(null)}
                                    >
                                      <Cancel fontSize="small" />
                                    </IconButton>
                                  </>
                                ) : (
                                  <>
                                    <IconButton
                                      color="primary"
                                      onClick={() => setEditingDate(date._id)}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      color="error"
                                      onClick={() => handleOpenDeleteDialog(date._id)}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
                          No dates found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>

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
              Are you sure you want to delete this date?
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
              onClick={handleDeleteDate}
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

export default AdminDates;