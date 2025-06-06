import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import GuestSidebar from '../../../../GuestSideBar';
import TermsModal from "../../../../TermsModal";
import termsAndConditionsText from "../../../../TermsAndConditionText";
import { Button, TextField, Typography, Stack, Paper, Box, Container, InputLabel, Select, MenuItem, } from '@mui/material';
import MetaData from '../../../../Layout/MetaData';
import ConfirmationModal from './ConfirmFuneralModal';

const FuneralForm = () => {
    const [filePreview, setFilePreview] = useState(null);
    const [filePreviewType, setFilePreviewType] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);


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
        documents: {},
        previews: {},
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

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const ALLOWED_TYPES = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (file.size > MAX_SIZE) {
            toast.error(`File too large (max 10MB): ${file.name}`);
            e.target.value = '';
            return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error(`Unsupported file type: ${file.type}`);
            e.target.value = '';
            return;
        }

        // Create preview URL
        const fileUrl = URL.createObjectURL(file);

        // Clean up previous preview URL if exists
        if (formData.previews[fieldName]) {
            URL.revokeObjectURL(formData.previews[fieldName]);
        }

        setFormData(prev => ({
            ...prev,
            [fieldName]: [file], // For deathCertificate, keep as array
            documents: {
                ...prev.documents,
                [fieldName]: file
            },
            previews: {
                ...prev.previews,
                [fieldName]: fileUrl
            }
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

    const handlePreview = (fieldName) => {
        const file = formData[fieldName][0];
        if (!file) return;
        setFilePreview(formData.previews[fieldName]);
        setFilePreviewType(file.type);
        setShowPreviewModal(true);
    };

    const closePreviewModal = () => {
        setShowPreviewModal(false);
        setFilePreview(null);
        setFilePreviewType(null);
    };


    return (
        <div style={{ display: "flex" }}>

            <div style={{ display: "flex", backgroundColor: "#f9f9f9", width: "100%" }}>

                <GuestSidebar />
                <div style={{ marginLeft: "20px", padding: "20px", width: "calc(100% - 270px)" }}>
                    <Box sx={{ display: "flex", minHeight: "100vh", alignContent: "center", justifyContent: "center", width: "100%" }}>
                        <MetaData title="Funeral Form" />
                        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
                            <Paper elevation={3} sx={{ padding: 3, width: "100%", maxWidth: 900 }}>
                                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>

                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", maxWidth: "300px" }}>
                                        <div>
                                            <h2 style={{ fontSize: "0.90rem", margin: 0 }}>Click here to see Available Dates</h2>
                                        </div>
                                        <Button
                                            variant="outline-secondary"
                                            style={{
                                                border: "1px solid #aaa",
                                                background: "transparent",
                                                color: "#333",
                                                fontWeight: "bold",
                                                borderRadius: 6,
                                                padding: "4px 14px",

                                                boxShadow: "none"
                                            }}
                                            onClick={() => setShowOverlay(true)}
                                        >
                                            View Calendar
                                        </Button>
                                    </div>
                                    <ConfirmationModal show={showOverlay} onClose={() => setShowOverlay(false)} />
                                </div>
                                <Typography variant="h4" gutterBottom>Funeral Request Form</Typography>
                                <form onSubmit={handleSubmit}>
                                    <Stack spacing={2}>
                                        <TextField
                                            label="Pangalan ng Patay"
                                            value={formData.name}
                                            onChange={(e) => handleChange(e, 'name')}
                                            required
                                            fullWidth
                                        />
                                        <TextField
                                            label="Araw ng Kamatayan"
                                            type="date"
                                            value={formData.dateOfDeath}
                                            onChange={(e) => handleChange(e, 'dateOfDeath')}
                                            required
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <InputLabel>Kalagayan sa Buhay</InputLabel>
                                        <Select
                                            value={formData.personStatus}
                                            onChange={(e) => handleChange(e, 'personStatus')}
                                            required
                                            fullWidth
                                            SelectProps={{ native: true }}
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            <MenuItem value="Dalaga/Binata">Dalaga/Binata</MenuItem>
                                            <MenuItem value="May Asawa, Biyuda">May Asawa</MenuItem>
                                            <MenuItem value="Biyuda">Biyuda</MenuItem>
                                        </Select>
                                        <TextField
                                            label="Edad"
                                            type="number"
                                            value={formData.age}
                                            onChange={(e) => handleChange(e, 'age')}
                                            required
                                            fullWidth
                                        />
                                        <TextField
                                            label="Pangalan ng Magulang, Asawa o Anak"
                                            value={formData.contactPerson}
                                            onChange={(e) => handleChange(e, 'contactPerson')}
                                            required
                                            fullWidth
                                        />
                                        <InputLabel>Relasyon ng Namatayan</InputLabel>
                                        <Select

                                            select
                                            value={formData.relationship}
                                            onChange={(e) => handleChange(e, 'relationship')}
                                            required
                                            fullWidth
                                            SelectProps={{ native: true }}
                                        >

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
                                        <TextField
                                            label="Contact Number"
                                            value={formData.phone}
                                            onChange={(e) => handleChange(e, 'phone')}
                                            required
                                            fullWidth
                                        />
                                        <InputLabel>Priest Visit</InputLabel>
                                        <Select
                                            value={formData.priestVisit}
                                            onChange={(e) => handleChange(e, 'priestVisit')}
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            <MenuItem value="Oo/Yes">Oo/Yes</MenuItem>
                                            <MenuItem value="Hindi/No">Hindi/No</MenuItem>
                                        </Select>
                                        <InputLabel>Address</InputLabel>
                                        <TextField
                                            label="Building Name/Tower"
                                            value={formData.address.BldgNameTower}
                                            onChange={(e) => handleChange(e, 'address.BldgNameTower')}
                                            fullWidth
                                        />

                                        <TextField
                                            label="Lot/Block/Phase/House No."
                                            value={formData.address.LotBlockPhaseHouseNo}
                                            onChange={(e) => handleChange(e, 'address.LotBlockPhaseHouseNo')}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Subdivision/Village/Zone"
                                            value={formData.address.SubdivisionVillageZone}
                                            onChange={(e) => handleChange(e, 'address.SubdivisionVillageZone')}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Street"
                                            value={formData.address.Street}
                                            onChange={(e) => handleChange(e, 'address.Street')}
                                            required
                                            fullWidth
                                        />
                                        <TextField

                                            select
                                            value={formData.address.barangay}
                                            onChange={(e) => handleBarangayChange(e, 'address.barangay')}
                                            required
                                            fullWidth
                                            SelectProps={{ native: true }}
                                        >
                                            <MenuItem value="">Select Barangay</MenuItem>
                                            {barangays.map((barangay, index) => (
                                                <option key={index} value={barangay}>{barangay}</option>
                                            ))}
                                        </TextField>
                                        {formData.address.barangay === "Others" && (
                                            <TextField
                                                label="Custom Barangay"
                                                value={customBarangay}
                                                onChange={(e) => setCustomBarangay(e.target.value)}
                                                required
                                                fullWidth
                                            />
                                        )}
                                        <TextField
                                            label="District"
                                            value={formData.address.District}
                                            onChange={(e) => handleChange(e, 'address.District')}
                                            required
                                            fullWidth
                                        />
                                        <TextField

                                            select
                                            value={formData.address.city}
                                            onChange={(e) => handleCityChange(e, 'address.city')}
                                            required
                                            fullWidth
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">Select City</option>
                                            <option value="Taguig City">Taguig City</option>
                                            <option value="Others">Others</option>
                                        </TextField>
                                        {formData.address.city === "Others" && (
                                            <TextField
                                                label="Add City"
                                                value={customCity}
                                                onChange={(e) => setCustomCity(e.target.value)}
                                                required
                                                fullWidth
                                            />
                                        )}
                                        <TextField
                                            label="Dahilan ng Pagkamatay"
                                            value={formData.reasonOfDeath}
                                            onChange={(e) => handleChange(e, 'reasonOfDeath')}
                                            required
                                            fullWidth
                                        />
                                        <TextField
                                            label="Araw ng Libing (Monday Schedules are NOT Available)"
                                            type="date"
                                            value={formData.funeralDate}
                                            onChange={(e) => handleChange(e, 'funeralDate')}
                                            required
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            label="Oras ng Libing"
                                            type="time"
                                            value={formData.funeraltime}
                                            onChange={(e) => handleChange(e, 'funeraltime')}
                                            required
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            label="Saan ililibing"
                                            value={formData.placeOfDeath}
                                            onChange={(e) => handleChange(e, 'placeOfDeath')}
                                            required
                                            fullWidth
                                        />
                                        <InputLabel>Rito na igagawad sa namatay</InputLabel>
                                        <Select

                                            select
                                            value={formData.serviceType}
                                            onChange={(e) => handleChange(e, 'serviceType')}
                                            required
                                            fullWidth
                                            SelectProps={{ native: true }}
                                        >
                                            <MenuItem value="Misa">Misa</MenuItem>
                                            <MenuItem value="Blessing">Blessing</MenuItem>
                                        </Select>
                                        <InputLabel>Placing of Pall By</InputLabel>
                                        <Select

                                            select
                                            value={formData.placingOfPall.by}
                                            onChange={(e) => handleChange(e, 'placingOfPall.by')}
                                            required
                                            fullWidth
                                            SelectProps={{ native: true }}
                                        >
                                            <MenuItem value="">Placing of Pall By</MenuItem>
                                            <MenuItem value="Priest">Pari</MenuItem>
                                            <MenuItem value="Family Member">Family Member</MenuItem>
                                        </Select>
                                        {formData.placingOfPall.by === 'Family Member' && (
                                            <TextField
                                                label="Family Members"
                                                value={formData.placingOfPall.familyMembers.join(', ')}
                                                onChange={(e) =>
                                                    handleChange(
                                                        { target: { value: e.target.value.split(', ') } },
                                                        'placingOfPall.familyMembers'
                                                    )
                                                }
                                                placeholder="Enter family members, separated by commas"
                                                required
                                                fullWidth
                                            />
                                        )}
                                        <TextField
                                            label="Araw ng Paggawad"
                                            type="date"
                                            value={formData.funeralMassDate}
                                            onChange={(e) => handleChange(e, 'funeralMassDate')}
                                            required
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            label="Oras ng Paggawad"
                                            type="time"
                                            value={formData.funeralMasstime}
                                            onChange={(e) => handleChange(e, 'funeralMasstime')}
                                            required
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            label="Saan gaganapin"
                                            value={formData.funeralMass}
                                            onChange={(e) => handleChange(e, 'funeralMass')}
                                            required
                                            fullWidth
                                        />
                                        <TextField
                                            type="file"
                                            accept="image/*,.pdf,.doc,.docx"
                                            onChange={(e) => handleFileChange(e, 'deathCertificate')}
                                            required
                                            fullWidth
                                        />
                                        
                                        <Box>
                                            <input
                                                type="checkbox"
                                                checked={isAgreed}
                                                onChange={() => setIsAgreed(!isAgreed)}
                                            />
                                            <label>
                                                Before submitting, click this to open the <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}>Terms and Conditions</span>
                                            </label>
                                        </Box>
                                        <Button type="submit" variant="contained" color="primary" disabled={!isAgreed}>
                                            Submit
                                        </Button>
                                    </Stack>
                                </form>
                                <TermsModal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    onAccept={() => { setIsAgreed(true); setIsModalOpen(false); }}
                                    termsText={termsAndConditionsText}
                                />
                            </Paper>
                        </Box>
                    </Box>
                </div>
            </div>
        </div>
    );

};

export default FuneralForm;
