import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import GuestSidebar from '../../../../GuestSideBar';
import axios from 'axios';
import { toast } from 'react-toastify';
import MetaData from '../../../../Layout/MetaData';
import { Box } from '@mui/material';
import { Button, TextField, MenuItem, Typography, FormControlLabel, Checkbox } from '@mui/material';

const HouseBlessingForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        blessingDate: '',
        blessingTime: '',
        propertyType: '',
        customPropertyType: '',
        floors: 1,
        rooms: 1,
        propertySize: '',
        isNewConstruction: false,
        specialRequests: '',
        address: {
            BldgNameTower: '',
            LotBlockPhaseHouseNo: '',
            SubdivisionVillageZone: '',
            Street: '',
            district: '',
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

    const propertyTypes = ['House', 'Apartment', 'Condominium', 'Building', 'Store', 'Office', 'Others'];
    const propertySizes = [
        'Small (below 50 sqm)',
        'Medium (50-100 sqm)',
        'Large (100-200 sqm)',
        'Extra Large (above 200 sqm)'
    ];

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
            return updated;
        });
    };

    const handleCheckboxChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.checked
        }));
    };

    const handleClear = () => {
        setFormData({
            fullName: '',
            contactNumber: '',
            blessingDate: '',
            blessingTime: '',
            propertyType: '',
            customPropertyType: '',
            floors: 1,
            rooms: 1,
            propertySize: '',
            isNewConstruction: false,
            specialRequests: '',
            address: {
                BldgNameTower: '',
                LotBlockPhaseHouseNo: '',
                SubdivisionVillageZone: '',
                Street: '',
                district: '',
                barangay: '',
                city: '',
            },
        });
        setCustomCity('');
        setCustomBarangay('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fullName, contactNumber, blessingDate, blessingTime, address, 
                propertyType, floors, rooms, propertySize, isNewConstruction } = formData;

        if (!fullName || !contactNumber || !blessingDate || !blessingTime ||
            !address.Street || !address.district || !address.barangay || !address.city ||
            !propertyType || !floors || !rooms || !propertySize || isNewConstruction === undefined
        ) {
            toast.error('Please fill out all required fields!');
            return;
        }

        if (propertyType === 'Others' && !formData.customPropertyType) {
            toast.error('Please specify the property type');
            return;
        }

        try {
            const submissionData = {
                ...formData,
                address: {
                    ...formData.address,
                    customCity: formData.address.city === 'Others' ? customCity : undefined,
                    customBarangay: formData.address.barangay === 'Others' ? customBarangay : undefined,
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
            address: { ...prev.address, city: selectedCity, barangay: '' },
        }));

        if (selectedCity === 'Others') {
            setCustomCity('');
        }
    };

    const handleBarangayChange = (e) => {
        const selectedBarangay = e.target.value;
        setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, barangay: selectedBarangay },
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
                        
                        {/* Basic Information */}
                        <TextField
                            label="Full Name"
                            value={formData.fullName}
                            onChange={(e) => handleChange(e, 'fullName')}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Contact Number"
                            value={formData.contactNumber}
                            onChange={(e) => handleChange(e, 'contactNumber')}
                            fullWidth
                            margin="normal"
                            required
                        />
                        
                        {/* Property Details */}
                        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Property Details</Typography>
                        
                        <TextField
                            select
                            label="Property Type"
                            value={formData.propertyType}
                            onChange={(e) => handleChange(e, 'propertyType')}
                            fullWidth
                            margin="normal"
                            required
                        >
                            <MenuItem value="">Select property type</MenuItem>
                            {propertyTypes.map((type, index) => (
                                <MenuItem key={index} value={type}>{type}</MenuItem>
                            ))}
                        </TextField>
                        
                        {formData.propertyType === 'Others' && (
                            <TextField
                                label="Specify Property Type"
                                value={formData.customPropertyType}
                                onChange={(e) => handleChange(e, 'customPropertyType')}
                                fullWidth
                                margin="normal"
                                required
                            />
                        )}
                        
                        <Box display="flex" gap={2}>
                            <TextField
                                label="Number of Floors"
                                type="number"
                                value={formData.floors}
                                onChange={(e) => handleChange(e, 'floors')}
                                margin="normal"
                                required
                                inputProps={{ min: 1 }}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="Number of Rooms"
                                type="number"
                                value={formData.rooms}
                                onChange={(e) => handleChange(e, 'rooms')}
                                margin="normal"
                                required
                                inputProps={{ min: 1 }}
                                sx={{ flex: 1 }}
                            />
                        </Box>
                        
                        <TextField
                            select
                            label="Property Size"
                            value={formData.propertySize}
                            onChange={(e) => handleChange(e, 'propertySize')}
                            fullWidth
                            margin="normal"
                            required
                        >
                            <MenuItem value="">Select property size</MenuItem>
                            {propertySizes.map((size, index) => (
                                <MenuItem key={index} value={size}>{size}</MenuItem>
                            ))}
                        </TextField>
                        
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.isNewConstruction}
                                    onChange={handleCheckboxChange}
                                    name="isNewConstruction"
                                />
                            }
                            label="Is this a new construction?"
                            sx={{ mt: 1 }}
                        />
                        
                        {/* Blessing Details */}
                        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Blessing Details</Typography>
                        
                        <TextField
                            label="Blessing Date"
                            type="date"
                            value={formData.blessingDate}
                            onChange={(e) => handleChange(e, 'blessingDate')}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            label="Blessing Time (Format: 7:00AM)"
                            value={formData.blessingTime}
                            onChange={(e) => handleChange(e, 'blessingTime')}
                            fullWidth
                            margin="normal"
                            required
                        />
                        
                        {/* Address */}
                        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Address</Typography>
                        
                        {['BldgNameTower', 'LotBlockPhaseHouseNo', 'SubdivisionVillageZone', 'Street', 'district'].map((field) => (
                            <TextField
                                key={field}
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                value={formData.address[field] || ''}
                                onChange={(e) => handleChange(e, `address.${field}`)}
                                fullWidth
                                margin="normal"
                                required={field === 'Street' || field === 'district'}
                            />
                        ))}
                        
                        <TextField
                            select
                            label="City"
                            value={formData.address.city}
                            onChange={handleCityChange}
                            fullWidth
                            margin="normal"
                            required
                        >
                            <MenuItem value="">Select a city</MenuItem>
                            {cities.map((city, index) => (
                                <MenuItem key={index} value={city}>{city}</MenuItem>
                            ))}
                        </TextField>
                        
                        {formData.address.city === 'Others' && (
                            <TextField
                                label="Specify City"
                                value={customCity}
                                onChange={(e) => setCustomCity(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                            />
                        )}
                        
                        <TextField
                            select
                            label="Barangay"
                            value={formData.address.barangay}
                            onChange={handleBarangayChange}
                            fullWidth
                            margin="normal"
                            required
                        >
                            <MenuItem value="">Select a barangay</MenuItem>
                            {barangays.map((barangay, index) => (
                                <MenuItem key={index} value={barangay}>{barangay}</MenuItem>
                            ))}
                        </TextField>
                        
                        {formData.address.barangay === 'Others' && (
                            <TextField
                                label="Specify Barangay"
                                value={customBarangay}
                                onChange={(e) => setCustomBarangay(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                            />
                        )}
                        
                        {/* Special Requests */}
                        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Additional Information</Typography>
                        
                        <TextField
                            label="Special Requests (Optional)"
                            value={formData.specialRequests}
                            onChange={(e) => handleChange(e, 'specialRequests')}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        
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