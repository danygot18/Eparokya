import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import GuestSidebar from '../../../../GuestSideBar';
import './counselingLayouts/counselingForm.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import MetaData from '../../../../Layout/MetaData';

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
            address: { block: '', lot: '', street: '', phase: '', baranggay: '' },
            counselingDate: '',
            counselingTime: '',
        });
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
        <div style={{ display: "flex" }}>
            <MetaData title="Counseling Form" />
            <div style={{ display: "flex", backgroundColor: "#f9f9f9", width: "100%" }}>
                <GuestSidebar />

                <div style={{ marginLeft: "20px", padding: "20px", width: "calc(100% - 270px)" }}>
                    <Form onSubmit={handleSubmit}>
                        <h4 className="mt-4">Personal Information</h4>
                        <Form.Group>
                            <Form.Label>Buong Pangalan</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.person.fullName}
                                onChange={(e) => handleChange(e, 'person.fullName')}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Araw ng Kapanganakan</Form.Label>
                            <Form.Control
                                type="date"
                                value={formData.person.dateOfBirth}
                                onChange={(e) => handleChange(e, 'person.dateOfBirth')}
                            />
                        </Form.Group>

                        <h4 className="mt-4">Counseling Details</h4>
                        <Form.Group>
                            <Form.Label>Purpose</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.purpose}
                                onChange={(e) => handleChange(e, 'purpose')}
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

                        <h4 className="mt-4">Contact Person</h4>
                        <Form.Group>
                            <Form.Label>Buong Pangalan</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.contactPerson.fullName}
                                onChange={(e) => handleChange(e, 'contactPerson.fullName')}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.contactPerson.contactNumber}
                                onChange={(e) => handleChange(e, 'contactPerson.contactNumber')}
                            />
                        </Form.Group>
                        {/* <Form.Group>
                        <Form.Label>Relationship</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.contactPerson.relationship}
                            onChange={(e) => handleChange(e, 'contactPerson.relationship')}
                        />
                    </Form.Group> */}

                        <Form.Group controlId="relationship">
                            <Form.Label>Relationship</Form.Label>
                            <Form.Select
                                value={formData.contactPerson.relationship}
                                onChange={(e) => handleChange(e, 'contactPerson.relationship')}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Mother/Nanay">Mother/Nanay</option>
                                <option value="Father/Tatay">Father/Tatay</option>
                                <option value="Sibling/Kapatid">Sibling/Kapatid</option>
                                <option value="Child/Anak">Child/Anak</option>
                                <option value="Spouse/Asawa">Spouse/Asawa</option>
                                <option value="Stepparent">Stepparent</option>
                                <option value="Stepchild">Stepchild</option>
                                <option value="In-law">In-law</option>
                                <option value="Godparent">Godparent</option>
                                <option value="Godchild">Godchild</option>
                                <option value="Relative/Kamag-anak">Relative/Kamag-anak</option>
                                <option value="Guardian">Guardian</option>
                                <option value="Friend/Kaibigan">Friend/Kaibigan</option>

                            </Form.Select>
                        </Form.Group>

                        <h4 className="mt-4">Tirahan</h4>
                        <Form.Group>
                            <Form.Label>Building Name/Tower</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.address.BldgNameTower}
                                onChange={(e) => handleChange(e, 'address.BldgNameTower')}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Lot/Block/Phase/House No.</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.address.LotBlockPhaseHouseNo}
                                onChange={(e) => handleChange(e, 'address.LotBlockPhaseHouseNo')}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Subdivision/Village/Zone</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.address.SubdivisionVillageZone}
                                onChange={(e) => handleChange(e, 'address.SubdivisionVillageZone')}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Street</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.address.Street}
                                onChange={(e) => handleChange(e, 'address.Street')}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Barangay</Form.Label>
                            <Form.Control
                                as="select"
                                value={formData.address.barangay}
                                onChange={(e) => handleBarangayChange(e, 'address.barangay')}
                                required
                            >
                                {barangays.map((barangay, index) => (
                                    <option key={index} value={barangay}>{barangay}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        {formData.address.barangay === 'Others' && (
                            <Form.Group>
                                <Form.Label>Specify Barangay</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={customBarangay}
                                    onChange={(e) => setCustomBarangay(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        )}

                        <Form.Group>
                            <Form.Label>District</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.address.District}
                                onChange={(e) => handleChange(e, 'address.District')}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                as="select"
                                value={formData.address.city}
                                onChange={(e) => handleCityChange(e, 'address.city')}
                                required
                            >
                                {cities.map((city, index) => (
                                    <option key={index} value={city}>{city}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        {formData.address.city === 'Others' && (
                            <Form.Group>
                                <Form.Label>Specify City</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={customCity}
                                    onChange={(e) => setCustomCity(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        )}

                        <h4 className="mt-4">Schedule</h4>
                        <Form.Group>
                            <Form.Label>Araw</Form.Label>
                            <Form.Control
                                type="date"
                                value={formData.counselingDate}
                                onChange={(e) => handleChange(e, 'counselingDate')}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Oras</Form.Label>
                            <Form.Control
                                type="time"
                                value={formData.counselingTime}
                                onChange={(e) => handleChange(e, 'counselingTime')}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end mt-4">
                            <Button variant="secondary" className="me-2" onClick={handleClear}>
                                Clear All Fields
                            </Button>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default CounselingForm;
