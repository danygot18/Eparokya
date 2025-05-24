import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import SideBar from "../../SideBar";
import Loader from "../../../Layout/Loader";

const AdminSelection = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectionToDelete, setSelectionToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async (category) => {
    let endpoint = "";
    if (category === "event") endpoint = "/api/v1/getAllEventType";
    else if (category === "activities") endpoint = "/api/v1/getAllActivityTypes";
    else if (category === "priest") endpoint = "/api/v1/getAllPriest";

    if (endpoint) {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API}${endpoint}`,
          { withCredentials: true }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setData([]);
    }
  };

  const fetchSelections = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getSelections`,
        { withCredentials: true }
      );
      setSelections(response.data);
    } catch (error) {
      console.error("Error fetching selections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (selection) => {
    setSelectionToDelete(selection);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectionToDelete(null);
  };

  const handleDeleteSelection = async () => {
    if (!selectionToDelete) return;

    try {
      setDeleteLoading(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/deleteSelection/${selectionToDelete._id}`,
        { withCredentials: true }
      );
      alert(response.data.message);
      fetchSelections();
    } catch (error) {
      console.error("Error deleting selection:", error);
      alert("Failed to delete selection");
    } finally {
      setDeleteLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const handleEditSelection = (selection) => {
    console.log("Edit selection:", selection);
    // Implement your edit functionality here
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchData(selectedCategory);
      setSelectedType("");
      setSelectedDate("");
      setSelectedTime("");
    }
    fetchSelections();
  }, [selectedCategory]);

  const getTypeModel = (category) => {
    if (category === "event") return "EventType";
    if (category === "activities") return "ActivityType";
    if (category === "priest") return "Priest";
    return "";
  };

  const handleAddSelection = async () => {
    if (!selectedCategory || !selectedType || !selectedDate || !selectedTime) {
      alert("Please complete all selections.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/addSelection`,
        {
          category: selectedCategory,
          typeModel: getTypeModel(selectedCategory),
          typeId: selectedType,
          date: selectedDate,
          time: selectedTime,
        },
        { withCredentials: true }
      );
      alert(response.data.message);
      fetchSelections();
      // Reset form after successful submission
      setSelectedType("");
      setSelectedDate("");
      setSelectedTime("");
    } catch (error) {
      console.error("Error adding selection:", error);
      alert(error.response?.data?.message || "Failed to add selection");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateSelection = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/deactivateSelection/${id}`,
        {},
        { withCredentials: true }
      );
      alert(response.data.message);
      fetchSelections();
    } catch (error) {
      console.error("Error deactivating selection:", error.response?.data || error.message);
      alert("Failed to deactivate selection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      
      <SideBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
         {loading && <Loader />}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Add Active Feedback Form
        </Typography>

       

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">Select Category</MenuItem>
              <MenuItem value="event">Event</MenuItem>
              <MenuItem value="activities">Activities</MenuItem>
              <MenuItem value="priest">Priest</MenuItem>
            </Select>
          </FormControl>

          {selectedCategory && (
            <FormControl fullWidth>
              <InputLabel>{selectedCategory} Type</InputLabel>
              <Select
                value={selectedType}
                label={`${selectedCategory} Type`}
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={loading}
              >
                <MenuItem value="">Select {selectedCategory} Type</MenuItem>
                {data.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name || item.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {selectedType && (
            <>
              <TextField
                label="Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                disabled={loading}
              />
              <TextField
                label="Time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                disabled={loading}
              />
            </>
          )}

          {selectedType && selectedDate && selectedTime && (
            <Button 
              variant="contained" 
              onClick={handleAddSelection}
              disabled={loading}
              sx={{ alignSelf: "flex-start" }}
            >
              {loading ? <CircularProgress size={24} /> : "Add Selection"}
            </Button>
          )}

          <Typography variant="h5" sx={{ mt: 4, fontWeight: "bold" }}>
            Added Selections
          </Typography>

          {selections.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No selections added yet
            </Typography>
          ) : (
            selections.map((selection) => (
              <Card key={selection._id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" component="div">
                        <strong>{selection.category.toUpperCase()}</strong> —{" "}
                        {selection.typeId?.name || selection.typeId?.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(selection.date).toLocaleDateString()} at {selection.time}
                      </Typography>
                      <Typography 
                        variant="body2"
                        color={selection.isActive ? "success.main" : "text.secondary"}
                        sx={{ mt: 1 }}
                      >
                        Status: {selection.isActive ? "Active" : "Inactive"}
                      </Typography>
                      {selection.isActive && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => handleDeactivateSelection(selection._id)}
                          disabled={loading}
                        >
                          Deactivate
                        </Button>
                      )}
                    </Box>
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditSelection(selection)}
                          disabled={loading}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(selection)}
                          disabled={loading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
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
              Are you sure you want to delete the selection for{" "}
              <strong>
                {selectionToDelete?.typeId?.name || selectionToDelete?.typeId?.fullName}
              </strong>?
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
              onClick={handleDeleteSelection}
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

export default AdminSelection;