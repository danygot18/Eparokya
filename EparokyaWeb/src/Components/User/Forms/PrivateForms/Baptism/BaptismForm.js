import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import './BaptismForm.css';
import GuestSidebar from '../../../../GuestSideBar';
import { getToken } from '../../../../../Utils/helpers';

const BaptismForm = () => {
    const [filePreview, setFilePreview] = useState(null);
    const [filePreviewType, setFilePreviewType] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [ninong, setNinong] = useState([]);
    const [ninang, setNinang] = useState([]);
    const [NinongGodparents, setNinongGodparents] = useState([]);
    const [NinangGodparents, setNinangGodparents] = useState([]);
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        baptismDate: '',
        baptismTime: '',
        phone: '',
        child: {
            fullName: '',
            dateOfBirth: '',
            placeOfBirth: '',
            gender: '',
        },
        parents: {
            fatherFullName: '',
            placeOfFathersBirth: '',
            motherFullName: '',
            placeOfMothersBirth: '',
            address: '',
            marriageStatus: '',
        },
        ninong: { name: '', address: '', religion: '' },
        ninang: { name: '', address: '', religion: '' },
        Docs: {
            birthCertificate: [],
            marriageCertificate: [],
        },
        additionalDocs: { 
            baptismPermitFrom: '',
            baptismPermit: [],
            certificateOfNoRecordBaptism: [],
        },
    });
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


    // const handleFileChange = (e, name) => {
    //     const files = Array.from(e.target.files);
    //     setFormData(prev => ({
    //         ...prev,
    //         Docs: {
    //             ...prev.Docs,
    //             [name]: files.map(file => ({
    //                 public_id: file.name,
    //                 url: URL.createObjectURL(file),
    //             })),
    //         },
    //     }));
    // };

    // const handleFileChange = (e, docType) => {
    //     const files = Array.from(e.target.files);
    //     setFormData(prevData => ({
    //         ...prevData,
    //         Docs: {
    //             ...prevData.Docs,
    //             [docType]: files,
    //         },
    //     }));
    // };

    const handleFileChange = (e, docType, isAdditional = false) => {
        const files = Array.from(e.target.files);
        setFormData(prevData => ({
            ...prevData,
            ...(isAdditional
                ? {
                    additionalDocs: {
                        ...prevData.additionalDocs,
                        [docType]: files,
                    },
                }
                : {
                    Docs: {
                        ...prevData.Docs,
                        [docType]: files,
                    },
                }),
        }));
    };

    const handlePreview = (url, type) => {
        const previewType = type.startsWith('image/') ? 'image' : 'document';
        setFilePreview(url);
        setFilePreviewType(previewType);
        setShowPreviewModal(true);
    };

    const handleAddDynamicField = (setState, template) => {
        setState(prev => [...prev, { ...template }]);
    };

    const handleRemoveDynamicField = (setState, index) => {
        setState(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting formData:', formData);
        try {
            const formDataObj = new FormData();
    
            // Append files from Docs
            if (formData.Docs.birthCertificate.length > 0) {
                formDataObj.append('birthCertificate', formData.Docs.birthCertificate[0]);
            }
            if (formData.Docs.marriageCertificate.length > 0) {
                formDataObj.append('marriageCertificate', formData.Docs.marriageCertificate[0]);
            }
    
            // Access additionalDocs properly (since it's an array)
            const additionalDocsData = formData.additionalDocs;
    
            if (additionalDocsData?.baptismPermitFrom) {
                formDataObj.append('baptismPermitFrom', additionalDocsData.baptismPermitFrom);
            }
            
            if (additionalDocsData?.baptismPermit?.length > 0) {
                formDataObj.append('baptismPermit', additionalDocsData.baptismPermit[0]);
            }
            
            if (additionalDocsData?.certificateOfNoRecordBaptism?.length > 0) {
                formDataObj.append('certificateOfNoRecordBaptism', additionalDocsData.certificateOfNoRecordBaptism[0]);
            }
            
    
            // Append other fields (excluding Docs and additionalDocs, as they are handled separately)
            for (let key in formData) {
                if (formData.hasOwnProperty(key) && key !== 'Docs' && key !== 'additionalDocs') {
                    const value = formData[key];
                    formDataObj.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
                }
            }
    
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/baptismCreate`,
                formDataObj,
                {
                    withCredentials: true,
                }
            );
    
            console.log('Response:', response.data);
            toast.success('Form submitted successfully!');
    
            // Reset form data
            setFormData({
                baptismDate: '',
                baptismTime: '',
                phone: '',
                child: { fullName: '', dateOfBirth: '', placeOfBirth: '', gender: '' },
                parents: { fatherFullName: '', placeOfFathersBirth: '', motherFullName: '', placeOfMothersBirth: '', address: '', marriageStatus: '' },
                ninong: { name: '', address: '', religion: '' },
                ninang: { name: '', address: '', religion: '' },
                Docs: { birthCertificate: [], marriageCertificate: [] },
                additionalDocs: { baptismPermitFrom: '', baptismPermit: [], certificateOfNoRecordBaptism: [],
                    
                },
            });
    
        } catch (error) {
            console.error('Error submitting form:', error.response ? error.response.data : error.message);
            toast.error('Failed to submit form. Please try again.');
        }
    };
    

    return (

        <div className="baptismForm-container mt-4">
            <div className="baptismForm-sidebar">
                <GuestSidebar />
            </div>

            <div className="baptismForm-content">
                <h2>Baptism Form</h2>
                <Form onSubmit={handleSubmit}>
                    {/* Baptism Date and Time */}
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Araw ng Binyag</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.baptismDate}
                                    onChange={e => handleChange(e, 'baptismDate')}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Oras ng Binyag</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={formData.baptismTime}
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
                                        handleChange({ target: { value: formattedTime } }, 'baptismTime');
                                    }}
                                />
                            </Form.Group>


                        </Col>
                    </Row>

                    {/* Child Information */}
                    <h4 className="mt-4">Child Information</h4>
                    <Form.Group>
                        <Form.Label>Buong Pangalan ng Bibinyagan</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.child.fullName}
                            onChange={(e) => handleChange(e, 'child.fullName')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Araw ng Kapanganakan</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.child.dateOfBirth}
                            onChange={(e) => handleChange(e, 'child.dateOfBirth')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Lugar kung saan pinanganak</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.child.placeOfBirth}
                            onChange={(e) => handleChange(e, 'child.placeOfBirth')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Kasarian</Form.Label>
                        <Form.Select
                            value={formData.child.gender}
                            onChange={(e) => handleChange(e, 'child.gender')}
                        >
                            <option value="">-- Piliin ang Kasarian --</option>
                            <option value="Male">Lalaki</option>
                            <option value="Female">Babae</option>
                        </Form.Select>
                    </Form.Group>


                    {/* Parents Information */}
                    <h4 className="mt-4">Magulang ng Bibinyagan</h4>
                    <Form.Group>
                        <Form.Label>Buong Pangalan ng Ama</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.parents.fatherFullName}
                            onChange={e => handleChange(e, 'parents.fatherFullName')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Lugar ng Kapanganakan</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.parents.placeOfFathersBirth}
                            onChange={e => handleChange(e, 'parents.placeOfFathersBirth')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Buong Pangalan ng Ina</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.parents.motherFullName}
                            onChange={e => handleChange(e, 'parents.motherFullName')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Lugar ng Kapanganakan</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.parents.placeOfMothersBirth}
                            onChange={e => handleChange(e, 'parents.placeOfMothersBirth')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Tirahan</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.parents.address}
                            onChange={e => handleChange(e, 'parents.address')}
                        />
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.phone}
                            onChange={(e) => handleChange(e, 'phone')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Saan Kasal</Form.Label>
                        <Form.Select
                            value={formData.parents.marriageStatus}
                            onChange={(e) => handleChange(e, 'parents.marriageStatus')}
                        >
                            <option value="">-- Piliin Saan Kasal --</option>
                            <option value="Simbahan">Simbahan (Katoliko) </option>
                            <option value="Civil">Civil (Huwes) </option>
                            <option value="Nat">Nat (Hindi Kasal) </option>

                        </Form.Select>
                    </Form.Group>

                    {/* Ninong */}
                    <h4 className="mt-4">Ninong</h4>
                    <Form.Group>
                        <Form.Label>Pangalan</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.ninong.name}
                            onChange={e => handleChange(e, 'ninong.name')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Tirahan</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.ninong.address}
                            onChange={e => handleChange(e, 'ninong.address')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Relihiyon</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.ninong.religion}
                            onChange={e => handleChange(e, 'ninong.religion')}
                        />
                    </Form.Group>

                    {/* Ninang */}
                    <h4 className="mt-4">Ninang</h4>
                    <Form.Group>
                        <Form.Label>Pangalan</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.ninang.name}
                            onChange={e => handleChange(e, 'ninang.name')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Tirahan</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.ninang.address}
                            onChange={e => handleChange(e, 'ninang.address')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Relihiyon</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.ninang.religion}
                            onChange={e => handleChange(e, 'ninang.religion')}
                        />
                    </Form.Group>

                    <h4 className="mt-4">Secondary Ninong</h4>
                    {NinongGodparents.map((item, index) => (
                        <div key={index}>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Pangalan</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => {
                                                const updatedNinongGodparents = [...NinongGodparents];
                                                updatedNinongGodparents[index].name = e.target.value;
                                                setNinongGodparents(updatedNinongGodparents);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col className="d-flex align-items-center">
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            const updatedNinongGodparents = NinongGodparents.filter(
                                                (_, i) => i !== index
                                            );
                                            setNinongGodparents(updatedNinongGodparents);
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    ))}
                    <Button
                        variant="secondary"
                        onClick={() =>
                            setNinongGodparents([...NinongGodparents, { name: '' }])
                        }
                    >
                        Add Secondary Ninong
                    </Button>

                    {/* Ninang Godparents */}
                    <h4 className="mt-4">Secondary Ninang</h4>
                    {NinangGodparents.map((item, index) => (
                        <div key={index}>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Pangalan</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => {
                                                const updatedNinangGodparents = [...NinangGodparents];
                                                updatedNinangGodparents[index].name = e.target.value;
                                                setNinangGodparents(updatedNinangGodparents);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col className="d-flex align-items-center">
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            const updatedNinangGodparents = NinangGodparents.filter(
                                                (_, i) => i !== index
                                            );
                                            setNinangGodparents(updatedNinangGodparents);
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    ))}
                    <Button
                        variant="secondary"
                        onClick={() =>
                            setNinangGodparents([...NinangGodparents, { name: '' }])
                        }
                    >
                        Add Secondary Ninang
                    </Button>


                    {/* Documents
                        <h4 className="mt-4">Upload Documents</h4>
                        {['birthCertificate', 'marriageCertificate', 'baptismPermit'].map(docType => (
                            <Form.Group key={docType}>
                                <Form.Label>{docType}</Form.Label>
                                <Form.Control
                                    type="file"
                                    multiple
                                    onChange={e => handleFileChange(e, docType)}
                                />
                                <div className="mt-2">
                                    {formData.Docs[docType]?.map((file, index) => (
                                        <Button
                                            key={index}
                                            variant="link"
                                            onClick={() => handlePreview(file.url, file.type)}
                                        >
                                            {file.public_id}
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>
                        ))} */}

                    <h4 className="mt-4">Required Documents</h4>
                    {['birthCertificate', 'marriageCertificate'].map(docType => (
                        <Form.Group key={docType}>
                            <Form.Label className="fw-bold text-danger">{docType.replace(/([A-Z])/g, ' $1').trim()} *</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={e => handleFileChange(e, docType)}
                                required
                            />
                            <div className="mt-2">
                                {formData.Docs[docType]?.map((file, index) => (
                                    <Button
                                        key={index}
                                        variant="link"
                                        onClick={() => handlePreview(file.url, file.type)}
                                    >
                                        {file.public_id || file.name}
                                    </Button>
                                ))}
                            </div>
                        </Form.Group>
                    ))}


                    {/* Optional Documents */}
                    <h4 className="mt-4">Additional Documents</h4>

                    {/* Baptism Permit From (Text Input) */}
                    <Form.Group>
                        <Form.Label className="fw-bold">Baptism Permit From:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter issuing parish"
                            value={formData.additionalDocs.baptismPermitFrom}
                            onChange={e => setFormData(prevData => ({
                                ...prevData,
                                additionalDocs: {
                                    ...prevData.additionalDocs,
                                    baptismPermitFrom: e.target.value
                                }
                            }))}
                        />
                    </Form.Group>

                    {/* Optional File Uploads */}
                    {[
                        { key: 'baptismPermit', label: 'Baptism Permit (FOR NON-PARISHIONERS)' },
                        { key: 'certificateOfNoRecordBaptism', label: 'Certificate Of No Record of Baptism (FOR 2 YEARS OLD AND ABOVE)' }
                    ].map(({ key, label }) => (
                        <Form.Group key={key} className="mt-3">
                            <Form.Label className="fw-bold">{label}</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={e => handleFileChange(e, key, true)}
                            />
                            <div className="mt-2">
                                {formData.additionalDocs[key]?.map((file, index) => (
                                    <Button
                                        key={index}
                                        variant="link"
                                        onClick={() => handlePreview(file.url, file.type)}
                                    >
                                        {file.public_id || file.name}
                                    </Button>
                                ))}
                            </div>
                        </Form.Group>
                    ))}



                    <Button type="submit" className="mt-4">
                        Submit
                    </Button>

                </Form>

                {/* Preview Modal */}
                <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Preview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {filePreviewType === 'image' ? (
                            <img src={filePreview} alt="Preview" className="img-fluid" />
                        ) : (
                            <iframe src={filePreview} title="Preview" className="w-100" style={{ height: '400px' }} />
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default BaptismForm;
