import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import GuestSidebar from '../../../../GuestSideBar';
import axios from 'axios';
import { toast } from 'react-toastify';
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
        <Row className="mt-4">
            <Col md={3}>
                <GuestSidebar />
            </Col>
            <Col md={9}>
                <Form onSubmit={handleSubmit}>
                    <h4 className="mt-4">House Blessing Information</h4>

                    <Form.Group>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleChange(e, 'fullName')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.contactNumber}
                            onChange={(e) => handleChange(e, 'contactNumber')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>House Blessing Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.blessingDate}
                            onChange={(e) => handleChange(e, 'blessingDate')}
                        />
                        <Form.Label>House Blessing Time (Format: 7:00AM)</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.blessingTime}
                            onChange={(e) => handleChange(e, 'blessingTime')}
                        />
                    </Form.Group>


                    {/* Address */}
                    <h4 className="mt-4">Address</h4>

                    {['BldgNameTower', 'LotBlockPhaseHouseNo', 'SubdivisionVillageZone', 'Street', 'District'].map((field) => (
                        <Form.Group key={field}>
                            <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.address[field] || ''}
                                onChange={(e) => handleChange(e, `address.${field}`)}
                            />
                        </Form.Group>
                    ))}

                    <Form.Group>
                        <Form.Label>City</Form.Label>
                        <Form.Select value={formData.address.city} onChange={handleCityChange}>
                            <option value="">Select a city</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city}>
                                    {city}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                     {/* Custom City Input */}
                     {formData.address.city === 'Others' && (
                        <Form.Group>
                            <Form.Label>Add City</Form.Label>
                            <Form.Control
                                type="text"
                                value={customCity}
                                onChange={(e) => setCustomCity(e.target.value)}
                            />
                        </Form.Group>
                    )}


                    {/* Barangay Dropdown */}
                    <Form.Group>
                        <Form.Label>Barangay</Form.Label>
                        <Form.Select value={formData.address.baranggay} onChange={handleBarangayChange}>
                            <option value="">Select a barangay</option>
                            {barangays.map((barangay, index) => (
                                <option key={index} value={barangay}>
                                    {barangay}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Custom Barangay Input */}
                    {formData.address.baranggay === 'Others' && (
                        <Form.Group>
                            <Form.Label>Add Barangay</Form.Label>
                            <Form.Control
                                type="text"
                                value={customBarangay}
                                onChange={(e) => setCustomBarangay(e.target.value)}
                            />
                        </Form.Group>
                    )}


                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="secondary" className="me-2" onClick={handleClear}>
                            Clear All Fields
                        </Button>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Col>
        </Row>
    );
};

export default HouseBlessingForm;
