import React, { useState, useEffect } from 'react';
import { ScrollView, ToastAndroid } from 'react-native';
import { NativeBaseProvider, Box, VStack, Input, Button, Text, Divider, Select, Checkbox, TextArea, Modal } from 'native-base';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";

const TermsAndConditionsModal = ({ isOpen, onClose, onAccept, termsText }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <Modal.Content maxH="80%">
                <Modal.CloseButton />
                <Modal.Header>Terms and Conditions</Modal.Header>
                <Modal.Body>
                    <ScrollView>
                        <Text>{termsText}</Text>
                    </ScrollView>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant="ghost" onPress={onClose}>
                            Cancel
                        </Button>
                        <Button onPress={onAccept}>
                            I Agree
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

const HouseBlessingForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        blessingDate: '',
        blessingTime: '',
        propertyType: '',
        customPropertyType: '',
        floors: '1',
        rooms: '1',
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
    const [cities] = useState(["Taguig City", "Others"]);
    const [barangays] = useState([
        "Bagumbayan", "Bambang", "Calzada", "Cembo", "Central Bicutan", 
        "Central Signal Village", "Comembo", "East Rembo", "Fort Bonifacio", 
        "Hagonoy", "Ibayo-Tipas", "Katuparan", "Ligid-Tipas", "Lower Bicutan", 
        "Maharlika Village", "Napindan", "New Lower Bicutan", "North Daang Hari", 
        "North Signal Village", "Palingon", "Pembo", "Pinagsama", "Pitogo", 
        "Post Proper Northside", "Post Proper Southside", "Rizal", "San Miguel", 
        "Santa Ana", "South Cembo", "South Daang Hari", "South Signal Village", 
        "Tanyag", "Tuktukan", "Upper Bicutan", "Ususan", "Wawa", "West Rembo", 
        "Western Bicutan", "Others"
    ]);
    const [customCity, setCustomCity] = useState('');
    const [customBarangay, setCustomBarangay] = useState('');
    const [showTermsModal, setShowTermsModal] = useState(false);

    const propertyTypes = [
        "House", "Apartment", "Condominium", "Building", "Store", "Office", "Others"
    ];
    const propertySizes = [
        "Small (below 50 sqm)", "Medium (50-100 sqm)", "Large (100-200 sqm)", "Extra Large (above 200 sqm)"
    ];

    const termsAndConditionsText = `
    By submitting this form, you agree to the following terms and conditions:
    
    1. You certify that all information provided is accurate and complete.
    2. You understand that false information may result in cancellation of your request.
    3. You agree to follow all church policies and procedures.
    4. The church reserves the right to approve or deny any request at its discretion.
    
    Please review all details before submitting your request.
    `;

    const config = { withCredentials: true };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${baseURL}/profile`, config);
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user:', error.response?.data || error.message);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (value, fieldPath) => {
        const keys = fieldPath.split('.');
        setFormData((prev) => {
            const updated = { ...prev };
            let current = updated;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return updated;
        });
    };

    const handleCheckboxChange = (fieldPath) => {
        const keys = fieldPath.split('.');
        setFormData((prev) => {
            const updated = { ...prev };
            let current = updated;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = !current[keys[keys.length - 1]];
            return updated;
        });
    };

    const handleCityChange = (value) => {
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, city: value, barangay: '' }
        }));
        if (value !== "Others") {
            setCustomCity('');
        }
    };

    const handleBarangayChange = (value) => {
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, barangay: value }
        }));
        if (value !== "Others") {
            setCustomBarangay('');
        }
    };

    const handleClear = () => {
        setFormData({
            fullName: '',
            contactNumber: '',
            blessingDate: '',
            blessingTime: '',
            propertyType: '',
            customPropertyType: '',
            floors: '1',
            rooms: '1',
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

    const handleSubmit = async () => {
        // First show terms modal
        setShowTermsModal(true);
    };

    const handleAcceptTerms = async () => {
        setShowTermsModal(false);
        
        // Now proceed with form validation and submission
        const {
            fullName,
            contactNumber,
            blessingDate,
            blessingTime,
            address,
            propertyType,
            floors,
            rooms,
            propertySize,
            isNewConstruction
        } = formData;

        if (
            !fullName || !contactNumber || !blessingDate || !blessingTime ||
            !address.Street || !address.district || !address.barangay || !address.city ||
            !propertyType || !floors || !rooms || !propertySize ||
            isNewConstruction === undefined
        ) {
            ToastAndroid.show('Please fill out all required fields!', ToastAndroid.SHORT);
            return;
        }

        if (propertyType === "Others" && !formData.customPropertyType) {
            ToastAndroid.show('Please specify the property type', ToastAndroid.SHORT);
            return;
        }

        try {
            const submissionData = {
                ...formData,
                address: {
                    ...formData.address,
                    customCity: formData.address.city === "Others" ? customCity : undefined,
                    customBarangay: formData.address.barangay === "Others" ? customBarangay : undefined,
                },
                userId: user?._id,
            };

            const response = await axios.post(
                `${baseURL}/houseBlessing/houseBlessingSubmit`,
                submissionData,
                config
            );

            if (response.status === 201) {
                ToastAndroid.show('Form submitted successfully!', ToastAndroid.SHORT);
                handleClear();
            } else {
                ToastAndroid.show(response.data?.error || 'Unexpected error occurred.', ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show(error.response?.data?.error || 'Submission failed.', ToastAndroid.SHORT);
        }
    };

    return (
        <NativeBaseProvider>
            <ScrollView>
                <Box safeArea p={5} flex={1}>
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                        House Blessing Information
                    </Text>
                    <Divider mb={4} />

                    <VStack space={4}>
                        <Input
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChangeText={(value) => handleChange(value, 'fullName')}
                        />
                        <Input
                            placeholder="Contact Number"
                            value={formData.contactNumber}
                            onChangeText={(value) => handleChange(value, 'contactNumber')}
                        />

                        <Text fontSize="lg" fontWeight="bold" mt={5}>
                            Property Details
                        </Text>
                        <Divider mb={4} />

                        <Select
                            selectedValue={formData.propertyType}
                            minWidth="200"
                            accessibilityLabel="Choose Property Type"
                            placeholder="Choose Property Type"
                            onValueChange={(value) => handleChange(value, 'propertyType')}
                        >
                            {propertyTypes.map((type, index) => (
                                <Select.Item key={index} label={type} value={type} />
                            ))}
                        </Select>

                        {formData.propertyType === "Others" && (
                            <Input
                                placeholder="Specify Property Type"
                                value={formData.customPropertyType}
                                onChangeText={(value) => handleChange(value, 'customPropertyType')}
                            />
                        )}

                        <Box flexDirection="row" justifyContent="space-between">
                            <Box width="48%">
                                <Input
                                    placeholder="Number of Floors"
                                    value={formData.floors}
                                    onChangeText={(value) => handleChange(value, 'floors')}
                                    keyboardType="numeric"
                                />
                            </Box>
                            <Box width="48%">
                                <Input
                                    placeholder="Number of Rooms"
                                    value={formData.rooms}
                                    onChangeText={(value) => handleChange(value, 'rooms')}
                                    keyboardType="numeric"
                                />
                            </Box>
                        </Box>

                        <Select
                            selectedValue={formData.propertySize}
                            minWidth="200"
                            accessibilityLabel="Choose Property Size"
                            placeholder="Choose Property Size"
                            onValueChange={(value) => handleChange(value, 'propertySize')}
                        >
                            {propertySizes.map((size, index) => (
                                <Select.Item key={index} label={size} value={size} />
                            ))}
                        </Select>

                        <Checkbox
                            value="isNewConstruction"
                            isChecked={formData.isNewConstruction}
                            onChange={() => handleCheckboxChange('isNewConstruction')}
                        >
                            Is this a new construction?
                        </Checkbox>

                        <Text fontSize="lg" fontWeight="bold" mt={5}>
                            Blessing Details
                        </Text>
                        <Divider mb={4} />

                        <Input
                            placeholder="Blessing Date (YYYY-MM-DD)"
                            value={formData.blessingDate}
                            onChangeText={(value) => handleChange(value, 'blessingDate')}
                        />
                        <Input
                            placeholder="Blessing Time (e.g., 7:00AM)"
                            value={formData.blessingTime}
                            onChangeText={(value) => handleChange(value, 'blessingTime')}
                        />

                        <Text fontSize="lg" fontWeight="bold" mt={5}>
                            Address
                        </Text>
                        <Divider mb={4} />

                        {['BldgNameTower', 'LotBlockPhaseHouseNo', 'SubdivisionVillageZone', 'Street', 'district'].map(
                            (field) => (
                                <Input
                                    key={field}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={formData.address[field] || ''}
                                    onChangeText={(value) => handleChange(value, `address.${field}`)}
                                />
                            )
                        )}

                        <Select
                            selectedValue={formData.address.city}
                            minWidth="200"
                            accessibilityLabel="Choose City"
                            placeholder="Choose City"
                            onValueChange={handleCityChange}
                        >
                            {cities.map((city, index) => (
                                <Select.Item key={index} label={city} value={city} />
                            ))}
                        </Select>

                        {formData.address.city === "Others" && (
                            <Input
                                placeholder="Specify City"
                                value={customCity}
                                onChangeText={setCustomCity}
                            />
                        )}

                        <Select
                            selectedValue={formData.address.barangay}
                            minWidth="200"
                            accessibilityLabel="Choose Barangay"
                            placeholder="Choose Barangay"
                            onValueChange={handleBarangayChange}
                            isDisabled={!formData.address.city}
                        >
                            {barangays.map((barangay, index) => (
                                <Select.Item key={index} label={barangay} value={barangay} />
                            ))}
                        </Select>

                        {formData.address.barangay === "Others" && (
                            <Input
                                placeholder="Specify Barangay"
                                value={customBarangay}
                                onChangeText={setCustomBarangay}
                            />
                        )}

                        <Text fontSize="lg" fontWeight="bold" mt={5}>
                            Additional Information
                        </Text>
                        <Divider mb={4} />

                        <TextArea
                            placeholder="Special Requests (Optional)"
                            value={formData.specialRequests}
                            onChangeText={(value) => handleChange(value, 'specialRequests')}
                            numberOfLines={4}
                        />

                        <VStack space={2} mt={4}>
                            <Button style={{ backgroundColor: '#B3CF99', borderRadius: 8 }} onPress={handleClear}>
                                Clear All Fields
                            </Button>
                            <Button 
                                style={{ backgroundColor: '#26572E', borderRadius: 8 }} 
                                onPress={handleSubmit}
                            >
                                Submit
                            </Button>
                        </VStack>
                    </VStack>
                </Box>
            </ScrollView>

            <TermsAndConditionsModal
                isOpen={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                onAccept={handleAcceptTerms}
                termsText={termsAndConditionsText}
            />
        </NativeBaseProvider>
    );
};

export default HouseBlessingForm;