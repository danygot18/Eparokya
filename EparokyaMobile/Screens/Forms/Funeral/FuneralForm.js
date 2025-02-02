import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import SyncStorage from 'sync-storage';
import baseURL from '../../../assets/common/baseUrl';
import { useSelector } from 'react-redux';

const FuneralForm = ({ navigation }) => {
    const [name, setName] = useState({ firstName: '', middleName: '', lastName: '', suffix: '' });
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [numberOfSons, setNumberofSons] = useState('');
    const [sons, setSons] = useState('');
    const [numberOfDaughters, setNumberofDaughters] = useState('');
    const [daughters, setDaughters] = useState('');
    const [phone, setPhone] = useState('');
    const [funeralDate, setFuneralDate] = useState(null);
    const [time, setTime] = useState(null);
    const [serviceType, setServiceType] = useState('');
    const [entranceSong, setEntranceSong] = useState('');
    const [placingOfPall, setPlacingOfPall] = useState({ by: '', familyMembers: [] });
    const [address, setAddress] = useState({ state: '', zip: '', country: '' });
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);

    const [showFuneralDatePicker, setShowFuneralDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const { user, token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                
                if (!token) {
                    Alert.alert('Error', 'Token is missing. Please log in again.');
                    navigation.navigate('LoginPage');
                    return;
                }

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${baseURL}/users/profile`, config);
                setUserId(data.user._id);
            } catch (error) {
                console.error('Failed to retrieve user ID:', error.response ? error.response.data : error.message);
                Alert.alert('Error', 'Unable to retrieve user ID. Please log in again.');
                navigation.navigate('LoginPage');
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async () => {
        const formattedAge = Number(age);
        const formattedPhone = Number(phone);

        if (!name.firstName || !name.lastName || !age || !gender || !contactPerson || !phone || !funeralDate || !time || !serviceType) {
            setError('Please fill in all the required fields.');
            return;
        }


        const formData = {
            name,
            gender,
            age: formattedAge,
            numberOfSons,
            sons,
            numberOfDaughters,
            daughters,
            contactPerson,
            phone: formattedPhone,
            address,
            funeralDate,
            time,
            serviceType,
            entranceSong,
            placingOfPall: {
                by: placingOfPall.by,
                familyMembers: placingOfPall.by === 'Family Member' ? placingOfPall.familyMembers : [],
            },
            userId,
        };
        console.log('Form Data:', formData);

        try {
            
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.post(`${baseURL}/funeral/create`, formData, config);

            if (response.status === 201) {
                Alert.alert('Success', 'Funeral form submitted successfully.');
                navigation.navigate('Home');
            } else {
                setError('Failed to submit form. Please try again.');
            }
        } catch (err) {
            console.error('Error submitting form:', err.response ? err.response.data : err.message);
            setError('An error occurred. Please try again later.');
        }
    };

    const CustomCheckbox = ({ title, checked, onPress }) => (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
            }}
        >
            <View
                style={{
                    height: 20,
                    width: 20,
                    borderWidth: 1,
                    borderColor: '#000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                }}
            >
                {checked && (
                    <View
                        style={{
                            height: 12,
                            width: 12,
                            backgroundColor: 'blue',
                        }}
                    />
                )}
            </View>
            <Text>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Funeral Form</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Text>Name of the Deceased</Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={name.firstName}
                onChangeText={(text) => setName({ ...name, firstName: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Middle Name"
                value={name.middleName}
                onChangeText={(text) => setName({ ...name, middleName: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={name.lastName}
                onChangeText={(text) => setName({ ...name, lastName: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Suffix"
                value={name.suffix}
                onChangeText={(text) => setName({ ...name, suffix: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Gender"
                value={gender}
                onChangeText={setGender}
            />
            <TextInput
                style={styles.input}
                placeholder="Age"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
            />
            <TextInput
                style={styles.input}
                placeholder="Number of Sons (if any)"
                keyboardType="numeric"
                value={numberOfSons}
                onChangeText={setNumberofSons}
            />
            <TextInput
                style={styles.input}
                placeholder="Name of Sons  (if any)"
                value={sons}
                onChangeText={setSons}
            />
            <TextInput
                style={styles.input}
                placeholder="Number of Daughters (if any)"
                keyboardType="numeric"
                value={numberOfDaughters}
                onChangeText={setNumberofDaughters}
            />
            <TextInput
                style={styles.input}
                placeholder="Name of Daughters (if any)"
                value={daughters}
                onChangeText={setDaughters}
            />
            <TextInput
                style={styles.input}
                placeholder="Contact Person"
                value={contactPerson}
                onChangeText={setContactPerson}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />
            <TextInput
                style={styles.input}
                placeholder="State"
                value={address.state}
                onChangeText={(text) => setAddress({ ...address, state: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Zip"
                keyboardType="numeric"
                value={address.zip}
                onChangeText={(text) => setAddress({ ...address, zip: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Country"
                value={address.country}
                onChangeText={(text) => setAddress({ ...address, country: text })}
            />

            <View>
                <Button title="Select Funeral Date" onPress={() => setShowFuneralDatePicker(true)} />
                {showFuneralDatePicker && (
                    <DateTimePicker
                        value={funeralDate ? new Date(funeralDate) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowFuneralDatePicker(false);
                            if (selectedDate) setFuneralDate(selectedDate.toISOString());
                        }}
                    />
                )}
                <Text>{funeralDate ? new Date(funeralDate).toLocaleDateString() : 'No date selected'}</Text>
            </View>

            <View>
                <Button title="Select Time" onPress={() => setShowTimePicker(true)} />
                {showTimePicker && (
                    <DateTimePicker
                        value={time ? new Date(time) : new Date()}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                            setShowTimePicker(false);
                            if (selectedTime) setTime(selectedTime.toISOString());
                        }}
                    />
                )}
                <Text>{time ? new Date(time).toLocaleTimeString() : 'No time selected'}</Text>
            </View>

            <Text style={styles.label}>Service Type</Text>
            <CustomCheckbox
                title="Mass"
                checked={serviceType === 'Mass'}
                onPress={() => setServiceType('Mass')}
            />
            <CustomCheckbox
                title="Word Service"
                checked={serviceType === 'Word Service'}
                onPress={() => setServiceType('Word Service')}
            />

            <Text style={styles.label}>Entrance Song</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter the entrance song"
                value={entranceSong}
                onChangeText={setEntranceSong}
            />

            <Text style={styles.label}>Placing of Pall</Text>
            <CustomCheckbox
                title="Priest"
                checked={placingOfPall.by === 'Priest'}
                onPress={() => setPlacingOfPall({ ...placingOfPall, by: 'Priest', familyMembers: [] })}
            />
            <CustomCheckbox
                title="Family Member"
                checked={placingOfPall.by === 'Family Member'}
                onPress={() => setPlacingOfPall({ ...placingOfPall, by: 'Family Member' })}
            />
            {placingOfPall.by === 'Family Member' && (
                <TextInput
                    style={styles.input}
                    placeholder="Family Member Names"
                    value={placingOfPall.familyMembers.join(', ')}
                    onChangeText={(text) => setPlacingOfPall({ ...placingOfPall, familyMembers: text.split(', ') })}
                />
            )}

            <Button title="Submit" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
    label: {
        fontSize: 18,
        marginTop: 20,
        marginBottom: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default FuneralForm;
