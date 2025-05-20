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

  const fetchData = async (category) => {
    let endpoint = "";
    if (category === "event") endpoint = "/api/v1/getAllEventType";
    else if (category === "activities")
      endpoint = "/api/v1/getAllActivityTypes";
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

  const handleDeleteSelection = async (id) => {
    if (!window.confirm("Are you sure you want to delete this selection?"))
      return;
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/deleteSelection/${id}`,
        {
          withCredentials: true,
        }
      );
      alert(response.data.message);
      fetchSelections();
    } catch (error) {
      console.error("Error deleting selection:", error);
    }
  };

  const handleEditSelection = (selection) => {
    console.log("Edit selection:", selection);
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
    } catch (error) {
      console.error("Error adding selection:", error);
    }
  };

  const handleDeactivateSelection = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/deactivateSelection/${id}`,
        {},
        { withCredentials: true }
      );
      alert(response.data.message);
      fetchSelections();
    } catch (error) {
      console.error(
        "Error deactivating selection:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add Active Feedback Form
        </Typography>

        {loading && <Loader />}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              />
              <TextField
                label="Time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </>
          )}

          {selectedType && selectedDate && selectedTime && (
            <Button variant="contained" onClick={handleAddSelection}>
              Add Selection
            </Button>
          )}

          <Typography variant="h6" sx={{ mt: 4 }}>
            Added Selections
          </Typography>

          {selections.map((selection) => (
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
                    <Typography variant="h6">
                      <strong>{selection.category.toUpperCase()}</strong> —{" "}
                      {selection.typeId?.name || selection.typeId?.fullName}
                    </Typography>
                    {/* <Typography variant="subtitle2" color="text.secondary">
                      {selection.typeId?.name || selection.typeId?.fullName}
                    </Typography> */}
                    <Typography>
                      {selection.date} at {selection.time}
                    </Typography>
                    <Typography color={selection.isActive ? "green" : "gray"}>
                      Status: {selection.isActive ? "Active" : "Inactive"}
                    </Typography>
                    {selection.isActive && (
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ mt: 1 }}
                        onClick={() => handleDeactivateSelection(selection._id)}
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
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteSelection(selection._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default AdminSelection;
