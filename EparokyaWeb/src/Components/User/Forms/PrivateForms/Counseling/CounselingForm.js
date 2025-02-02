import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import GuestSidebar from '../../../../GuestSideBar';
import axios from 'axios';
import { toast } from 'react-toastify';

const CounselingForm = () => {
    const [formData, setFormData] = useState({
        person: { fullName: '', dateOfBirth: '' },
        purpose: '',
        contactPerson: { fullName: '', contactNumber: '', relationship: '' },
        contactNumber: '',
        address: { block: '', lot: '', street: '', phase: '', baranggay: '' },
        counselingDate: '',
        counselingTime: '',
    });
    const [user, setUser] = useState(null);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullName, dateOfBirth } = formData.person;
        const { purpose, contactNumber } = formData;
        if (!fullName || !dateOfBirth || !purpose || !contactNumber) {
            toast.error('Please fill out all required fields!');
            return;
        }
    
        try {
            const submissionData = { ...formData, userId: user?._id }; 
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
    

    return (
        <Row className="mt-4">
            <Col md={3}>
                <GuestSidebar />
            </Col>
            <Col md={9}>
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
                    <Form.Group>
                        <Form.Label>Relationship</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.contactPerson.relationship}
                            onChange={(e) => handleChange(e, 'contactPerson.relationship')}
                        />
                    </Form.Group>

                    <h4 className="mt-4">Tirahan</h4>
                    <Form.Group>
                        <Form.Label>Block (Format: Block No.)
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.address.block}
                            onChange={(e) => handleChange(e, 'address.block')}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Lot (Format: Lot No.)</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.address.lot}
                            onChange={(e) => handleChange(e, 'address.lot')}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Street</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.address.street}
                            onChange={(e) => handleChange(e, 'address.street')}
                        />

                        <Form.Label>Phase (Format: Phase No.)</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.address.phase}
                            onChange={(e) => handleChange(e, 'address.phase')}
                        />

                        <Form.Label>Baranggay</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.address.baranggay}
                            onChange={(e) => handleChange(e, 'address.baranggay')}
                        />
                    </Form.Group>


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
                        <Form.Label>Oras (Format: 7:00PM)</Form.Label>
                        <Form.Control
                            type="text"
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
            </Col>
        </Row>
    );
};

export default CounselingForm;
