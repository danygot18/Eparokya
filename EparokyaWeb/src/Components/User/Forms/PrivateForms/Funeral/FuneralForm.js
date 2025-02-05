import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import GuestSidebar from '../../../../GuestSideBar';
import TermsModal from "../../../../TermsModal";
import termsAndConditionsText from "../../../../TermsAndConditionText";

const FuneralForm = () => {
    const [filePreview, setFilePreview] = useState(null);
    const [filePreviewType, setFilePreviewType] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        dateOfDeath: '',
        personStatus: '',
        age: '',
        contactPerson: '',
        relationship: '',
        phone: '',
        address: { state: '', zip: '', country: '' },
        priestVisit: '',
        reasonOfDeath: '',
        funeralDate: '',
        funeraltime: '',
        placeOfDeath: '',
        serviceType: '',
        placingOfPall: { by: '', familyMembers: [] },
        funeralMassDate: '',
        funeralMasstime: '',
        funeralMass: '',
        deathCertificate: [],
    });

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const token = localStorage.getItem('token');
    //             if (!token) {
    //                 console.error('No token found. User is not authenticated.');
    //                 return;
    //             }
    //             const config = {
    //                 headers: { Authorization: `Bearer ${token}` },
    //                 withCredentials: true,
    //             };
    //             const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/profile`, config);
    //             setUserId(response.data.user._id);
    //         } catch (error) {
    //             console.error('Error fetching user:', error.response ? error.response.data : error.message);
    //         }
    //     };
    //     fetchUser();
    // }, []);
    const config = {

        withCredentials: true,
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {

                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/profile`, config);
                setUserId(response.data.user._id);
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

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prevData) => ({
            ...prevData,
            deathCertificate: files,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!isAgreed) {
            toast.error('You must agree to the Terms and Conditions before submitting.');
            return;
        }
    
        try {
            const formDataObj = new FormData();
            if (formData.deathCertificate[0]) {
                formDataObj.append('deathCertificate', formData.deathCertificate[0]);
            }
    
            formDataObj.append('address[state]', formData.address.state);
            formDataObj.append('address[zip]', formData.address.zip);
            formDataObj.append('address[country]', formData.address.country);
            formDataObj.append('placingOfPall[by]', formData.placingOfPall.by);
            formDataObj.append('placingOfPall[familyMembers]', JSON.stringify(formData.placingOfPall.familyMembers));
    
            // Append other fields
            formDataObj.append('name', formData.name);
            formDataObj.append('dateOfDeath', formData.dateOfDeath);
            formDataObj.append('personStatus', formData.personStatus);
            formDataObj.append('age', formData.age);
            formDataObj.append('contactPerson', formData.contactPerson);
            formDataObj.append('relationship', formData.relationship);
            formDataObj.append('phone', formData.phone);
            formDataObj.append('priestVisit', formData.priestVisit);
            formDataObj.append('reasonOfDeath', formData.reasonOfDeath);
            formDataObj.append('funeralDate', formData.funeralDate);
            formDataObj.append('funeraltime', formData.funeraltime);
            formDataObj.append('placeOfDeath', formData.placeOfDeath);
            formDataObj.append('serviceType', formData.serviceType);
            formDataObj.append('funeralMassDate', formData.funeralMassDate);
            formDataObj.append('funeralMasstime', formData.funeralMasstime);
            formDataObj.append('funeralMass', formData.funeralMass);
            formDataObj.append('userId', userId);
    
            for (let pair of formDataObj.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
    
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/funeralCreate`,
                formDataObj,
                config
            );
    
            toast.success('Form submitted successfully!');
            console.log('Response:', response.data);
    
            setFormData({
                name: '',
                dateOfDeath: '',
                personStatus: '',
                age: '',
                contactPerson: '',
                relationship: '',
                phone: '',
                address: { state: '', zip: '', country: '' },
                priestVisit: '',
                reasonOfDeath: '',
                funeralDate: '',
                funeraltime: '',
                placeOfDeath: '',
                serviceType: '',
                placingOfPall: { by: '', familyMembers: [] },
                funeralMassDate: '',
                funeralMasstime: '',
                funeralMass: '',
                deathCertificate: [],
            });
    
            setIsAgreed(false); // Reset checkbox after submission
        } catch (error) {
            console.error('Error submitting form:', error.response ? error.response.data : error.message);
            toast.error('Failed to submit form. Please try again.');
        }
    };
    

    return (
        <div className="funeral-form-container">
            {/* <div className="guest-sidebar">
                <GuestSidebar />
            </div> */}
            <div className="form-content">
                <h2>Funeral Request Form</h2>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="name">
                                <Form.Label>Pangalan ng Patay</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange(e, 'name')}
                                    required
                                />
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="dateOfDeath">
                                <Form.Label>Araw ng Kamatayan</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.dateOfDeath}
                                    onChange={(e) => handleChange(e, 'dateOfDeath')}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="personStatus">
                                <Form.Label>Kalagayan sa Buhay</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={formData.personStatus}
                                    onChange={(e) => handleChange(e, 'personStatus')}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Dalaga/Binata">Dalaga/Binata</option>
                                    <option value="May Asawa, Biyuda">May Asawa</option>
                                    <option value="Biyuda">Biyuda</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group controlId="age">
                                <Form.Label>Edad</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => handleChange(e, 'age')}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="contactPerson">
                                <Form.Label>Panagalan ng Magulang, Asawa o Anak</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.contactPerson}
                                    onChange={(e) => handleChange(e, 'contactPerson')}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="relationship">
                                <Form.Label>Relasyon sa Namatay</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.relationship}
                                    onChange={(e) => handleChange(e, 'relationship')}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="phone">
                                <Form.Label>Contact Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => handleChange(e, 'phone')}
                                    required
                                />
                            </Form.Group>
                        </Col>


                        <Col md={6}>
                            <Form.Group controlId="priestVisit">
                                <Form.Label>Napuntahan ba ng Pari bago namatay?</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={formData.priestVisit}
                                    onChange={(e) => handleChange(e, 'priestVisit')}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Oo/Yes">Oo/Yes</option>
                                    <option value="Hindi/No">Hindi/No</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group controlId="state">
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.address.state}
                                    onChange={(e) => handleChange(e, 'address.state')}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group controlId="zip">
                                <Form.Label>Zip</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.address.zip}
                                    onChange={(e) => handleChange(e, 'address.zip')}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group controlId="country">
                                <Form.Label>Baranggay</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.address.country}
                                    onChange={(e) => handleChange(e, 'address.country')}
                                    required
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="reasonOfDeath">
                                <Form.Label>Dahilan ng Pagkamatay</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.reasonOfDeath}
                                    onChange={(e) => handleChange(e, 'reasonOfDeath')}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="funeralDate">
                                <Form.Label>Araw ng Libing</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.funeralDate}
                                    onChange={(e) => handleChange(e, 'funeralDate')}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Oras ng Libing</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={formData.funeraltime}
                                    onChange={(e) => {
                                        const ampmTime = e.target.value;

                                        // am/pm 00:00 
                                        const [time, modifier] = ampmTime.split(' ');
                                        let [hours, minutes] = time.split(':');
                                        hours = parseInt(hours, 10);

                                        if (modifier === 'AM' && hours === 12) {
                                            hours = 0; //12 am to 00:00
                                        } else if (modifier === 'PM' && hours !== 12) {
                                            hours += 12; // Convert PM to 24hr fmat
                                        }
                                        // Format
                                        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
                                        handleChange({ target: { value: formattedTime } }, 'funeraltime');
                                    }}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group controlId="placeOfDeath">
                                <Form.Label>Saan ililibing</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.placeOfDeath}
                                    onChange={(e) => handleChange(e, 'placeOfDeath')}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="serviceType">
                                <Form.Label>Rito na igagawad sa namatay</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={formData.serviceType}
                                    onChange={(e) => handleChange(e, 'serviceType')}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Misa">Misa</option>
                                    <option value="Blessing">Blessing</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group controlId="placingOfPall">
                                <Form.Label>Placing of Pall By</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={formData.placingOfPall.by}
                                    onChange={(e) => handleChange(e, 'placingOfPall.by')}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Priest">Pari</option>
                                    <option value="Family Member">Family Member</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        {formData.placingOfPall.by === 'Family Member' && (
                            <Form.Group controlId="familyMembers">
                                <Form.Label>Family Members</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.placingOfPall.familyMembers.join(', ')}
                                    onChange={(e) =>
                                        handleChange(
                                            { target: { value: e.target.value.split(', ') } },
                                            'placingOfPall.familyMembers'
                                        )
                                    }
                                    placeholder="Enter family members, separated by commas"
                                    required
                                />
                            </Form.Group>
                        )}

                        <Col md={4}>
                            <Form.Group controlId="funeralMassDate">
                                <Form.Label>Araw ng Paggawad</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.funeralMassDate}
                                    onChange={(e) => handleChange(e, 'funeralMassDate')}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Oras ng Paggawad</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={formData.funeralMasstime}
                                    onChange={(e) => {
                                        const ampmTime = e.target.value;

                                        // am/pm 00:00 
                                        const [time, modifier] = ampmTime.split(' ');
                                        let [hours, minutes] = time.split(':');
                                        hours = parseInt(hours, 10);

                                        if (modifier === 'AM' && hours === 12) {
                                            hours = 0; //12 am to 00:00
                                        } else if (modifier === 'PM' && hours !== 12) {
                                            hours += 12; // Convert PM to 24hr fmat
                                        }
                                        // Format
                                        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
                                        handleChange({ target: { value: formattedTime } }, 'funeralMasstime');
                                    }}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={5}>
                            <Form.Group controlId="funeralMass">
                                <Form.Label>Saan gaganapin</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.funeralMass}
                                    onChange={(e) => handleChange(e, 'funeralMass')}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Form.Group controlId="deathCertificate">
                            <Form.Label>Death Certificate</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileChange(e, 'deathCertificate')}
                                required
                            />
                        </Form.Group>
                    </Row>

                    {/* Terms and Conditions Section */}
                    <div className="terms-section">
                        <input
                            type="checkbox"
                            checked={isAgreed}
                            onChange={() => setIsAgreed(!isAgreed)}
                        />
                        <label>
                           Before submitting,click this to open the <span className="terms-link" onClick={() => setIsModalOpen(true)}>Terms and Conditions</span>
                        </label>
                    </div>



                    <Button type="submit" disabled={!isAgreed} className="mt-3">
                        Submit
                    </Button>

                    {/* Terms Modal */}
                    <TermsModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onAccept={() => { setIsAgreed(true); setIsModalOpen(false); }}
                        termsText={termsAndConditionsText}
                    />
                    
                </Form>
            </div>
        </div>
    );

};

export default FuneralForm;
