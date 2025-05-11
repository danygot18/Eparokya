import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import GuestSidebar from '../../../../GuestSideBar';
import './counselingLayouts/counselingForm.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import MetaData from '../../../../Layout/MetaData';
import { Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import TermsModal from "../../../../TermsModal";
import termsAndConditionsText from "../../../../TermsAndConditionText";

const CounselingForm = () => {
    const [formData, setFormData] = useState({
        person: { fullName: '', dateOfBirth: '' },
        purpose: '',
        contactPerson: { fullName: '', contactNumber: '', relationship: '' },
        contactNumber: '',
        address: {
            BldgNameTower: '',
            LotBlockPhaseHouseNo: '',
            SubdivisionVillageZone: '',
            Street: '',
            District: '',
            barangay: '',
            city: '',
        },
        counselingDate: '',
        counselingTime: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
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
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = e.target.value;
            return updated;
        });
    };

    const handleClear = () => {
        setFormData({
            person: { fullName: '', dateOfBirth: '' },
            purpose: '',
            contactPerson: { fullName: '', contactNumber: '', relationship: '' },
            contactNumber: '',
            address: {
                BldgNameTower: '',
                LotBlockPhaseHouseNo: '',
                SubdivisionVillageZone: '',
                Street: '',
                District: '',
                barangay: '',
                city: '',
            },
            counselingDate: '',
            counselingTime: '',
        });
        setIsAgreed(false);
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const { fullName, dateOfBirth } = formData.person;
    //     const { purpose, contactNumber } = formData;
    //     if (!fullName || !dateOfBirth || !purpose || !contactNumber) {
    //         toast.error('Please fill out all required fields!');
    //         return;
    //     }

    //     try {
    //         const submissionData = { ...formData, userId: user?._id }; 
    //         const response = await axios.post(
    //             `${process.env.REACT_APP_API}/api/v1/counselingSubmit`,
    //             submissionData,
    //             config
    //         );
    //         toast.success('Counseling form submitted successfully!');
    //         handleClear();
    //     } catch (error) {
    //         console.error('Error submitting counseling form:', error);
    //         toast.error('Failed to submit the form. Please try again.');
    //     }
    // };

    // modified address

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAgreed) {
            setIsModalOpen(true);
            return;
        }

        const { fullName, dateOfBirth } = formData.person;
        const { purpose, contactNumber, address } = formData;
        const { city, barangay } = address;

        if (!fullName || !dateOfBirth || !purpose || !contactNumber) {
            toast.error('Please fill out all required fields!');
            return;
        }

        if (!city) {
            toast.error('Please select a city!');
            return;
        }
        if (city === 'Others' && !customCity) {
            toast.error('Please specify the city!');
            return;
        }

        if (!barangay) {
            toast.error('Please select a barangay!');
            return;
        }
        if (barangay === 'Others' && !customBarangay) {
            toast.error('Please specify the barangay!');
            return;
        }

        try {
            const submissionData = {
                ...formData,
                address: {
                    ...address,
                    city: city === 'Others' ? customCity : city,
                    barangay: barangay === 'Others' ? customBarangay : barangay,
                },
                userId: user?._id,
            };

            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/counselingSubmit`,
                submissionData,
                config
            );

            toast.success('Counseling form submitted successfully!');
            handleClear();
        } catch (error) {
            console.error('Error submitting counseling form:', error);
            toast.error('Failed to submit the form. Please try again.');
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
        <Box sx={{ display: "flex" }}>
            <MetaData title="Counseling Form" />
            <Box sx={{ display: "flex", backgroundColor: "#f9f9f9", width: "100%" }}>
                <GuestSidebar />

                <Box sx={{ marginLeft: "20px", padding: "20px", width: "calc(100% - 270px)" }}>
                    <form onSubmit={handleSubmit}>
                        <h4>Personal Information</h4>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Buong Pangalan"
                                    fullWidth
                                    value={formData.person.fullName}
                                    onChange={(e) => handleChange(e, 'person.fullName')}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Araw ng Kapanganakan"
                                    type="date"
                                    fullWidth
                                    value={formData.person.dateOfBirth}
                                    onChange={(e) => handleChange(e, 'person.dateOfBirth')}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>

                        <h4 className="mt-4">Counseling Details</h4>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Purpose"
                                    fullWidth
                                    value={formData.purpose}
                                    onChange={(e) => handleChange(e, 'purpose')}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Contact Number"
                                    fullWidth
                                    value={formData.contactNumber}
                                    onChange={(e) => handleChange(e, 'contactNumber')}
                                    required
                                />
                            </Grid>
                        </Grid>

                        <h4 className="mt-4">Contact Person</h4>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Buong Pangalan"
                                    fullWidth
                                    value={formData.contactPerson.fullName}
                                    onChange={(e) => handleChange(e, 'contactPerson.fullName')}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Contact Number"
                                    fullWidth
                                    value={formData.contactPerson.contactNumber}
                                    onChange={(e) => handleChange(e, 'contactPerson.contactNumber')}
                                    required
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Relationship</InputLabel>
                                <Select
                                    value={formData.contactPerson.relationship}
                                    onChange={(e) => handleChange(e, 'contactPerson.relationship')}
                                    label="Relationship"
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="Mother/Nanay">Mother/Nanay</MenuItem>
                                    <MenuItem value="Father/Tatay">Father/Tatay</MenuItem>
                                    <MenuItem value="Sibling/Kapatid">Sibling/Kapatid</MenuItem>
                                    <MenuItem value="Child/Anak">Child/Anak</MenuItem>
                                    <MenuItem value="Spouse/Asawa">Spouse/Asawa</MenuItem>
                                    <MenuItem value="Stepparent">Stepparent</MenuItem>
                                    <MenuItem value="Stepchild">Stepchild</MenuItem>
                                    <MenuItem value="In-law">In-law</MenuItem>
                                    <MenuItem value="Godparent">Godparent</MenuItem>
                                    <MenuItem value="Godchild">Godchild</MenuItem>
                                    <MenuItem value="Relative/Kamag-anak">Relative/Kamag-anak</MenuItem>
                                    <MenuItem value="Guardian">Guardian</MenuItem>
                                    <MenuItem value="Friend/Kaibigan">Friend/Kaibigan</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <h4 className="mt-4">Tirahan</h4>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Building Name/Tower"
                                    fullWidth
                                    value={formData.address.BldgNameTower}
                                    onChange={(e) => handleChange(e, 'address.BldgNameTower')}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Lot/Block/Phase/House No."
                                    fullWidth
                                    value={formData.address.LotBlockPhaseHouseNo}
                                    onChange={(e) => handleChange(e, 'address.LotBlockPhaseHouseNo')}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Subdivision/Village/Zone"
                                    fullWidth
                                    value={formData.address.SubdivisionVillageZone}
                                    onChange={(e) => handleChange(e, 'address.SubdivisionVillageZone')}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Street"
                                    fullWidth
                                    value={formData.address.Street}
                                    onChange={(e) => handleChange(e, 'address.Street')}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Barangay</InputLabel>
                                    <Select
                                        value={formData.address.barangay}
                                        onChange={(e) => handleBarangayChange(e, 'address.barangay')}
                                    >
                                        {barangays.map((barangay, index) => (
                                            <MenuItem key={index} value={barangay}>{barangay}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {formData.address.barangay === 'Others' && (
                                <Grid item xs={12}>
                                    <TextField
                                        label="Specify Barangay"
                                        fullWidth
                                        value={customBarangay}
                                        onChange={(e) => setCustomBarangay(e.target.value)}
                                        required
                                    />
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <TextField
                                    label="District"
                                    fullWidth
                                    value={formData.address.District}
                                    onChange={(e) => handleChange(e, 'address.District')}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>City</InputLabel>
                                    <Select
                                        value={formData.address.city}
                                        onChange={(e) => handleCityChange(e, 'address.city')}
                                    >
                                        {cities.map((city, index) => (
                                            <MenuItem key={index} value={city}>{city}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {formData.address.city === 'Others' && (
                                <Grid item xs={12}>
                                    <TextField
                                        label="Specify City"
                                        fullWidth
                                        value={customCity}
                                        onChange={(e) => setCustomCity(e.target.value)}
                                        required
                                    />
                                </Grid>
                            )}
                        </Grid>

                        <h4 className="mt-4">Schedule</h4>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Araw"
                                    type="date"
                                    fullWidth
                                    value={formData.counselingDate}
                                    onChange={(e) => handleChange(e, 'counselingDate')}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Oras"
                                    type="time"
                                    fullWidth
                                    value={formData.counselingTime}
                                    onChange={(e) => handleChange(e, 'counselingTime')}
                                    required
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ marginTop: 4 }}>
                            <input
                                type="checkbox"
                                checked={isAgreed}
                                onChange={() => setIsAgreed(!isAgreed)}
                            />
                            <label>
                                Before submitting, click this to open the{' '}
                                <span
                                    style={{ color: 'blue', cursor: 'pointer' }}
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Terms and Conditions
                                </span>
                            </label>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                            <Button variant="outlined" sx={{ marginRight: 2 }} onClick={handleClear}>
                                Clear All Fields
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disabled={!isAgreed}>
                                Submit
                            </Button>
                        </Box>
                        <TermsModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onAccept={() => { setIsAgreed(true); setIsModalOpen(false); }}
                            termsText="Here are the terms and conditions for the Counseling Form."
                        />

                        {/* <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                            <Button variant="outlined" sx={{ marginRight: 2 }} onClick={handleClear}>
                                Clear All Fields
                            </Button>
                            <Button variant="contained" type="submit">
                                Submit
                            </Button>
                        </Box> */}
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default CounselingForm;
