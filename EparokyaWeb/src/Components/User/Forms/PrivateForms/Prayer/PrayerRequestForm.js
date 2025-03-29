import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import GuestSidebar from '../../../../GuestSideBar';
import axios from 'axios';
import { toast } from 'react-toastify';
import MetaData from '../../../../Layout/MetaData';
import { Box } from '@mui/material';

const PrayerRequestForm = () => {
    const [formData, setFormData] = useState({
        offerrorsName: '',
        prayerType: '',
        prayerRequestDate: '',
        Intentions: [{ name: '' }],
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

    const handleChange = (e, field) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleIntentionChange = (e, index) => {
        const updatedIntentions = [...formData.Intentions];
        updatedIntentions[index].name = e.target.value;
        setFormData((prev) => ({
            ...prev,
            Intentions: updatedIntentions,
        }));
    };

    const handleAddIntention = () => {
        setFormData((prev) => ({
            ...prev,
            Intentions: [...prev.Intentions, { name: '' }],
        }));
    };

    const handleRemoveIntention = (index) => {
        const updatedIntentions = formData.Intentions.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            Intentions: updatedIntentions,
        }));
    };

    const handleClear = () => {
        setFormData({
            offerrorsName: '',
            prayerType: '',
            prayerRequestDate: '',
            Intentions: [{ name: '' }],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { offerrorsName, prayerType, prayerRequestDate } = formData;
        if (!offerrorsName || !prayerType || !prayerRequestDate) {
            toast.error('Please fill out all required fields!');
            return;
        }

        try {
            const submissionData = { ...formData, userId: user?._id };
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/prayerRequestSubmit`,
                submissionData,
                config
            );
            toast.success('Prayer request submitted successfully!');
            handleClear();
        } catch (error) {
            console.error('Error submitting prayer request:', error);
            toast.error('Failed to submit the prayer request. Please try again.');
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <MetaData title="Prayer Request Form" />
            <div style={{ display: "flex", backgroundColor: "#f9f9f9", width: "100%" }}>
                <GuestSidebar />
                <div style={{ marginLeft: "20px", padding: "20px", width: "calc(100% - 270px)" }}>
                    <Box sx={{ display: "flex", minHeight: "100vh", alignContent: "center", justifyContent: "center", width: "100%" }}>

                        <Col md={9}>
                            <Form onSubmit={handleSubmit}>
                                <h4 className="mt-4">Prayer Request Information</h4>

                                <Form.Group>
                                    <Form.Label>Offeror's Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.offerrorsName}
                                        onChange={(e) => handleChange(e, 'offerrorsName')}
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Prayer Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={formData.prayerType}
                                        onChange={(e) => handleChange(e, 'prayerType')}
                                    >
                                        <option value="">Select Prayer Type</option>
                                        <option value="Eternal Repose(Patay)">Eternal Repose (Patay)</option>
                                        <option value="Thanks Giving(Pasasalamat)">Thanks Giving (Pasasalamat)</option>
                                        <option value="Special Intentions(Natatanging Kahilingan)">
                                            Special Intentions (Natatanging Kahilingan)
                                        </option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Prayer Request Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.prayerRequestDate}
                                        onChange={(e) => handleChange(e, 'prayerRequestDate')}
                                    />
                                </Form.Group>

                                <h4 className="mt-4">Intentions</h4>
                                {formData.Intentions.map((intention, index) => (
                                    <Form.Group key={index} className="d-flex align-items-center">
                                        <Form.Control
                                            type="text"
                                            value={intention.name}
                                            onChange={(e) => handleIntentionChange(e, index)}
                                            placeholder="Enter Intention"
                                        />
                                        <Button
                                            variant="danger"
                                            className="ms-2"
                                            onClick={() => handleRemoveIntention(index)}
                                            disabled={formData.Intentions.length === 1}
                                        >
                                            Remove
                                        </Button>
                                    </Form.Group>
                                ))}
                                <Button variant="secondary" className="mt-2" onClick={handleAddIntention}>
                                    Add Intention
                                </Button>

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
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default PrayerRequestForm;
