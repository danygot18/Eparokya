import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Button, Card, CardContent, Container, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, CircularProgress, MenuItem, Stack
} from '@mui/material';
import { Inventory } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const InventoryForm = () => {
    const [user, setUser] = useState(null);

    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openBorrowDialog, setOpenBorrowDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [borrowQuantity, setBorrowQuantity] = useState(1);

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

    console.log("InventoryForm user:", user);
    console.log("InventoryForm user.ministryRoles:", user?.ministryRoles);


    const hasAllowedRole = ministryRoles.some(role =>
        role?.role === 'Coordinator' || role?.role === 'Assistant Coordinator'
    );


    useEffect(() => {
        const fetchInventory = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/inventory`, {
                    withCredentials: true
                });
                setInventory(data.inventoryItems);
            } catch (err) {
                toast.error('Failed to fetch inventory');
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

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
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to request borrow');
        }
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
                                                {item.availableQuantity} {item.unit}
                                            </TableCell>
                                            <TableCell>{item.location}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    startIcon={<Inventory />}
                                                    disabled={item.availableQuantity <= 0}
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

                {/* Borrow Dialog */}
                <Dialog open={openBorrowDialog} onClose={handleBorrowClose}>
                    <DialogTitle>Request to Borrow Item</DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            <strong>Item:</strong> {selectedItem?.name}
                        </Typography>
                        <Typography gutterBottom>
                            <strong>Available:</strong> {selectedItem?.availableQuantity} {selectedItem?.unit}
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
                                    Math.max(1, Math.min(selectedItem?.availableQuantity, Number(e.target.value)))
                                )
                            }
                            inputProps={{
                                min: 1,
                                max: selectedItem?.availableQuantity
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