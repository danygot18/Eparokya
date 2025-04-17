import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';
import MetaData from '../../Layout/MetaData';
import SideBar from '../SideBar';


const EditInventory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Equipment',
    quantity: 0,
    unit: 'pcs',
    price: 0,
    minStockLevel: 0,
    location: '',
    supplier: ''
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'Equipment',
    'Furniture',
    'Supplies',
    'Food',
    'Electronics',
    'Other'
  ];

  const config = {
    withCredentials: true,

  };

  const units = ['pcs', 'kg', 'g', 'l', 'ml', 'box', 'set'];

  // Create axios instance with base config


  // Fetch inventory item details
  useEffect(() => {
    const fetchInventoryItem = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/inventory/${id}`, config);

        setFormData({
          name: data.inventoryItem.name || '',
          description: data.inventoryItem.description || '',
          category: data.inventoryItem.category || 'Equipment',
          quantity: data.inventoryItem.quantity || 0,
          unit: data.inventoryItem.unit || 'pcs',
          price: data.inventoryItem.price || 0,
          minStockLevel: data.inventoryItem.minStockLevel || 0,
          location: data.inventoryItem.location || '',
          supplier: data.inventoryItem.supplier || ''
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch inventory item');
        toast.error(err.response?.data?.message || 'Failed to fetch inventory item');
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' || name === 'minStockLevel'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/inventory/${id}`,
        formData,
        {
          ...config,
          headers: {
            'Content-Type': 'application/json', // or multipart/form-data only if you're sending files
          }
        }
      );
      toast.success('Inventory item updated successfully');
      navigate('/admin/inventorylist');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update inventory item');
      console.error(err.response?.data?.message);
      toast.error(err.response?.data?.message || 'Failed to update inventory item');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Container maxWidth="lg">
            <CircularProgress />
          </Container>
        </Box>
      </Box>
    );
  }



  return (
    <Box sx={{ display: 'flex' }}>
      <MetaData title="Edit Inventory Item" />
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Edit Inventory Item
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Update existing item details
            </Typography>
          </Box>

          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Item Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      required
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      variant="outlined"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={3}
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="Quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      variant="outlined"
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      fullWidth
                      required
                      label="Unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      variant="outlined"
                    >
                      {units.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="Price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      variant="outlined"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="Minimum Stock Level"
                      name="minStockLevel"
                      value={formData.minStockLevel}
                      onChange={handleChange}
                      variant="outlined"
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Supplier"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={() => navigate('/admin/inventory')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Updating...' : 'Update Item'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default EditInventory;