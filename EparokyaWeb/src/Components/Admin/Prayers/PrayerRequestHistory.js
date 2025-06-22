import React, { useEffect, useState } from 'react';
import {
    Box,
    Modal,
    Typography,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Pagination,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import axios from 'axios';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 800,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflow: 'auto'
};

const PrayerRequestHistory = ({ open, onClose, prayerType }) => {
    const [tab, setTab] = useState('Accepted');
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
    const [selectedPrayerId, setSelectedPrayerId] = useState(null);

    const perPage = 10;

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/history`, {
                params: {
                    status: tab !== 'Upcoming' ? tab : undefined,
                    upcoming: tab === 'Upcoming' ? true : undefined,
                    prayerType,
                    page,
                },
            });

            setData(res.data.requests);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Error fetching prayer request history:', err);
        }
    };

    useEffect(() => {
        if (open) fetchHistory();
    }, [tab, page, open]);

    const formatTime = (timeStr) => {
        if (!timeStr) return '—';
        const date = new Date(`1970-01-01T${timeStr}`);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const handleDeleteClick = (prayerId) => {
        setSelectedPrayerId(prayerId);
        setOpenDeleteDialog(true);
    };

    const handleArchiveClick = (prayerId) => {
        setSelectedPrayerId(prayerId);
        setOpenArchiveDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/history/${selectedPrayerId}`);
            fetchHistory();
            setOpenDeleteDialog(false);
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const confirmArchive = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API}/api/v1/history/${selectedPrayerId}/archive`);
            fetchHistory();
            setOpenArchiveDialog(false);
        } catch (err) {
            console.error("Archive failed:", err);
        }
    };




    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        Prayer Request History {prayerType ? `- ${prayerType}` : ""}
                    </Typography>

                    <Tabs
                        value={tab}
                        onChange={(e, newVal) => {
                            setTab(newVal);
                            setPage(1);
                        }}
                    >
                        <Tab label="Accepted" value="Accepted" />
                        <Tab label="Cancelled" value="Cancelled" />
                        <Tab label="Rescheduled" value="Rescheduled" />
                        <Tab label="Upcoming" value="Upcoming" />
                        <Tab label="Done" value="Done" />

                    </Tabs>

                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Offeror</strong></TableCell>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Time</strong></TableCell>
                                    <TableCell><strong>Intentions</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No prayer requests found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((req) => (
                                        <TableRow key={req._id}>
                                            <TableCell>{req.offerrorsName}</TableCell>
                                            <TableCell>
                                                {req.prayerRequestDate
                                                    ? new Date(req.prayerRequestDate).toLocaleDateString()
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {formatTime(req.UpdateTime || req.prayerRequestTime)}
                                            </TableCell>
                                            <TableCell>
                                                {Array.isArray(req.Intentions) && req.Intentions.length > 0
                                                    ? req.Intentions.map(i => i.name).join(', ')
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>{req.prayerStatus || 'N/A'}</TableCell>

                                            {tab === "Done" && (
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleDeleteClick(req._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="warning"
                                                        onClick={() => handleArchiveClick(req._id)}
                                                        sx={{ ml: 1 }}
                                                    >
                                                        Archive
                                                    </Button>
                                                </TableCell>
                                            )}

                                        </TableRow>

                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(e, val) => setPage(val)}
                        />
                    </Box>

                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button variant="contained" color="secondary" onClick={onClose}>
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Permanent Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Enabling this button will activate monthly deletion. By deleting this prayer, it will be permanently removed from the database.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openArchiveDialog} onClose={() => setOpenArchiveDialog(false)}>
                <DialogTitle>Confirm Archive</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to archive this prayer? This will hide it from frontend views, but will not delete it from the database.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenArchiveDialog(false)}>Cancel</Button>
                    <Button color="warning" variant="contained" onClick={confirmArchive}>
                        Confirm Archive
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PrayerRequestHistory;
