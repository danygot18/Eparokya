import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Stack
} from '@mui/material';
import { Add, Delete, Edit, Warning, Search, Inventory, Person, History } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import MetaData from '../../Layout/MetaData';
import SideBar from '../SideBar';

const InventoryList = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Borrow/Return states
  const [openBorrowDialog, setOpenBorrowDialog] = useState(false);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [borrowQuantity, setBorrowQuantity] = useState(1);
  const [returnData, setReturnData] = useState({ borrowId: '', quantity: 1 });
  const [historyData, setHistoryData] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const categories = [
    'all',
    'Equipment',
    'Furniture',
    'Supplies',
    'Food',
    'Electronics',
    'Other'
  ];

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: page + 1,
        perPage: rowsPerPage,
        ...(searchTerm && { keyword: searchTerm }),
        ...(categoryFilter !== 'all' && { category: categoryFilter })
      };

      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/inventory`, {
        params,
        withCredentials: true
      });

      setInventory(data.inventoryItems);
      setInventoryCount(data.inventoryCount);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch inventory');
      toast.error(err.response?.data?.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const deleteInventoryItem = async (id) => {
    try {
      setDeleteLoading(true);

      await axios.delete(`${process.env.REACT_APP_API}/api/v1/inventory/${id}`, {
        withCredentials: true
      });

      toast.success('Item deleted successfully');
      fetchInventory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete item');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // Borrow functions
  const handleBorrowOpen = (item) => {
    setSelectedItem(item);
    setBorrowQuantity(1);
    setOpenBorrowDialog(true);
  };

  const handleBorrowClose = () => {
    setOpenBorrowDialog(false);
    setSelectedItem(null);
  };

  const handleReturnOpen = (item) => {
    setSelectedItem(item);
    setReturnData({ borrowId: '', quantity: 1 });
    setOpenReturnDialog(true);
  };

  const handleHistoryOpen = async (item) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/inventory/${item._id}/borrow-history`, {
        withCredentials: true
      });
      setHistoryData(data.borrowHistory);
      setSelectedItem(item);
      setOpenHistoryDialog(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch history');
    }
  };

  const handleBorrowSubmit = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/inventory/${selectedItem._id}/borrow`,
        { quantity: borrowQuantity },
        { withCredentials: true }
      );

      toast.success('Item borrowed successfully');
      fetchInventory();
      handleBorrowClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to borrow item');
    }
  };

  const handleReturnSubmit = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/inventory/${selectedItem._id}/return`,
        returnData,
        { withCredentials: true }
      );

      toast.success('Item returned successfully');
      fetchInventory();
      handleReturnClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return item');
    }
  };

  const handleReturnClose = () => {
    setOpenReturnDialog(false);
    setSelectedItem(null);
  };

  const handleHistoryClose = () => {
    setOpenHistoryDialog(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    fetchInventory();
  }, [page, rowsPerPage, searchTerm, categoryFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(0);
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteInventoryItem(itemToDelete);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Equipment': return 'primary';
      case 'Furniture': return 'secondary';
      case 'Supplies': return 'info';
      case 'Food': return 'success';
      case 'Electronics': return 'warning';
      default: return 'default';
    }
  };

  const getStockStatus = (quantity, minStockLevel, availableQuantity) => {
    if (availableQuantity <= 0) return { status: 'Out of Stock', color: 'error' };
    if (availableQuantity < minStockLevel) return { status: 'Low Stock', color: 'warning' };
    if (quantity > availableQuantity) return { status: `${quantity - availableQuantity} Borrowed`, color: 'info' };
    return { status: 'In Stock', color: 'success' };
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <MetaData title="Inventory Management" />
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Inventory Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage all church inventory items
            </Typography>
          </Box>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Search Items"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1 }} />,
                  }}
                />
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  label="Filter by Category"
                  value={categoryFilter}
                  onChange={handleCategoryFilterChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </MenuItem>
                  ))}
                </TextField>
                <Box sx={{ textAlign: { xs: 'center', md: 'right' }, width: '100%' }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/admin/inventoryForm')}
                  >
                    Add New Item
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {loading ? (
            <CircularProgress />
          ) : (
            <Paper elevation={3}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Total Qty</TableCell>
                      <TableCell align="right">Available</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No inventory items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      inventory.map((item) => {
                        const stockStatus = getStockStatus(item.quantity, item.minStockLevel, item.availableQuantity);
                        return (
                          <TableRow key={item._id} hover>
                            <TableCell>
                              <Typography fontWeight="medium">{item.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.description.substring(0, 50)}...
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={item.category}
                                color={getCategoryColor(item.category)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              {item.quantity} {item.unit}
                              {item.quantity < item.minStockLevel && (
                                <Tooltip title={`Minimum stock level: ${item.minStockLevel}`}>
                                  <Warning color="warning" sx={{ ml: 1 }} />
                                </Tooltip>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              {item.availableQuantity} {item.unit}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={stockStatus.status}
                                color={stockStatus.color}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell align="center">
                              <Tooltip title="Edit">
                                <IconButton
                                  color="primary"
                                  onClick={() => navigate(`/admin/inventory/${item._id}`)}
                                  sx={{
                                    borderRadius: 1, // ← make corners less rounded (1 = 4px)
                                    padding: '6px 12px', // ← increase padding to make it less circular
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.08)', // customize as needed
                                    },
                                  }}
                                >
                                  <Edit
                                    sx={{
                                      '&:hover': {
                                        color: 'secondary.main',
                                      },
                                    }}
                                  />
                                </IconButton>

                              </Tooltip>
                              <Tooltip title="Borrow">
                                <IconButton
                                  color="success"
                                  onClick={() => handleBorrowOpen(item)}
                                  disabled={item.availableQuantity <= 0}
                                  sx={{
                                    borderRadius: 1, // ← make corners less rounded (1 = 4px)
                                    padding: '6px 12px', // ← increase padding to make it less circular
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.08)', // customize as needed
                                    },
                                  }}
                                >
                                  <Inventory
                                    sx={{
                                      '&:hover': {
                                        color: 'secondary.main',
                                      },
                                    }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Return">
                                <IconButton
                                  color="info"
                                  onClick={() => handleReturnOpen(item)}
                                  disabled={item.quantity === item.availableQuantity}
                                  sx={{
                                    borderRadius: 1, // ← make corners less rounded (1 = 4px)
                                    padding: '6px 12px', // ← increase padding to make it less circular
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.08)', // customize as needed
                                    },
                                  }}
                                >
                                  <Person />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="History">
                                <IconButton
                                  color="secondary"
                                  onClick={() => handleHistoryOpen(item)}
                                  sx={{
                                    borderRadius: 1, // ← make corners less rounded (1 = 4px)
                                    padding: '6px 12px', // ← increase padding to make it less circular
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.08)', // customize as needed
                                    },
                                  }}
                                >
                                  <History />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteClick(item._id)}
                                  sx={{
                                    borderRadius: 1, // ← make corners less rounded (1 = 4px)
                                    padding: '6px 12px', // ← increase padding to make it less circular
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.08)', // customize as needed
                                    },
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={inventoryCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}
        </Container>
      </Box>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Inventory Item</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this inventory item? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Borrow Dialog */}
      <Dialog open={openBorrowDialog} onClose={handleBorrowClose}>
        <DialogTitle>Borrow Inventory Item</DialogTitle>
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
            onChange={(e) => setBorrowQuantity(Math.max(1, Math.min(selectedItem?.availableQuantity, e.target.value)))}
            inputProps={{
              min: 1,
              max: selectedItem?.availableQuantity
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBorrowClose}>Cancel</Button>
          <Button onClick={handleBorrowSubmit} variant="contained" color="primary">
            Confirm Borrow
          </Button>
        </DialogActions>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={openReturnDialog} onClose={handleReturnClose}>
        <DialogTitle>Return Inventory Item</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            <strong>Item:</strong> {selectedItem?.name}
          </Typography>
          <Typography gutterBottom>
            <strong>Borrowed:</strong> {selectedItem?.quantity - selectedItem?.availableQuantity} {selectedItem?.unit}
          </Typography>
          <TextField
            select
            margin="dense"
            label="Select Borrow Record"
            fullWidth
            variant="standard"
            value={returnData.borrowId}
            onChange={(e) => setReturnData({ ...returnData, borrowId: e.target.value })}
          >
            {selectedItem?.borrowHistory
              ?.filter(record => record.status === 'borrowed')
              .map(record => (
                <MenuItem key={record._id} value={record._id}>
                  Borrowed {record.quantity} on {new Date(record.borrowedAt).toLocaleDateString()}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            margin="dense"
            label="Quantity to Return"
            type="number"
            fullWidth
            variant="standard"
            value={returnData.quantity}
            onChange={(e) => setReturnData({ ...returnData, quantity: e.target.value })}
            inputProps={{
              min: 1
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReturnClose}>Cancel</Button>
          <Button onClick={handleReturnSubmit} variant="contained" color="primary">
            Confirm Return
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog
        open={openHistoryDialog}
        onClose={handleHistoryClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Borrow History for {selectedItem?.name}
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Borrowed Date</TableCell>
                  <TableCell align="center">Returned Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyData.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{record.user?.name || 'Unknown User'}</TableCell>
                    <TableCell align="center">{record.quantity} {selectedItem?.unit}</TableCell>
                    <TableCell align="center">
                      {new Date(record.borrowedAt).toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      {record.returnedAt ? new Date(record.returnedAt).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell align="center">
                      {record.status === 'borrowed' ? (
                        <Chip label="Borrowed" color="warning" size="small" />
                      ) : (
                        <Chip label="Returned" color="success" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHistoryClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryList;