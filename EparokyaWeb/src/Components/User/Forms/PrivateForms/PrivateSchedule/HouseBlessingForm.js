import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import GuestSidebar from '../../../../GuestSideBar';
import axios from 'axios';
import { toast } from 'react-toastify';
import MetaData from '../../../../Layout/MetaData';
import { Box } from '@mui/material';
import { Button, TextField, MenuItem, Typography } from '@mui/material';

// import phLocations from 'philippines';
// import { municipalities, searchBaranggay } from 'ph-geo-admin-divisions';

const HouseBlessingForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        blessingDate: '',
        blessingTime: '',
        address: {
            BldgNameTower: '',
            LotBlockPhaseHouseNo: '',
            SubdivisionVillageZone: '',
            Street: '',
            District: '',
            barangay: '',
            city: '',
        },
    });
    const [user, setUser] = useState(null);
    const [cities] = useState(['Taguig City', 'Others']);
    const [barangays] = useState([
        'Bagumbayan', 'Bambang', 'Calzada', 'Cembo', 'Central Bicutan',
        'Central Signal Village',
        'Comembo',
        'East Rembo',
        'Fort Bonifacio',
        'Hagonoy',
        'Ibayo-Tipas',
        'Katuparan',
        'Ligid-Tipas',
        'Lower Bicutan',
        'Maharlika Village',
        'Napindan',
        'New Lower Bicutan',
        'North Daang Hari',
        'North Signal Village',
        'Palingon',
        'Pembo',
        'Pinagsama',
        'Pitogo',
        'Post Proper Northside',
        'Post Proper Southside',
        'Rizal',
        'San Miguel',
        'Santa Ana',
        'South Cembo',
        'South Daang Hari',
        'South Signal Village',
        'Tanyag',
        'Tuktukan',
        'Upper Bicutan',
        'Ususan',
        'Wawa',
        'West Rembo',
        'Western Bicutan',
        'Others'
    ]);
    const [customCity, setCustomCity] = useState('');
    const [customBarangay, setCustomBarangay] = useState('');

    const config = {
        withCredentials: true,
    };

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

    const handleChange = (e, fieldPath) => {
        const keys = fieldPath.split('.');
        setFormData((prev) => {
            const updated = { ...prev };
            let current = updated;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = e.target.value;

            console.log('Updated Form Data:', updated);
            return updated;
        });
    };

    const handleClear = () => {
        setFormData({
            fullName: '',
            contactNumber: '',
            blessingDate: '',
            blessingTime: '',
            address: {
                houseDetails: '',
                block: '',
                lot: '',
                phase: '',
                street: '',
                baranggay: '',
                district: '',
                city: '',
            },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fullName, contactNumber, blessingDate, blessingTime, address } = formData;

        if (!fullName || !contactNumber || !blessingDate || !blessingTime) {
            toast.error('Please fill out all required fields!');
            return;
        }
        console.log('Submission Data:', formData);

        try {
            const submissionData = {
                ...formData,
                address: {
                    ...formData.address,
                    customCity: formData.address.city === 'Others' ? customCity : undefined,
                    customBarangay: formData.address.baranggay === 'Others' ? customBarangay : undefined,
                },
                userId: user?._id,
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/houseBlessingSubmit`,
                submissionData,
                config
            );

            if (response.status === 201) {
                toast.success('House Blessing Form submitted successfully!');
                handleClear();
            } else {
                toast.error(response.data?.error || 'Unexpected error occurred.');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            toast.error(error.response?.data?.error || 'Submission failed.');
        }
    };

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, city: selectedCity, baranggay: '' },
        }));

        if (selectedCity === 'Others') {
            setCustomCity('');
        }
    };

    const handleBarangayChange = (e) => {
        const selectedBarangay = e.target.value;
        setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, baranggay: selectedBarangay },
        }));

        if (selectedBarangay === 'Others') {
            setCustomBarangay('');
        }
    };

    return (
        <Box display="flex">
            <MetaData title="House Blessing Form" />
            <Box display="flex" bgcolor="#f9f9f9" width="100%">
                <GuestSidebar />
                <Box flex={1} p={2}>
                    <form onSubmit={handleSubmit}>
                        <Typography variant="h4" gutterBottom>House Blessing Information</Typography>
                        <TextField
                            label="Full Name"
                            value={formData.fullName}
                            onChange={(e) => handleChange(e, 'fullName')}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Contact Number"
                            value={formData.contactNumber}
                            onChange={(e) => handleChange(e, 'contactNumber')}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="House Blessing Date"
                            type="date"
                            value={formData.blessingDate}
                            onChange={(e) => handleChange(e, 'blessingDate')}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="House Blessing Time (Format: 7:00AM)"
                            value={formData.blessingTime}
                            onChange={(e) => handleChange(e, 'blessingTime')}
                            fullWidth
                            margin="normal"
                        />
                        <Typography variant="h4" gutterBottom>Address</Typography>
                        {['BldgNameTower', 'LotBlockPhaseHouseNo', 'SubdivisionVillageZone', 'Street', 'District'].map((field) => (
                            <TextField
                                key={field}
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                value={formData.address[field] || ''}
                                onChange={(e) => handleChange(e, `address.${field}`)}
                                fullWidth
                                margin="normal"
                            />
                        ))}
                        <TextField
                            select
                            label="City"
                            value={formData.address.city}
                            onChange={handleCityChange}
                            fullWidth
                            margin="normal"
                        >
                            <MenuItem value="">Select a city</MenuItem>
                            {cities.map((city, index) => (
                                <MenuItem key={index} value={city}>{city}</MenuItem>
                            ))}
                        </TextField>
                        {formData.address.city === 'Others' && (
                            <TextField
                                label="Add City"
                                value={customCity}
                                onChange={(e) => setCustomCity(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        )}
                        <TextField
                            select
                            label="Barangay"
                            value={formData.address.barangay}
                            onChange={handleBarangayChange}
                            fullWidth
                            margin="normal"
                        >
                            <MenuItem value="">Select a barangay</MenuItem>
                            {barangays.map((barangay, index) => (
                                <MenuItem key={index} value={barangay}>{barangay}</MenuItem>
                            ))}
                        </TextField>
                        {formData.address.barangay === 'Others' && (
                            <TextField
                                label="Add Barangay"
                                value={customBarangay}
                                onChange={(e) => setCustomBarangay(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        )}
                        <Box display="flex" justifyContent="flex-end" mt={4}>
                            <Button variant="outlined" onClick={handleClear} style={{ marginRight: '8px' }}>
                                Clear All Fields
                            </Button>
                            <Button variant="contained" type="submit">
                                Submit
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default HouseBlessingForm;
