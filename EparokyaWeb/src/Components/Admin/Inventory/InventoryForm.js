import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Divider,
  Stack
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';
import MetaData from '../../Layout/MetaData';
import SideBar from '../SideBar';

const InventoryForm = () => {
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

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Equipment',
    'Furniture',
    'Supplies',
    'Food',
    'Electronics',
    'Other'
  ];

  const units = ['pcs', 
    // 'kg', 'g', 'l', 'ml', 
    'box', 'set'];

  // Create axios instance with base config
  const api = axios.create({
    baseURL: process.env.REACT_APP_API,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Fetch item details when editing
  useEffect(() => {
    if (id) {
      const fetchItemDetails = async () => {
        try {
          setLoading(true);
          const { data } = await api.get(`/api/v1/inventory/${id}`);
          
          setFormData({
            name: data.name || '',
            description: data.description || '',
            category: data.category || 'Equipment',
            quantity: data.quantity || 0,
            unit: data.unit || 'pcs',
            price: data.price || 0,
            minStockLevel: data.minStockLevel || 0,
            location: data.location || '',
            supplier: data.supplier || ''
          });
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to fetch item details');
        } finally {
          setLoading(false);
        }
      };

      fetchItemDetails();
    }
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
      const url = id 
        ? `/api/v1/inventory/${id}`
        : '/api/v1/inventory';

      const method = id ? 'put' : 'post';

      await api[method](url, formData);

      toast.success(`Item ${id ? 'updated' : 'created'} successfully`);
      navigate('/admin/inventorylist');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && id) {
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
      <MetaData title={id ? 'Edit Inventory Item' : 'Create Inventory Item'} />
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {id ? 'Edit Inventory Item' : 'Create New Inventory Item'}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {id ? 'Update existing item details' : 'Add a new item to the inventory'}
              </Typography>
            </Box>

            <Card>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      required
                      label="Item Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                    />
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
                    <Stack direction="row" spacing={2}>
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
                    </Stack>
                    <Stack direction="row" spacing={2}>
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
                      <TextField
                        fullWidth
                        required
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Stack>
                    <TextField
                      fullWidth
                      required
                      label="Supplier"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleChange}
                      variant="outlined"
                    />
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={() => navigate('/admin/inventorylist')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={isSubmitting ? <CircularProgress size={24} /> : <Save />}
                        disabled={isSubmitting}
                      >
                        {id ? 'Update Item' : 'Create Item'}
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default InventoryForm;