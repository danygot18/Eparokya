import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import GuestSidebar from "../../../../GuestSideBar";
import axios from "axios";
import { toast } from "react-toastify";
import MetaData from "../../../../Layout/MetaData";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const PrayerRequestForm = () => {
  const [formData, setFormData] = useState({
    offerrorsName: "",
    prayerType: "",
    prayerRequestDate: "",
     prayerRequestTime: "",
    Intentions: [{ name: "" }],
  });
  const [user, setUser] = useState(null);
  const config = {
    withCredentials: true,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/profile`,
          config
        );
        setUser(response.data.user);
      } catch (error) {
        console.error(
          "Error fetching user:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleIntentionChange = (e, index) => {
    const updatedIntentions = [...formData.Intentions];
    updatedIntentions[index].name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      Intentions: updatedIntentions,
    }));
  };

  const handleAddIntention = () => {
    setFormData((prev) => ({
      ...prev,
      Intentions: [...prev.Intentions, { name: "" }],
    }));
  };

  const handleRemoveIntention = (index) => {
    const updatedIntentions = formData.Intentions.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      Intentions: updatedIntentions,
    }));
  };

  const handleClear = () => {
    setFormData({
      offerrorsName: "",
      prayerType: "",
      prayerRequestDate: "",
      Intentions: [{ name: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { offerrorsName, prayerType, prayerRequestDate } = formData;
    if (!offerrorsName || !prayerType || !prayerRequestDate) {
      toast.error("Please fill out all required fields!");
      return;
    }

    try {
      const submissionData = { ...formData, userId: user?._id };
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/prayerRequestSubmit`,
        submissionData,
        config
      );
      toast.success("Prayer request submitted successfully!");
      handleClear();
    } catch (error) {
      console.error("Error submitting prayer request:", error);
      toast.error("Failed to submit the prayer request. Please try again.");
    }
  };

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#f9f9f9", minHeight: "100vh" }}
    >
      <MetaData title="Prayer Request Form" />
      <GuestSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Prayer Request Information
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Offeror's Name"
                  value={formData.offerrorsName}
                  onChange={(e) => handleChange(e, "offerrorsName")}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Prayer Type"
                  value={formData.prayerType}
                  onChange={(e) => handleChange(e, "prayerType")}
                >
                  <MenuItem value="">Select Prayer Type</MenuItem>
                  <MenuItem value="Eternal Repose(Patay)">
                    Eternal Repose (Patay)
                  </MenuItem>
                  <MenuItem value="Thanks Giving(Pasasalamat)">
                    Thanks Giving (Pasasalamat)
                  </MenuItem>
                  <MenuItem value="Special Intentions(Natatanging Kahilingan)">
                    Special Intentions (Natatanging Kahilingan)
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Prayer Request Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.prayerRequestDate}
                  onChange={(e) => handleChange(e, "prayerRequestDate")}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="time"
                label="Prayer Request Time"
                InputLabelProps={{ shrink: true }}
                value={formData.prayerRequestTime || ""}
                onChange={(e) => handleChange(e, "prayerRequestTime")}
              />
            </Grid>


            <Typography variant="h5" sx={{ mt: 4 }}>
              Intentions
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {formData.Intentions.map((intention, index) => (
                <Grid
                  container
                  item
                  spacing={1}
                  key={index}
                  alignItems="center"
                >
                  <Grid item xs={11}>
                    <TextField
                      fullWidth
                      value={intention.name}
                      onChange={(e) => handleIntentionChange(e, index)}
                      placeholder="Enter Intention"
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveIntention(index)}
                      disabled={formData.Intentions.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={handleAddIntention}
            >
              Add Intention
            </Button>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mr: 2 }}
                onClick={handleClear}
              >
                Clear All Fields
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PrayerRequestForm;
