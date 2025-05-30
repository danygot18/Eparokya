import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import Sidebar from './SideBar';
import Loader from '../Layout/Loader';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddReadings = () => {
  const [formData, setFormData] = useState({
    date: '',
    firstReading: '',
    responsorialPsalm: '',
    response: '',
    secondReading: '',
    gospel: '',
  });

  const [loading, setLoading] = useState(false);
  const [readingDates, setReadingDates] = useState([]);

  const fetchReadings = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllreadings`, { withCredentials: true });
      setReadingDates(res.data.readings);
    } catch (error) {
      console.error('Failed to fetch readings:', error);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API}/api/v1/deleteReading/${id}`, { withCredentials: true });
      toast.success('Reading deleted successfully');
      fetchReadings();
    } catch (error) {
      console.error('Failed to delete reading:', error);
      toast.error('Failed to delete reading');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.date) {
      toast.error('Please select a date.', { position: 'top-right', autoClose: 2500 });
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/addReadings`,
        formData,
        { withCredentials: true }
      );
      toast.success('Reading successfully added!', {
        position: 'top-right',
        autoClose: 2500,
        style: { marginTop: '60px' },
      });
      setFormData({
        date: '',
        firstReading: '',
        responsorialPsalm: '',
        response: '',
        secondReading: '',
        gospel: '',
      });
      fetchReadings();
    } catch (error) {
      console.error(error);
      toast.error('Error adding reading.', { position: 'top-right', autoClose: 2500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4, display: 'flex', gap: 4 }}>
        <ToastContainer />
        {loading && <Loader />}

        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>Add Mass Reading</Typography>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Date"
                type="date"
                name="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={handleChange}
              />
              <TextField label="First Reading" name="firstReading" fullWidth multiline value={formData.firstReading} onChange={handleChange} />
              <TextField label="Responsorial Psalm" name="responsorialPsalm" fullWidth multiline value={formData.responsorialPsalm} onChange={handleChange} />
              <TextField label="Psalm Response" name="response" fullWidth value={formData.response} onChange={handleChange} />
              <TextField label="Second Reading" name="secondReading" fullWidth multiline value={formData.secondReading} onChange={handleChange} />
              <TextField label="Gospel" name="gospel" fullWidth multiline value={formData.gospel} onChange={handleChange} />
              <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </Stack>
          </Paper>
        </Box>

        <Box sx={{ flex: 0.7 }}>
          <Typography variant="h6" gutterBottom>Created Reading Dates</Typography>
          <Paper sx={{ p: 2, maxHeight: 500, overflowY: 'auto' }}>
            <Stack spacing={1}>
              {readingDates.length === 0 ? (
                <Typography>No readings created yet.</Typography>
              ) : (
                readingDates.map((reading) => (
                  <Box
                    key={reading._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      p: 1,
                    }}
                  >
                    <Typography sx={{ whiteSpace: 'nowrap' }}>
                      {new Date(reading.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>

                    <IconButton color="error" onClick={() => handleDelete(reading._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </Box>

      </Box>
    </Box>
  );
};

export default AddReadings;
