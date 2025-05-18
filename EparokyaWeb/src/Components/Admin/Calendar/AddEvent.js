import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Paper,
} from "@mui/material";
import SideBar from "../SideBar";
import Loader from "../../Layout/Loader"; // adjust path if needed

const AddEvent = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [ministryCategories, setMinistryCategories] = useState([]);
  const [selectedMinistries, setSelectedMinistries] = useState([]);
  const [loading, setLoading] = useState(true); // 🔹 New loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`,
          { withCredentials: true }
        );
        setMinistryCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching ministry categories:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchMinistries();
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedMinistries((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!title || !date) {
      setErrorMessage("Title and Date are required.");
      return;
    }

    const formattedTime = time ? moment(time, "HH:mm").format("h:mm A") : "";
    const newEvent = {
      title,
      customeventDate: date,
      customeventTime: formattedTime,
      description,
      ministryCategory: selectedMinistries,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/addEvent`,
        newEvent,
        { withCredentials: true }
      );
      navigate("/admin/calendar", { state: { newEvent } });
    } catch (error) {
      console.error("Error adding event:", error);
      setErrorMessage("Failed to add event. Please try again.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: '"Hero", "Sans Serif", sans-serif',
        padding: 2,
      }}
    >
      <SideBar />

      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 600 }}>
        <Typography variant="h5" mb={2} fontWeight="bold">
          Add Event
        </Typography>

        {errorMessage && (
          <Typography color="error" mb={2}>
            {errorMessage}
          </Typography>
        )}

        <form onSubmit={handleAddEvent}>
          <Stack spacing={2}>
            <TextField
              label="Event Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Event Description"
              variant="outlined"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              label="Event Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <TextField
              label="Event Time (optional)"
              type="time"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            <Box>
              <Typography variant="subtitle1" mb={1}>
                Select Ministry Categories (optional):
              </Typography>

              {loading ? (
                <Loader lines={4} /> // 🔹 Show skeleton loader while fetching
              ) : (
                <Stack spacing={1}>
                  {ministryCategories.map((ministry) => (
                    <FormControlLabel
                      key={ministry._id}
                      control={
                        <Checkbox
                          value={ministry._id}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label={ministry.name}
                    />
                  ))}
                </Stack>
              )}
            </Box>

            <Stack direction="row" spacing={2} mt={2}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#154314",
                  "&:hover": { backgroundColor: "#0e320f" },
                }}
              >
                Add Event
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{
                  color: "#154314",
                  borderColor: "#154314",
                  "&:hover": { borderColor: "#0e320f" },
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default AddEvent;
