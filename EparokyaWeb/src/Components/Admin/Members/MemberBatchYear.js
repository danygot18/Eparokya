import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../SideBar';
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
    List,
    ListItem,
    ListItemText,
    Divider,
    Stack
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const MemberBatchYear = () => {
    const [yearRanges, setYearRanges] = useState([]);
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [yearToDelete, setYearToDelete] = useState(null);

    useEffect(() => {
        fetchYearRanges();
    }, []);

    const fetchYearRanges = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/getAllMemberYear`,
                { withCredentials: true }
            );
            setYearRanges(response.data.data || []);
        } catch (error) {
            console.error('Error fetching year ranges:', error);
            toast.error('Failed to load year ranges');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!startYear || !endYear) {
            toast.error('Both start year and end year are required.');
            return;
        }

        if (parseInt(startYear) >= parseInt(endYear)) {
            toast.error('End year must be greater than start year');
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                `${process.env.REACT_APP_API}/api/v1/createMemberYear`,
                { yearRange: { startYear, endYear } },
                { withCredentials: true }
            );
            toast.success('Year range successfully added.');
            fetchYearRanges();
            setStartYear('');
            setEndYear('');
        } catch (error) {
            console.error('Error creating year range:', error);
            toast.error(
                error.response?.data?.message || 'There was an error adding the year range.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDeleteDialog = (year) => {
        setYearToDelete(year);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setYearToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!yearToDelete) return;

        try {
            setDeleteLoading(true);
            await axios.delete(
                `${process.env.REACT_APP_API}/api/v1/deleteMemberYear/${yearToDelete._id}`,
                { withCredentials: true }
            );
            toast.success('Year range deleted successfully');
            fetchYearRanges();
        } catch (error) {
            console.error('Error deleting year range:', error);
            toast.error('Failed to delete year range');
        } finally {
            setDeleteLoading(false);
            handleCloseDeleteDialog();
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <SideBar />
            <Container maxWidth="xl" sx={{ p: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    {/* Left Pane - Form */}
                    <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Add Year Range
                        </Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <TextField
                                label="Start Year"
                                type="number"
                                fullWidth
                                value={startYear}
                                onChange={(e) => setStartYear(e.target.value)}
                                inputProps={{ min: 1900, max: 2100 }}
                            />
                            <TextField
                                label="End Year"
                                type="number"
                                fullWidth
                                value={endYear}
                                onChange={(e) => setEndYear(e.target.value)}
                                inputProps={{ min: 1900, max: 2100 }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleCreate}
                                disabled={loading}
                                sx={{ alignSelf: 'flex-start' }}
                            >
                                {loading ? 'Adding...' : 'Add Year Range'}
                            </Button>
                        </Stack>
                    </Paper>

                    {/* Right Pane - List */}
                    <Paper elevation={3} sx={{ p: 3, flex: 2 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Year Ranges
                        </Typography>
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : yearRanges.length > 0 ? (
                            <List>
                                {yearRanges.map((year) => (
                                    <React.Fragment key={year._id}>
                                        <ListItem
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => handleOpenDeleteDialog(year)}
                                                    color="error"
                                                    disabled={loading}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary={`${year.yearRange.startYear} - ${year.yearRange.endYear}`}
                                                primaryTypographyProps={{
                                                    variant: 'h6',
                                                    fontWeight: 'medium'
                                                }}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                No year ranges found
                            </Typography>
                        )}
                    </Paper>
                </Stack>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Delete Year Range
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete the year range{' '}
                            {yearToDelete && `${yearToDelete.yearRange.startYear} - ${yearToDelete.yearRange.endYear}`}?
                            This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={handleCloseDeleteDialog} 
                            disabled={deleteLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
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

export default MemberBatchYear;