import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../../SideBar";
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
  CircularProgress
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const ActivityType = () => {
  const [activityTypes, setActivityTypes] = useState([]);
  const [newActivity, setNewActivity] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchActivityTypes();
  }, []);

  const fetchActivityTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllActivityTypes`,
        { withCredentials: true }
      );
      setActivityTypes(response.data);
    } catch (error) {
      console.error("Error fetching activity types", error);
      toast.error("Failed to load activity types");
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
    console.log("Deleting ActivityType ID:", selectedId); 
    if (!selectedId) return;

    try {
      setDeleteLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/deleteActivityType/${selectedId}`,
        { withCredentials: true }
      );
      toast.success("Activity type deleted successfully");
      fetchActivityTypes();
    } catch (error) {
      console.error("Error deleting activity type", error);
      toast.error("Failed to delete activity type");
    } finally {
      setDeleteLoading(false);
      setOpenDialog(false);
      setSelectedId(null);
    }
  };

  const handleCreate = async () => {
    if (!newActivity.trim()) {
      toast.error("Activity type name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/createActivityType`,
        { name: newActivity },
        { withCredentials: true }
      );
      toast.success("Activity type created successfully");
      setNewActivity("");
      fetchActivityTypes();
    } catch (error) {
      console.error("Error creating activity type", error);
      toast.error(
        error.response?.data?.message || "Failed to create activity type"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <SideBar />
      <Container maxWidth="xl" sx={{ p: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          {/* Left Pane - Form */}
          <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Add Activity Type
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Activity Type Name"
                variant="outlined"
                fullWidth
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                disabled={loading}
              />
              <Button
                variant="contained"
                onClick={handleCreate}
                disabled={loading || !newActivity.trim()}
                sx={{ alignSelf: "flex-start" }}
              >
                {loading ? <CircularProgress size={24} /> : "Add Activity"}
              </Button>
            </Stack>
          </Paper>

          {/* Right Pane - Table */}
          <Paper elevation={3} sx={{ p: 3, flex: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Activity Types
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : activityTypes.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activityTypes.map((activity) => (
                      <TableRow key={activity._id} hover>
                        <TableCell>{activity.name}</TableCell>
                        <TableCell align="right">
                          <Button
                            aria-label="delete"
                            onClick={() => handleOpenDialog(activity._id)}
                            color="error"
                            disabled={loading}
                          >
                            <Delete />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" color="textSecondary" py={2}>
                No activity types found
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
              Are you sure you want to delete this activity type? This action cannot be undone.
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
              {deleteLoading ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ActivityType;