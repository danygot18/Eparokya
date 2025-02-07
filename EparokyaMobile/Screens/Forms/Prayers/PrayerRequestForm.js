import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import baseURL from '../../../assets/common/baseUrl';
import { useSelector } from 'react-redux';

const PrayerRequestForm = ({ navigation }) => {
    const [formData, setFormData] = useState({
        offerrorsName: '',
        prayerType: '',
        prayerRequestDate: '',
        Intentions: [{ name: '' }],
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { user, token } = useSelector(state => state.auth);

    const handleChange = (value, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleIntentionChange = (value, index) => {
        const updatedIntentions = [...formData.Intentions];
        updatedIntentions[index].name = value;
        setFormData(prev => ({
            ...prev,
            Intentions: updatedIntentions,
        }));
    };

    const handleAddIntention = () => {
        setFormData(prev => ({
            ...prev,
            Intentions: [...prev.Intentions, { name: '' }],
        }));
    };

    const handleRemoveIntention = index => {
        if (formData.Intentions.length > 1) {
            setFormData(prev => ({
                ...prev,
                Intentions: prev.Intentions.filter((_, i) => i !== index),
            }));
        }
    };

    const handleClear = () => {
        setFormData({
            offerrorsName: '',
            prayerType: '',
            prayerRequestDate: '',
            Intentions: [{ name: '' }],
        });
    };

    const handleSubmit = async () => {
        if (!formData.offerrorsName || !formData.prayerType || !formData.prayerRequestDate) {
            Alert.alert('Error', 'Please fill out all required fields!');
            return;
        }
        try {
            const submissionData = { ...formData, userId: user?._id };
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${baseURL}/prayerRequestSubmit`, submissionData, config);
            Alert.alert('Success', 'Prayer request submitted successfully!');
            handleClear();
        } catch (error) {
            console.error('Error submitting prayer request:', error);
            Alert.alert('Error', 'Failed to submit the request. Please try again.');
        }
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Prayer Request</Text>

            <Text>Full Name</Text>
            <TextInput
                value={formData.offerrorsName}
                onChangeText={value => handleChange(value, 'offerrorsName')}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />

            <Text>Prayer Type</Text>
            <Picker
                selectedValue={formData.prayerType}
                onValueChange={(value) => handleChange(value, 'prayerType')}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            >
                <Picker.Item label="Select Prayer Type" value="" />
                <Picker.Item label="Eternal Repose(Patay)" value="Eternal Repose(Patay)" />
                <Picker.Item label="Thanks Giving(Pasasalamat)" value="Thanks Giving(Pasasalamat)" />
                <Picker.Item label="Special Intentions(Natatanging Kahilingan)" value="Special Intentions(Natatanging Kahilingan)" />
            </Picker>

            <Text>Prayer Request Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                    editable={false}
                    value={formData.prayerRequestDate ? new Date(formData.prayerRequestDate).toLocaleDateString() : ''}
                    style={{ borderWidth: 1, padding: 10 }}
                />
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={formData.prayerRequestDate ? new Date(formData.prayerRequestDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) handleChange(date.toISOString(), 'prayerRequestDate');
                    }}
                />
            )}

            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Special Intentions</Text>
            {formData.Intentions.map((intention, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        value={intention.name}
                        onChangeText={value => handleIntentionChange(value, index)}
                        style={{ borderBottomWidth: 1, flex: 1, marginBottom: 10 }}
                        placeholder='Enter Intention'
                    />
                    <TouchableOpacity onPress={() => handleRemoveIntention(index)}>
                        <Text style={{ color: 'red', marginLeft: 10 }}>Remove</Text>
                    </TouchableOpacity>
                </View>
            ))}
            <Button title='Add Intention' onPress={handleAddIntention} />

            <View style={{ marginTop: 20 }}>
                <Button title='Clear All Fields' color='gray' onPress={handleClear} />
                <Button title='Submit' onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
};

export default PrayerRequestForm;