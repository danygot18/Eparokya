import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../../assets/common/baseUrl';
import { useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';

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
    const navigation = useNavigation();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const { user, token } = useSelector(state => state.auth);

    //   useEffect(() => {
    //     const fetchUserData = async () => {
    //       try {

    //         if (!token) {
    //           Alert.alert("Error", "Token is missing. Please log in again.");
    //           navigation.navigate("LoginPage");
    //           return;
    //         }

    //         const config = { headers: { Authorization: `Bearer ${token}` } };
    //         const { data } = await axios.get(`${baseURL}/profile`, config);
    //         setUserId(data.user._id);
    //       } catch (error) {
    //         Alert.alert("Error", "Unable to retrieve user ID. Please log in again.");
    //         navigation.navigate("LoginPage");
    //       }
    //     };

    //     fetchUserData();
    //   }, [navigation]);


    const handleChange = (value, fieldPath) => {
        const keys = fieldPath.split('.');
        setFormData((prev) => {
            const updated = { ...prev };
            let current = updated;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
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

    const handleSubmit = async () => {
        const { fullName, dateOfBirth } = formData.person;
        const { purpose, contactNumber } = formData;

        if (!fullName || !dateOfBirth || !purpose || !contactNumber) {
            Alert.alert('Error', 'Please fill out all required fields!');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const submissionData = { ...formData, userId: user?._id };

            const response = await axios.post(`${baseURL}/counselingSubmit`, submissionData, config);

            if (response.status === 201) {
                Alert.alert('Success', 'Counseling form submitted successfully.');
                navigation.navigate('Home');
            } else {
                setError('Failed to submit form. Please try again.');
            }
        } catch (err) {
            console.error('Error submitting form:', err.response ? err.response.data : err.message);
            setError('An error occurred. Please try again later.');
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Personal Information</Text>
            <TextInput placeholder="Full Name" style={styles.input} value={formData.person.fullName} onChangeText={(value) => handleChange(value, 'person.fullName')} />
            <TextInput placeholder="Date of Birth (YYYY-MM-DD)" style={styles.input} value={formData.person.dateOfBirth} onChangeText={(value) => handleChange(value, 'person.dateOfBirth')} />

            <Text style={styles.header}>Counseling Details</Text>
            <TextInput placeholder="Purpose" style={styles.input} value={formData.purpose} onChangeText={(value) => handleChange(value, 'purpose')} />
           
            <TextInput
                placeholder="Contact Number"
                style={styles.input}
                value={formData.contactNumber}
                onChangeText={(value) => handleChange(value, 'contactNumber')}
                keyboardType="phone-pad"
            />

            <Text style={styles.header}>Contact Person</Text>
            <TextInput placeholder="Full Name" style={styles.input} value={formData.contactPerson.fullName} onChangeText={(value) => handleChange(value, 'contactPerson.fullName')} />
            <TextInput placeholder="Contact Number" style={styles.input} value={formData.contactPerson.contactNumber} onChangeText={(value) => handleChange(value, 'contactPerson.contactNumber')} />
            <TextInput placeholder="Relationship" style={styles.input} value={formData.contactPerson.relationship} onChangeText={(value) => handleChange(value, 'contactPerson.relationship')} />

            <Text style={styles.header}>Address</Text>
            <TextInput placeholder="Block" style={styles.input} value={formData.address.block} onChangeText={(value) => handleChange(value, 'address.block')} />
            <TextInput placeholder="Lot" style={styles.input} value={formData.address.lot} onChangeText={(value) => handleChange(value, 'address.lot')} />
            <TextInput placeholder="Street" style={styles.input} value={formData.address.street} onChangeText={(value) => handleChange(value, 'address.street')} />
            <TextInput placeholder="Phase" style={styles.input} value={formData.address.phase} onChangeText={(value) => handleChange(value, 'address.phase')} />
            <TextInput placeholder="Baranggay" style={styles.input} value={formData.address.baranggay} onChangeText={(value) => handleChange(value, 'address.baranggay')} />

            <Text style={styles.header}>Schedule</Text>

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                    placeholder="Counseling Date (YYYY-MM-DD)"
                    style={styles.input}
                    value={formData.counselingDate}
                    editable={false}
                />
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={new Date(formData.counselingDate || Date.now())}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) handleChange(date.toISOString().split('T')[0], 'counselingDate');
                    }}
                />
            )}

            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                <TextInput
                    placeholder="Counseling Time (HH:MM AM/PM)"
                    style={styles.input}
                    value={formData.counselingTime}
                    editable={false}
                />
            </TouchableOpacity>
            {showTimePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="time"
                    display="default"
                    onChange={(event, time) => {
                        setShowTimePicker(false);
                        if (time) handleChange(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 'counselingTime');
                    }}
                />
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleClear}>
                    <Text style={styles.buttonText}>Clear All Fields</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    header: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 5, borderRadius: 5 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    button: { backgroundColor: '#26572E', padding: 10, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default CounselingForm;
