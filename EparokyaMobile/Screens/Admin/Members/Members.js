import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import mime from "mime";

const Members = () => {
    const [member, setMember] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        age: '',
        birthday: '',
        address: {
            baranggay: '',
            zip: '',
            city: '',
            country: '',
        },
        position: '',
        memberYearBatch: '',
        ministryCategory: '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [yearBatches, setYearBatches] = useState([]);
    const [ministryCategories, setMinistryCategories] = useState([]);

    useEffect(() => {
        // Fetch Year Batches and Ministry Categories when the component mounts
        fetchYearBatches();
        fetchMinistryCategories();
    }, []);

    const fetchYearBatches = async () => {
        try {
            const response = await axios.get(`${baseURL}/memberYear/`);
            console.log("Fetched year batches:", response.data);  

        setYearBatches(response.data.data); 
        } catch (error) {
            console.error('Error fetching year batches:', error);
            Toast.show({
                text1: 'Error fetching year batches',
                text2: error.message,
            });
        }
    };

    const fetchMinistryCategories = async () => {
        try {
            const response = await axios.get(`${baseURL}/ministryCategory/`);
            if (Array.isArray(response.data)) {
                setMinistryCategories(response.data);
            } else {
                setMinistryCategories([]); 
            }
        } catch (error) {
            console.error('Error fetching ministry categories:', error.response?.data || error.message);
            Toast.show({
                text1: 'Error fetching ministry categories',
                text2: error.message || 'An error occurred while fetching ministry categories',
            });
        }
    };
    

    const handleChange = (name, value) => {
        if (name.includes('address.')) {
            const field = name.split('.')[1];
            setMember((prev) => ({
                ...prev,
                address: { ...prev.address, [field]: value },
            }));
        } else {
            setMember((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImagePick = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            console.log('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const selectedImage = result.assets[0];
            setImagePreview(selectedImage.uri);
            setMember((prev) => ({ ...prev, image: selectedImage }));
        }
    };

    const validateForm = () => {
        if (
            !member.firstName ||
            !member.lastName ||
            !member.age ||
            !member.birthday ||
            !member.position ||
            !member.memberYearBatch ||
            !member.ministryCategory
        ) {
            Toast.show({ text1: 'Please fill all required fields' });
            return false;
        }
        return true;
    };

    const submitForm = async () => {
        if (!validateForm()) return; 

        const formData = new FormData();
        formData.append('firstName', member.firstName);
        formData.append('middleName', member.middleName);
        formData.append('lastName', member.lastName);
        formData.append('age', member.age);
        formData.append('birthday', new Date(member.birthday).toISOString()); 
        formData.append('position', member.position);
        formData.append('memberYearBatch', member.memberYearBatch);
        formData.append('ministryCategory', member.ministryCategory);
        formData.append('address', JSON.stringify(member.address));

        if (member.image) {
            console.log('Image:', member.image);  
            formData.append('image', {
                uri: member.image.uri,
                type: mime.getType(member.image.uri) || 'image/jpeg',
                name: member.image.uri.split('/').pop(),
            });
        } else {
            console.log('No image selected');
        }

        try {
            const response = await axios.post(`${baseURL}/member/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response.data);
            Toast.show({ text1: 'Member Created Successfully!' });

            // Reset form
            setMember({
                firstName: '',
                middleName: '',
                lastName: '',
                age: '',
                birthday: '',
                address: {
                    baranggay: '',
                    zip: '',
                    city: '',
                    country: '',
                },
                position: '',
                memberYearBatch: '',
                ministryCategory: '',
                image: null,
            });
            setImagePreview(null);
        } catch (error) {
            console.error('Error uploading image', error.response?.data || error);
            Toast.show({
                text1: 'Error creating member',
                text2: error.message,
            });
        }
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <TextInput
                placeholder="First Name"
                value={member.firstName}
                onChangeText={(value) => handleChange('firstName', value)}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />
            <TextInput
                placeholder="Middle Name"
                value={member.middleName}
                onChangeText={(value) => handleChange('middleName', value)}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />
            <TextInput
                placeholder="Last Name"
                value={member.lastName}
                onChangeText={(value) => handleChange('lastName', value)}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />
            <TextInput
                placeholder="Age"
                keyboardType="number-pad"
                value={member.age}
                onChangeText={(value) => handleChange('age', value)}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />
            <TextInput
                placeholder="Birthday (YYYY-MM-DD)"
                value={member.birthday}
                onChangeText={(value) => handleChange('birthday', value)}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />

            {/* Address */}
            <TextInput
                placeholder="Barangay"
                value={member.address.baranggay}
                onChangeText={(value) => handleChange('address.baranggay', value)}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />
            <TextInput
                placeholder="Zip"
                keyboardType="number-pad"
                value={member.address.zip}
                onChangeText={(value) => handleChange('address.zip', value)}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />
            <TextInput
                placeholder="City"
                value={member.address.city}
                onChangeText={(value) => handleChange('address.city', value)}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />
            <TextInput
                placeholder="Country"
                value={member.address.country}
                onChangeText={(value) => handleChange('address.country', value)}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />

            <TextInput
                placeholder="Position"
                value={member.position}
                onChangeText={(value) => handleChange('position', value)}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />

            <Picker
                selectedValue={member.memberYearBatch}
                onValueChange={(itemValue) => handleChange('memberYearBatch', itemValue)}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            >
                <Picker.Item label="Select Year Batch" value="" />
                {yearBatches.length === 0 ? (
                    <Picker.Item label="No Year Batches Available" value="" />
                ) : (
                    yearBatches.map((batch) => (
                        <Picker.Item
                            key={batch._id}
                            label={`${batch.name} (${batch.yearRange.startYear} - ${batch.yearRange.endYear})`}
                            value={batch._id}
                        />
                    ))
                )}
            </Picker>


            <Picker
                selectedValue={member.ministryCategory}
                onValueChange={(value) => handleChange('ministryCategory', value)}
                style={{ marginVertical: 10 }}
            >
                {ministryCategories.map((category) => (
                    <Picker.Item key={category._id} label={category.name} value={category._id} />
                ))}
            </Picker>

            <Button title="Pick Image" onPress={handleImagePick} />
            {imagePreview && <Image source={{ uri: imagePreview }} style={{ width: 100, height: 100, marginTop: 10 }} />}

            <Button title="Submit" onPress={submitForm} />
        </ScrollView>
    );
};

export default Members;
