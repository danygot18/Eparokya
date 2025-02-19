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
        address: {
            BldgNameTower: '',
            LotBlockPhaseHouseNo: '',
            SubdivisionVillageZone: '',
            Street: '',
            District: '',
            barangay: '',
            city: '',
        },
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

        if (formData.address.city === "Others" && !customCity) {
            toast.error("Please provide a custom city.");
            return;
        }
        if (formData.address.barangay === "Others" && !customBarangay) {
            toast.error("Please provide a custom barangay.");
            return;
        }

        try {
            const formDataObj = new FormData();
            if (formData.deathCertificate[0]) {
                formDataObj.append('deathCertificate', formData.deathCertificate[0]);
            }

            formDataObj.append('address[BldgNameTower]', formData.address.BldgNameTower);
            formDataObj.append('address[LotBlockPhaseHouseNo]', formData.address.LotBlockPhaseHouseNo);
            formDataObj.append('address[SubdivisionVillageZone]', formData.address.SubdivisionVillageZone);
            formDataObj.append('address[Street]', formData.address.Street);
            formDataObj.append('address[District]', formData.address.District);

            // if Others
            formDataObj.append('address[city]', formData.address.city === "Others" ? customCity : formData.address.city);
            formDataObj.append('address[barangay]', formData.address.barangay === "Others" ? customBarangay : formData.address.barangay);

            formDataObj.append('placingOfPall[by]', formData.placingOfPall.by);
            formDataObj.append('placingOfPall[familyMembers]', JSON.stringify(formData.placingOfPall.familyMembers));

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
                address: {
                    BldgNameTower: '',
                    LotBlockPhaseHouseNo: '',
                    SubdivisionVillageZone: '',
                    Street: '',
                    District: '',
                    barangay: '',
                    city: '',
                },
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

            setCustomCity('');
            setCustomBarangay('');
            setIsAgreed(false);
        } catch (error) {
            console.error('Error submitting form:', error.response ? error.response.data : error.message);
            toast.error('Failed to submit form. Please try again.');
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
            address: { ...prev.address, barangay: selectedBarangay },
        }));
        if (selectedBarangay === 'Others') {
            setCustomBarangay('');
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
                        {/* <Col md={4}>
                            <Form.Group controlId="relationship">
                                <Form.Label>Relasyon sa Namatay</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.relationship}
                                    onChange={(e) => handleChange(e, 'relationship')}
                                    required
                                />
                            </Form.Group>
                        </Col> */}
                        <Col md={4}>
                            <Form.Group controlId="relationship">
                                <Form.Label>Relasyon sa Namatay</Form.Label>
                                <Form.Select
                                    value={formData.relationship}
                                    onChange={(e) => handleChange(e, 'relationship')}
                                    required
                                >
                                    <option value="">Pumili ng Relasyon</option>
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

                    {/* Address */}
                    <Row>
                        {/* Building Name/Tower */}
                        <Col md={4}>
                            <Form.Group controlId="BldgNameTower">
                                <Form.Label>Building Name/Tower</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.address.BldgNameTower}
                                    onChange={(e) => handleChange(e, 'address.BldgNameTower')}
                                />
                            </Form.Group>
                        </Col>

                        {/* Lot/Block/Phase/House Number */}
                        <Col md={4}>
                            <Form.Group controlId="LotBlockPhaseHouseNo">
                                <Form.Label>Lot/Block/Phase/House No.</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.address.LotBlockPhaseHouseNo}
                                    onChange={(e) => handleChange(e, 'address.LotBlockPhaseHouseNo')}
                                />
                            </Form.Group>
                        </Col>

                        {/* Subdivision/Village/Zone */}
                        <Col md={4}>
                            <Form.Group controlId="SubdivisionVillageZone">
                                <Form.Label>Subdivision/Village/Zone</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.address.SubdivisionVillageZone}
                                    onChange={(e) => handleChange(e, 'address.SubdivisionVillageZone')}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="Street">
                                <Form.Label>Street</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.address.Street}
                                    onChange={(e) => handleChange(e, 'address.Street')}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="barangay">
                                    <Form.Label>Barangay</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={formData.address.barangay}
                                        onChange={(e) => handleBarangayChange(e, 'address.barangay')}
                                        required
                                    >
                                        <option value="">Select Barangay</option>
                                        {barangays.map((barangay, index) => (
                                            <option key={index} value={barangay}>{barangay}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            {formData.address.barangay === "Others" && (
                                <Col md={6}>
                                    <Form.Group controlId="customBarangay">
                                        <Form.Label>Custom Barangay</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={customBarangay}
                                            onChange={(e) => setCustomBarangay(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                        </Row>

                        <Col md={6}>
                            <Form.Group controlId="District">
                                <Form.Label>District</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.address.District}
                                    onChange={(e) => handleChange(e, 'address.District')}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="city">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={formData.address.city}
                                    onChange={(e) => handleCityChange(e, 'address.city')}
                                    required
                                >
                                    <option value="">Select City</option>
                                    <option value="Taguig">Taguig</option>
                                    <option value="Others">Others</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        {formData.address.city === "Others" && (
                            <Col md={6}>
                                <Form.Group controlId="customCity">
                                    <Form.Label>Add City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={customCity}
                                        onChange={(e) => setCustomCity(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        )}
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
