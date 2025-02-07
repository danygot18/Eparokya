import React, { useState, useEffect } from 'react';
import { ScrollView, ToastAndroid } from 'react-native';
import { NativeBaseProvider, Box, VStack, Input, Button, Text, Divider } from 'native-base';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";

const HouseBlessingForm = () => {
    const [formData, setFormData] = useState({
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

    const [user, setUser] = useState(null);
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

    const handleSubmit = async () => {
        const { fullName, contactNumber, blessingDate, blessingTime } = formData;

        if (!fullName || !contactNumber || !blessingDate || !blessingTime) {
            ToastAndroid.show('Please fill out all required fields!', ToastAndroid.SHORT);
            return;
        }

        try {
            const submissionData = { ...formData, userId: user?._id };
            const response = await axios.post(
                `${baseURL}/houseBlessingSubmit`,
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


                        <Input
                            placeholder="House Blessing Date (YYYY-MM-DD)"
                            value={formData.blessingDate}
                            onChangeText={(value) => handleChange(value, 'blessingDate')}
                        />
                        <Input
                            placeholder="House Blessing Time (e.g., 7:00AM)"
                            value={formData.blessingTime}
                            onChangeText={(value) => handleChange(value, 'blessingTime')}
                        />

                        <Text fontSize="lg" fontWeight="bold" mt={5}>
                            Address
                        </Text>
                        <Divider mb={4} />
                        {['houseDetails', 'block', 'lot', 'phase', 'street', 'baranggay', 'district', 'city'].map(
                            (field) => (
                                <Input
                                    key={field}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={formData.address[field] || ''}
                                    onChangeText={(value) => handleChange(value, `address.${field}`)}
                                />
                            )
                        )}

                        <VStack space={2} mt={4}>
                            <Button colorScheme="danger" onPress={handleClear}>
                                Clear All Fields
                            </Button>
                            <Button colorScheme="success" onPress={handleSubmit}>
                                Submit
                            </Button>
                        </VStack>
                    </VStack>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default HouseBlessingForm;
