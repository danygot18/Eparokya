import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../SideBar";
import MetaData from "../../Layout/MetaData";
import { toast } from "react-toastify";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { forwardRef } from "react";
const CreatePriest = () => {
  const [priestData, setPriestData] = useState({
    title: "",
    position: "",
    fullName: "",
    nickName: "",
    birthDate: "",
    Seminary: "",
    ordinationDate: "",
    parishDurationYear: "",
    isActive: false,
    isRetired: false,
    image: null,
    GuestPriest: false,
    attended: "",
    guestDate: "",
    guestTime: "",
  });

  const [priests, setPriests] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/api/v1/getAllPriest`).then((res) => {
      setPriests(res.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPriestData({
      ...priestData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setPriestData({ ...priestData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(priestData).forEach((key) => {
      if (key === "parishDurationYear" && priestData.GuestPriest) return;
      if (priestData[key] !== null && priestData[key] !== "") {
        formData.append(key, priestData[key]);
      }
    });

    try {
      await axios.post(`${process.env.REACT_APP_API}/api/v1/createPriest`, formData);
      toast.success("Priest created successfully");
      setPriestData({
        title: "",
        position: "",
        fullName: "",
        nickName: "",
        birthDate: "",
        Seminary: "",
        ordinationDate: "",
        parishDurationYear: "",
        isActive: false,
        isRetired: false,
        image: null,
        GuestPriest: false,
        attended: "",
        guestDate: "",
        guestTime: "",
      });
    } catch {
      toast.error("Failed to create priest");
    }
  };
  const CustomTimeInput = forwardRef(({ value, onClick }, ref) => (
    <TextField
      label="Time Attended"
      fullWidth
      value={value}
      onClick={onClick}
      inputRef={ref}
      InputLabelProps={{ shrink: true }}
      readOnly
    />
  ));
  return (
    <Box sx={{ display: "flex" }}>
      <MetaData title="Add Priest" />
      <SideBar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Add Priest
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Title</InputLabel>
                  <Select name="title" value={priestData.title} onChange={handleChange}>
                    {["Reverend Father", "Father", "Archbishop", "Archdeacons", "Archpriest", "Bishop", "Cardinal", "Chaplain", "Coadjutor", "Deacon", "Diocesan Bishop", "Metropolitan", "Metropolitan Bishop", "Monsignor", "Patriarch", "Pastor", "Pope", "Primate"].map((title) => (
                      <MenuItem key={title} value={title}>
                        {title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="position" label="Position" value={priestData.position} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="fullName" label="Full Name" value={priestData.fullName} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="nickName" label="Nick Name" value={priestData.nickName} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField type="date" name="birthDate" label="Birth Date" value={priestData.birthDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="Seminary" label="Seminary" value={priestData.Seminary} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField type="date" name="ordinationDate" label="Ordination Date" value={priestData.ordinationDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                {!priestData.GuestPriest && (
                  <>
                    <TextField
                      fullWidth
                      label="Parish Duration Year"
                      name="parishDurationYear"
                      value={priestData.parishDurationYear}
                      onChange={handleChange}
                      margin="normal"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Required only for assigned priests
                    </Typography>
                  </>
                )}

              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={priestData.isActive} onChange={handleChange} name="isActive" />}
                  label="Active"
                />
                <FormControlLabel
                  control={<Checkbox checked={priestData.isRetired} onChange={handleChange} name="isRetired" />}
                  label="Retired"
                />
                <FormControlLabel
                  control={<Checkbox checked={priestData.GuestPriest} onChange={handleChange} name="GuestPriest" />}
                  label="Guest Priest"
                />
              </Grid>

              {priestData.GuestPriest && (
                <>
                  <Grid item xs={12} sm={4}>
                    <TextField name="attended" label="Attended" value={priestData.attended} onChange={handleChange} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField type="date" name="guestDate" label="Date Attended" value={priestData.guestDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DatePicker
                      selected={priestData.guestTime ? new Date(priestData.guestTime) : null}
                      onChange={(time) =>
                        setPriestData({ ...priestData, guestTime: time.toISOString() })
                      }
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      customInput={<CustomTimeInput />}
                    />
                  </Grid>

                </>
              )}

              <Grid item xs={12}>
                <input type="file" name="image" onChange={handleFileChange} />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Save Priest
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Priest List
          </Typography>
          {priests.map((priest) => (
            <Box key={priest._id} sx={{ mb: 1 }}>
              <Typography variant="subtitle1">
                {priest.title} {priest.fullName} -
                <strong style={{ marginLeft: 4 }}>{priest.isActive ? "Active" : "Inactive"}</strong>
              </Typography>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default CreatePriest;
