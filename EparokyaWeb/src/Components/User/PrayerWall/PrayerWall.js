import React, { useState, useEffect } from "react";
import axios from "axios";
import GuestSidebar from '../../GuestSideBar';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Avatar,
  Snackbar,
  Alert
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import MetaData from "../../Layout/MetaData";
import { toast } from "react-toastify";


const PrayerWall = () => {
  const [prayers, setPrayers] = useState([]);
  const [newPrayer, setNewPrayer] = useState({
    title: "",
    prayerRequest: "",
    prayerWallSharing: "anonymous",
    contact: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const prayersPerPage = 10;
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPrayers, setTotalPrayers] = useState(0);
  const [loadingPrayerId, setLoadingPrayerId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'

  });

  const config = {
    withCredentials: true,
  };

  const PrayerCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  }));

  const PrayerButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/profile`, config);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error.message);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/prayer-wall?page=${currentPage}&limit=${prayersPerPage}`,
          { withCredentials: true }
        );

        const { prayers, total } = response.data;
        setPrayers(prayers);
        setTotalPrayers(total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prayers:", error);
        setLoading(false);
      }
    };

    fetchPrayers();
  }, [currentPage]);

  const handleNewPrayerSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warn("You must be logged in to post a prayer.")
      return;
    }

    try {
      const prayerData = { ...newPrayer, userId: user._id };
      await axios.post(`${process.env.REACT_APP_API}/api/v1/submitPrayer`, prayerData, config);
      toast.success("Successful! Please wait for the admin confirmation for your prayer to be posted")
      setNewPrayer({ title: "", prayerRequest: "", prayerWallSharing: "anonymous", contact: "" });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error posting prayer:", error);
      toast.error("Failed to post prayer. Please try again.")
    }
  };

  const handleLike = async (prayerId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/toggleLike/${prayerId}`,
        {},
        { withCredentials: true }
      );

      setPrayers((prevPrayers) =>
        prevPrayers.map((prayer) =>
          prayer._id === prayerId
            ? {
              ...prayer,
              likes: response.data.likes,
              likedByUser: response.data.likedByUser,
            }
            : prayer
        )
      );
    } catch (error) {
      console.error("Error liking prayer:", error);
    }
  };

  const handleInclude = async (prayerId) => {
    if (!user) {
      setSnackbar({
        open: true,
        message: "You must be logged in to include a prayer.",
        severity: 'error'
      });
      return;
    }

    try {
      setLoadingPrayerId(prayerId);
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/toggleInclude/${prayerId}`,
        {},
        { withCredentials: true }

      );
      toast.success("Successful! Please wait for the admin confirmation for your prayer to be posted")
      setPrayers((prevPrayers) =>
        prevPrayers.map((prayer) =>
          prayer._id === prayerId
            ? {
              ...prayer,
              includeCount: response.data.includeCount,
              includedByUser: response.data.includedByUser,
            }
            : prayer
        )
      );
    } catch (error) {
      console.error("Error including prayer:", error);
    } finally {
      setLoadingPrayerId(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{
      display: "flex",
      minHeight: "100vh",

    }}>
      <GuestSidebar />

      <MetaData title="Prayer Wall" />

      <Box sx={{
        flexGrow: 1,

        flexDirection: 'column',
        alignItems: 'center', // This centers children horizontally
        p: 3,
        width: '100%',
        maxWidth: '900px', // Adjust as needed
        margin: '0 auto' // Centers the container
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <PrayerButton
            variant="contained"
            onClick={() => setIsModalOpen(true)}
            sx={{ width: '60%', maxWidth: 300 }}
          >
            Click here to Share a Prayer
          </PrayerButton>
        </Box>

        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle variant="h4" sx={{ fontSize: '1.8rem', padding: 3 }}>Share a Prayer</DialogTitle>
          <DialogContent sx={{ padding: 3 }}>
            <Box
              component="form"
              onSubmit={handleNewPrayerSubmit}
              sx={{
                mt: 1,
                '& .MuiTextField-root': {
                  marginBottom: 3
                }
              }}
            >
              <TextField
                margin="normal"
                fullWidth
                label="Title"
                placeholder="Title"
                value={newPrayer.title}
                onChange={(e) => setNewPrayer({ ...newPrayer, title: e.target.value })}
                InputProps={{
                  style: { fontSize: '1.1rem' }
                }}
                InputLabelProps={{
                  style: { fontSize: '1.1rem' }
                }}
                size="medium"
              />

              <TextField
                margin="normal"
                fullWidth
                multiline
                rows={6}
                label="Your prayer request"
                placeholder="Your prayer request"
                value={newPrayer.prayerRequest}
                onChange={(e) => setNewPrayer({ ...newPrayer, prayerRequest: e.target.value })}
                required
                InputProps={{
                  style: { fontSize: '1.1rem' }
                }}
                InputLabelProps={{
                  style: { fontSize: '1.1rem' }
                }}
              />

              <TextField
                margin="normal"
                fullWidth
                label="Contact"
                placeholder="Contact"
                value={newPrayer.contact}
                onChange={(e) => setNewPrayer({ ...newPrayer, contact: e.target.value })}
                InputProps={{
                  style: { fontSize: '1.1rem' }
                }}
                InputLabelProps={{
                  style: { fontSize: '1.1rem' }
                }}
              />

              <FormControl
                component="fieldset"
                margin="normal"
                fullWidth
                sx={{ marginBottom: 3 }}
              >
                <FormLabel
                  component="legend"
                  sx={{ fontSize: '1.1rem', marginBottom: 2 }}
                >
                  Sharing Preference
                </FormLabel>
                <RadioGroup
                  value={newPrayer.prayerWallSharing}
                  onChange={(e) => setNewPrayer({ ...newPrayer, prayerWallSharing: e.target.value })}
                >
                  <FormControlLabel
                    value="anonymous"
                    control={<Radio size="medium" />}
                    label={<Typography fontSize="1.1rem">Share anonymously</Typography>}
                    sx={{ marginBottom: 1 }}
                  />
                  <FormControlLabel
                    value="myName"
                    control={<Radio size="medium" />}
                    label={<Typography fontSize="1.1rem">Share with my name</Typography>}
                  />
                </RadioGroup>
              </FormControl>

              <DialogActions sx={{ padding: 0, marginTop: 3 }}>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  sx={{
                    fontSize: '1.1rem',
                    padding: '8px 20px'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    fontSize: '1.1rem',
                    padding: '8px 20px'
                  }}
                >
                  Post Prayer
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          prayers.map((prayer) => (
            <PrayerCard key={prayer._id}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar
                    src={
                      prayer.prayerWallSharing === "anonymous"
                        ? "/public/../../../../EPAROKYA-SYST.png"
                        : prayer.user?.avatar?.url
                    }
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    {prayer.prayerWallSharing === "anonymous" ? "Anonymous" : prayer.user?.name || "Unknown User"}
                  </Typography>
                </Box>

                <Typography variant="h5" gutterBottom>
                  {prayer.title}
                </Typography>

                <Typography variant="body1" paragraph>
                  {prayer.prayerRequest}
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleLike(prayer._id)}
                  >
                    {prayer.likedByUser ? (
                      <Favorite color="error" fontSize="medium" />
                    ) : (
                      <FavoriteBorder fontSize="medium" />
                    )}
                    <Typography variant="body1">
                      {prayer.likes || 0}
                    </Typography>
                  </Box>

                  <Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleInclude(prayer._id)}
                      disabled={prayer.includedByUser || loadingPrayerId === prayer._id}
                      sx={{ minWidth: 200 }}
                    >
                      {prayer.includedByUser
                        ? "Included in prayer"
                        : loadingPrayerId === prayer._id
                          ? <CircularProgress size={24} color="inherit" />
                          : `Include (${prayer.includeCount || 0})`}
                    </Button>

                    {prayer.includedByUser && (
                      <Box
                        mt={1}
                        p={1}
                        bgcolor="success.light"
                        borderRadius={1}
                        color="success.dark"
                        textAlign="center"
                      >
                        <Typography variant="body2" fontWeight="bold">
                          You have already included this in your prayer.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="caption">
                    Created: {new Date(prayer.createdAt).toLocaleDateString()}
                  </Typography>
                  {prayer.confirmedAt && (
                    <Typography variant="caption">
                      Confirmed: {new Date(prayer.confirmedAt).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </PrayerCard>
          ))
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%', }}

        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PrayerWall;