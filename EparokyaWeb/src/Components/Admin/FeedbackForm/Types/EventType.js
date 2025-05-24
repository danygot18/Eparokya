import React, { useState, useEffect } from "react";
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
  CircularProgress
} from "@mui/material";
import { Delete, Add, Cancel } from "@mui/icons-material";
import SideBar from "../../SideBar";
import axios from "axios";
import { toast } from "react-toastify";

const EventType = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const config = { withCredentials: true };

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllEventType`,
        config
      );
      setEventTypes(response.data);
    } catch (error) {
      // console.error("Error fetching event types:", error);
      toast.error("Failed to load activity types");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEventType = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
          toast.error("Event type name cannot be empty");
          return;
        }
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/createEventType`,
        { name },
        config
      );
      toast.success("Event type created successfully");
      setName("");
      setShowForm(false);
      fetchEventTypes();
    } catch (error) {
      console.error("Error adding event type:", error);
      toast.error(
              error.response?.data?.message || "Failed to create Event type"
            );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setEventToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEventToDelete(null);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;
    console.log("Deleting EventType ID:", eventToDelete); // Debugging log
    try {
      setDeleteLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/deleteEventType/${eventToDelete}`,
        config
      );
      fetchEventTypes();
      toast.success("Event type deleted successfully");
    } catch (error) {
      console.error("Error deleting event type:", error);
    } finally {
      setDeleteLoading(false);
      handleCloseDeleteDialog();
      setEventToDelete(null);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <SideBar />
      <Container maxWidth="lg" sx={{ p: 3 }}>
        <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
          {/* Left Pane - Form */}
          <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
              Manage Event Types
            </Typography>
            
            <Button
              variant="contained"
              startIcon={showForm ? <Cancel /> : <Add />}
              onClick={() => setShowForm(!showForm)}
              fullWidth
              sx={{ mb: 2 }}
            >
              {showForm ? "Cancel" : "Add Event Type"}
            </Button>

            {showForm && (
              <Box component="form" onSubmit={handleAddEventType} sx={{ mt: 2 }}>
                <TextField
                  label="Event Type Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : "Add Event Type"}
                </Button>
              </Box>
            )}
          </Paper>

          {/* Right Pane - Table */}
          <Paper elevation={3} sx={{ p: 3, flex: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: "bold" }}>
              Event Types List
            </Typography>
            
            {loading && eventTypes.length === 0 ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eventTypes.length > 0 ? (
                      eventTypes.map((event) => (
                        <TableRow key={event._id}>
                          <TableCell>{event.name}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<Delete />}
                              onClick={() => handleOpenDeleteDialog(event._id)}
                              size="small"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                          No event types found
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
              Are you sure you want to delete the event type <strong>{eventToDelete?.name}</strong>?
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
      </Container>
    </Box>
  );
};

export default EventType;