import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import axios from "axios";
import MetaData from "../../Layout/MetaData";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Avatar,
  Stack,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Icon
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

const PriestCard = ({ priest, onEdit, onDelete, onToggleStatus }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Avatar
            src={priest.image?.url}
            alt={priest.fullName}
            sx={{ width: 60, height: 60 }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {priest.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {priest.parishDurationYear}
            </Typography>
          </Box>
        </Box>

        <Box>
          <IconButton
            aria-label={`edit-${priest.fullName}`}
            onClick={() => onEdit(priest)}
            color="primary"
            size="small"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            aria-label={`delete-${priest.fullName}`}
            onClick={() => onDelete(priest._id)}
            color="error"
            size="small"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, mt: 1 }}>
        <Stack spacing={1}>
          {priest.title && (
            <TextField
              label="Title"
              value={priest.title}
              InputProps={{ readOnly: true }}
              size="small"
              fullWidth
              variant="outlined"
            />
          )}
          {priest.position && (
            <TextField
              label="Position"
              value={priest.position}
              InputProps={{ readOnly: true }}
              size="small"
              fullWidth
              variant="outlined"
            />
          )}
          {priest.nickName && (
            <TextField
              label="Nickname"
              value={priest.nickName}
              InputProps={{ readOnly: true }}
              size="small"
              fullWidth
              variant="outlined"
            />
          )}
          {priest.birthDate && (
            <TextField
              label="Birth Date"
              value={format(new Date(priest.birthDate), 'MM/dd/yyyy')}
              InputProps={{ readOnly: true }}
              size="small"
              fullWidth
              variant="outlined"
            />
          )}
          {priest.Seminary && (
            <TextField
              label="Seminary"
              value={priest.Seminary}
              InputProps={{ readOnly: true }}
              size="small"
              fullWidth
              variant="outlined"
            />
          )}
          {priest.ordinationDate && (
            <TextField
              label="Ordination Date"
              value={format(new Date(priest.ordinationDate), 'MM/dd/yyyy')}
              InputProps={{ readOnly: true }}
              size="small"
              fullWidth
              variant="outlined"
            />
          )}
        </Stack>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={priest.isActive}
              onChange={() => onToggleStatus(priest._id, "isActive")}
              color="success"
              size="small"
            />
          }
          label="Active"
          labelPlacement="start"
          sx={{ m: 0 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={priest.isAvailable}
              onChange={() => onToggleStatus(priest._id, "isAvailable")}
              color="success"
              size="small"
            />
          }
          label="Available"
          labelPlacement="start"
          sx={{ m: 0 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={priest.isRetired}
              onChange={() => onToggleStatus(priest._id, "isRetired")}
              color="success"
              size="small"
            />
          }
          label="Retired"
          labelPlacement="start"
          sx={{ m: 0 }}
        />
         <FormControlLabel
          control={
            <Switch
              checked={priest.isTransfered}
              onChange={() => onToggleStatus(priest._id, "isTransfered")}
              color="success"
              size="small"
            />
          }
          label="Transfered"
          labelPlacement="start"
          sx={{ m: 0 }}
        />
      </Box>
    </Paper>
  );
};

const PriestList = () => {
  const [priests, setPriests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPriestId, setSelectedPriestId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchPriests = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getAllPriest`,
          { withCredentials: true }
        );
        setPriests(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching priests:", error);
        setError("Failed to load priests. Please try again later.");
        setLoading(false);
      }
    };

    fetchPriests();
  }, []);

  const handleEdit = (priest) => {
    navigate(`/admin/priests/edit/${priest._id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/priests/new');
  };

  const handleOpenDeleteDialog = (priestId) => {
    setSelectedPriestId(priestId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedPriestId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleConfirmDelete = async () => {
    if (!selectedPriestId) return;

    try {
      setDeleteLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/deletePriest/${selectedPriestId}`,
        { withCredentials: true }
      );
      setPriests(priests.filter(priest => priest._id !== selectedPriestId));
      setSnackbar({
        open: true,
        message: 'Priest deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error("Error deleting priest:", error);
      setSnackbar({
        open: true,
        message: 'Failed to delete priest',
        severity: 'error'
      });
    } finally {
      setDeleteLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const toggleStatus = async (priestId, field) => {
    try {
      const priest = priests.find((p) => p._id === priestId);
      const newValue = !priest[field];

      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/updatePriestStatus/${priestId}`,
        { field, value: newValue },
        { withCredentials: true }
      );

      setPriests((prevPriests) =>
        prevPriests.map((p) =>
          p._id === priestId ? { ...p, [field]: newValue } : p
        )
      );
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      setSnackbar({
        open: true,
        message: `Failed to update ${field}`,
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <MetaData title="List Parish Priest" />
      <SideBar />
      <Container maxWidth="lg" sx={{ p: 3 }}>
        <Box sx={{ marginBottom: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Parish Priests
          </Typography>
          
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 3
        }}>
          {priests.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No priests found
            </Typography>
          ) : (
            priests.map((priest) => (
              <PriestCard
                key={priest._id}
                priest={priest}
                onEdit={handleEdit}
                onDelete={handleOpenDeleteDialog}
                onToggleStatus={toggleStatus}
              />
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
              Are you sure you want to delete this priest? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default PriestList;