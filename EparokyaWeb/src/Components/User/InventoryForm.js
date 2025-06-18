import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Button, Card, CardContent, Container, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, CircularProgress, MenuItem, Stack,
    Tabs, Tab, Paper, Avatar
} from '@mui/material';
import { Inventory, History, CheckCircle, Pending, Cancel, HourglassTop } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const InventoryForm = () => {
    const [user, setUser] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openBorrowDialog, setOpenBorrowDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [borrowQuantity, setBorrowQuantity] = useState(1);
    const [tabValue, setTabValue] = useState(0);

    const [borrowHistory, setBorrowHistory] = useState({
        pending: [],
        borrowed: [],
        returned: [],
        rejected: []
    });

    const config = useMemo(() => ({ withCredentials: true }), []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/profile`, config);
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user:", error.response?.data || error.message);
            }
        };
        fetchUser();
    }, [config]);

    const ministryRoles = Array.isArray(user?.ministryRoles)
        ? user.ministryRoles
        : user?.ministryRoles
            ? [user.ministryRoles]
            : [];

    const hasAllowedRole = ministryRoles.some(role =>
        role?.role === 'Coordinator' || role?.role === 'Assistant Coordinator'
    );

    useEffect(() => {
        const fetchInventory = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/inventory`, config);
                setInventory(data.inventoryItems);
                
                // Organize borrow history by status for the current user
                const history = {
                    pending: [],
                    borrowed: [],
                    returned: [],
                    rejected: []
                };

                data.inventoryItems.forEach(item => {
                    item.borrowHistory.forEach(record => {
                        if (record.user._id === user?._id) {
                            const historyRecord = {
                                ...record,
                                itemId: item._id,
                                itemName: item.name,
                                itemCategory: item.category,
                                itemLocation: item.location,
                                itemUnit: item.unit || 'pcs' // Default unit if not specified
                            };
                            
                            if (record.status === 'pending') {
                                history.pending.push(historyRecord);
                            } else if (record.status === 'borrowed') {
                                history.borrowed.push(historyRecord);
                            } else if (record.status === 'returned') {
                                history.returned.push(historyRecord);
                            } else if (record.status === 'rejected') {
                                history.rejected.push(historyRecord);
                            }
                        }
                    });
                });

                setBorrowHistory(history);

            } catch (err) {
                toast.error('Failed to fetch inventory');
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) fetchInventory();
    }, [user, config]);

    const handleBorrowOpen = (item) => {
        setSelectedItem(item);
        setBorrowQuantity(1);
        setOpenBorrowDialog(true);
    };

    const handleBorrowClose = () => {
        setOpenBorrowDialog(false);
        setSelectedItem(null);
    };

    const handleBorrowSubmit = async () => {
        try {
            await axios.post(
                `${process.env.REACT_APP_API}/api/v1/inventory/${selectedItem._id}/borrow`,
                { quantity: borrowQuantity },
                { withCredentials: true }
            );
            toast.success('Borrow request submitted. Waiting for admin approval.');
            handleBorrowClose();
            // Refresh data after submission
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/inventory`, config);
            setInventory(data.inventoryItems);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to request borrow');
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const renderStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <HourglassTop color="warning" />;
            case 'borrowed':
                return <CheckCircle color="primary" />;
            case 'returned':
                return <CheckCircle color="success" />;
            case 'rejected':
                return <Cancel color="error" />;
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (!hasAllowedRole) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" color="error" align="center">
                            Only Coordinators or Assistant Coordinators can request to borrow items.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" gutterBottom>
                    Request to Borrow Inventory
                </Typography>

                {/* === Borrow History Section === */}
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        <History sx={{ verticalAlign: 'middle', mr: 1 }} />
                        My Borrow History
                    </Typography>
                    
                    <Paper sx={{ mb: 4 }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab label={`All (${[...borrowHistory.pending, ...borrowHistory.borrowed, ...borrowHistory.returned, ...borrowHistory.rejected].length})`} />
                            <Tab label={`Pending (${borrowHistory.pending.length})`} />
                            <Tab label={`Borrowed (${borrowHistory.borrowed.length})`} />
                            <Tab label={`Returned (${borrowHistory.returned.length})`} />
                            <Tab label={`Rejected (${borrowHistory.rejected.length})`} />
                        </Tabs>
                    </Paper>

                    <TableContainer component={Card}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Borrowed Date</TableCell>
                                    <TableCell>Returned/Rejected Date</TableCell>
                                    <TableCell>Notes</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(() => {
                                    let itemsToShow = [];
                                    switch (tabValue) {
                                        case 0: itemsToShow = [...borrowHistory.pending, ...borrowHistory.borrowed, ...borrowHistory.returned, ...borrowHistory.rejected]; break;
                                        case 1: itemsToShow = borrowHistory.pending; break;
                                        case 2: itemsToShow = borrowHistory.borrowed; break;
                                        case 3: itemsToShow = borrowHistory.returned; break;
                                        case 4: itemsToShow = borrowHistory.rejected; break;
                                        default: itemsToShow = [];
                                    }

                                    if (itemsToShow.length === 0) {
                                        return (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">
                                                    No records found for this status
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }

                                    return itemsToShow
                                        .sort((a, b) => new Date(b.borrowedAt || b.requestedAt) - new Date(a.borrowedAt || a.requestedAt))
                                        .map((record, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                            {record.itemName.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography fontWeight="medium">{record.itemName}</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {record.itemLocation}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={record.itemCategory} size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    {record.quantity} {record.itemUnit}
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        {renderStatusIcon(record.status)}
                                                        <Typography>
                                                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                        </Typography>
                                                        {record.status === 'rejected' && record.rejectionReason && (
                                                            <Typography variant="caption" color="error">
                                                                ({record.rejectionReason})
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(record.borrowedAt)}
                                                </TableCell>
                                                <TableCell>
                                                    {record.status === 'returned' && formatDate(record.returnedAt)}
                                                    {record.status === 'rejected' && formatDate(record.rejectedAt)}
                                                    {(record.status === 'pending' || record.status === 'borrowed') && '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {record.rejectionReason && record.status === 'rejected' ? (
                                                        <Typography color="error">{record.rejectionReason}</Typography>
                                                    ) : record.notes || '-'}
                                                </TableCell>
                                            </TableRow>
                                        ));
                                })()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* === Inventory Borrow Section === */}
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        Available Items
                    </Typography>
                    
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <TableContainer component={Card}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell align="right">Available</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inventory.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                No inventory items found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        inventory.map(item => (
                                            <TableRow key={item._id} hover>
                                                <TableCell>
                                                    <Typography fontWeight="medium">{item.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.description?.substring(0, 50)}...
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={item.category} size="small" />
                                                </TableCell>
                                                <TableCell align="right">
                                                    {item.quantity} {item.unit || 'pcs'}
                                                </TableCell>
                                                <TableCell>{item.location}</TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        startIcon={<Inventory />}
                                                        disabled={item.quantity <= 0}
                                                        onClick={() => handleBorrowOpen(item)}
                                                    >
                                                        Request Borrow
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>

                {/* === Borrow Dialog === */}
                <Dialog open={openBorrowDialog} onClose={handleBorrowClose}>
                    <DialogTitle>Request to Borrow Item</DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            <strong>Item:</strong> {selectedItem?.name}
                        </Typography>
                        <Typography gutterBottom>
                            <strong>Available:</strong> {selectedItem?.quantity} {selectedItem?.unit || 'pcs'}
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Quantity to Borrow"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={borrowQuantity}
                            onChange={(e) =>
                                setBorrowQuantity(
                                    Math.max(1, Math.min(selectedItem?.quantity, Number(e.target.value)))
                                )
                            }
                            inputProps={{
                                min: 1,
                                max: selectedItem?.quantity
                            }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            Your request will be reviewed by an admin before approval.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleBorrowClose}>Cancel</Button>
                        <Button onClick={handleBorrowSubmit} variant="contained" color="primary">
                            Submit Request
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default InventoryForm;