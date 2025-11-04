import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import GuestSidebar from "../../GuestSideBar";
import { socket } from "../../../socket/index.js";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Paper,
  Divider,
  IconButton,
  InputAdornment
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import { useMediaQuery } from "@mui/material";
import GuestSideBar from "../../GuestSideBar";

const PrayerRequestIntention = () => {
  const [formData, setFormData] = useState({
    offerrorsName: "",
    prayerType: "",
    addPrayer: "",
    prayerDescription: "",
    prayerRequestDate: "",
    prayerRequestTime: "",
    intentions: [],
  });
  const [showSidePanel, setShowSidePanel] = useState(false);

  const config = {
    withCredentials: true,
  };

  const isMobile = useMediaQuery("(max-width: 768px)");

  const prayerTypes = [
    "For the sick and suffering (Para sa mga may sakit at nagdurusa)",
    "For those who have died (Para sa mga namatay na)",
    "Special Intentions(Natatanging Kahilingan)",
    "For family and friends (Para sa pamilya at mga kaibigan)",
    "For those who are struggling (Para sa mga nahihirapan/naghihirap)",
    "For peace and justice (Para sa kapayapaan at katarungan)",
    "For the Church (Para sa Simbahan)",
    "For vocations (Para sa mga bokasyon)",
    "For forgiveness of sins (Para sa kapatawaran ng mga kasalanan)",
    "For guidance and wisdom (Para sa gabay at karunungan)",
    "For strength and courage (Para sa lakas at tapang)",
    "For deeper faith and love (Para sa mas malalim na pananampalataya at pag-ibig)",
    "For perseverance (Para sa pagtitiyaga/pagtitiis)",
    "Others (Iba pa)",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIntentionChange = (index, value) => {
    setFormData((prev) => {
      const newIntentions = [...prev.intentions];
      newIntentions[index].name = value;
      return { ...prev, intentions: newIntentions };
    });
  };

  const handleAddIntention = () => {
    setFormData((prev) => ({
      ...prev,
      intentions: [...prev.intentions, { name: "" }],
    }));
  };

  const handleRemoveIntention = (index) => {
    setFormData((prev) => ({
      ...prev,
      intentions: prev.intentions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.prayerType === "Others (Iba pa)" && !formData.addPrayer) {
      toast.error("Please specify your prayer when selecting Others.");
      return;
    }

    try {
      const payload = {
        ...formData,
        Intentions: formData.intentions.map((intention) => ({ name: intention.name })),
      };

      console.log("Submitting payload:", payload);

      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/prayerRequestIntention/submit`,
        payload,
        config
      );

      socket.emit("prayerRequestSubmitted", {
        message: `New prayer request submitted by ${formData.offerrorsName || "a user"}.`,
        timestamp: new Date(),
      });

      toast.success("Prayer submitted. This will be reviewed shortly.");
      setFormData({
        offerrorsName: "",
        prayerType: "",
        addPrayer: "",
        prayerDescription: "",
        prayerRequestDate: "",
        prayerRequestTime: "",
        intentions: [],
      });
    } catch (error) {
      console.error("Submission error:", error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleClear = () => {
    setFormData({
      offerrorsName: "",
      prayerType: "",
      addPrayer: "",
      prayerDescription: "",
      prayerRequestDate: "",
      prayerRequestTime: "",
      intentions: [],
    });
  };

  return (
    <Box >
      <header>
        {isMobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "10px",
            }}
          >
            {/* Left-side button (existing) */}
            <button
              onClick={() => setShowSidePanel(!showSidePanel)}
              className="outline outline-offset-1 outline-green-900/100"
            >
              ☰
            </button>


          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && showSidePanel && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowSidePanel(false)} // close when clicking outside
          >
            <div>

              <div>
                <GuestSideBar />
              </div>
            </div>
          </div>
        )}
      </header>

      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {!isMobile && (
          <div>
            <GuestSideBar />
          </div>
        )}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',

          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              maxWidth: '800px',
              borderRadius: 2
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'success.main'
              }}
            >
              Send Prayer Request
            </Typography>

            <Typography
              variant="body1"
              paragraph
              sx={{
                textAlign: 'center',
                mb: 4,
                color: 'text.secondary'
              }}
            >
              Kung nais magpadasal, fill-upan lamang ang nasa baba. Ang inyong mga
              dasal ay mababasa ni padre.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  select
                  fullWidth
                  label="Prayer Type"
                  name="prayerType"
                  value={formData.prayerType}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="medium"
                >
                  <MenuItem value="">
                    <em>Select Prayer Type</em>
                  </MenuItem>
                  {prayerTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>

                {formData.prayerType === "Others (Iba pa)" && (
                  <TextField
                    fullWidth
                    label="Specify your prayer"
                    name="addPrayer"
                    value={formData.addPrayer}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                )}

                <TextField
                  fullWidth
                  label="Name"
                  name="offerrorsName"
                  value={formData.offerrorsName}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={2}
                />

                <TextField
                  fullWidth
                  label="Prayer Description (Optional)"
                  name="prayerDescription"
                  value={formData.prayerDescription}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={4}
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    name="prayerRequestDate"
                    value={formData.prayerRequestDate}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    fullWidth
                    label="Time"
                    type="time"
                    name="prayerRequestTime"
                    value={formData.prayerRequestTime}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" component="h3">
                  Intentions
                </Typography>

                {formData.intentions.map((intention, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="center">
                    <TextField
                      fullWidth
                      value={intention.name}
                      onChange={(e) => handleIntentionChange(index, e.target.value)}
                      placeholder="Enter name to include in your intentions"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleRemoveIntention(index)}
                              color="error"
                              aria-label="remove intention"
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                ))}

                <Button
                  onClick={handleAddIntention}
                  startIcon={<AddCircleOutlineIcon />}
                  variant="outlined"
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Add Intention
                </Button>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                  <Button
                    onClick={handleClear}
                    variant="outlined"
                    color="error"
                    startIcon={<ClearIcon />}
                    size="large"
                  >
                    Clear All
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SendIcon />}
                    size="large"
                  >
                    Submit Prayer
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default PrayerRequestIntention;