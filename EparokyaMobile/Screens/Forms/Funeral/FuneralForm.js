import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Image, View, Platform } from 'react-native';
import {
  Input, Button, Select, FormControl, Text, VStack, Box
} from "native-base";

import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';
import baseURL from '../../../assets/common/baseUrl';

const FuneralForm = ({ navigation }) => {
  const [name, setName] = useState('');
  const [dateOfDeath, setDateOfDeath] = useState(new Date());
  const [age, setAge] = useState('');
  const [personStatus, setPersonStatus] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({ state: '', zip: '', country: '' });
  const [priestVisit, setPriestVisit] = useState('');
  const [reasonOfDeath, setReasonOfDeath] = useState('');
  const [funeralDate, setFuneralDate] = useState(new Date());
  const [funeralTime, setFuneralTime] = useState(new Date());
  const [placeOfDeath, setPlaceOfDeath] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [placingOfPall, setPlacingOfPall] = useState({ by: '', familyMembers: [] });
  const [funeralMassDate, setFuneralMassDate] = useState(new Date());
  const [funeralMassTime, setFuneralMassTime] = useState(new Date());
  const [funeralMass, setFuneralMass] = useState('');
  const [deathCertificate, setDeathCertificate] = useState(null);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState(null);

  const { user, token } = useSelector(state => state.auth);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setDeathCertificate(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    console.log('Submitting form...');
    if (!name || !dateOfDeath || !age || !contactPerson || !personStatus || !relationship || !phone || !priestVisit || !reasonOfDeath || !funeralDate || !funeralTime || !placeOfDeath || !serviceType || !funeralMassDate || !funeralMassTime || !funeralMass || !deathCertificate) {
      setError('Please fill in all the required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('dateOfDeath', dateOfDeath.toISOString());
    formData.append('personStatus', personStatus);
    formData.append('age', age);
    formData.append('contactPerson', contactPerson);
    formData.append('relationship', relationship);
    formData.append('phone', phone);
    formData.append('address', JSON.stringify(address));
    formData.append('priestVisit', priestVisit);
    formData.append('reasonOfDeath', reasonOfDeath);
    formData.append('funeralDate', funeralDate.toISOString());
    formData.append('funeraltime', funeralTime.toISOString());
    formData.append('placeOfDeath', placeOfDeath);
    formData.append('serviceType', serviceType);
    formData.append('placingOfPall', JSON.stringify(placingOfPall));
    formData.append('funeralMassDate', funeralMassDate.toISOString());
    formData.append('funeralMasstime', funeralMassTime.toISOString());
    formData.append('funeralMass', funeralMass);
    formData.append('userId', user?._id);
    formData.append('deathCertificate', {
      uri: deathCertificate.uri,
      type: 'image/jpeg',
      name: 'deathCertificate.jpg',
    });

    console.log('Form data:', formData);

    try {
      const response = await axios.post(`${baseURL}/funeralCreate`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response);
      if (response.status === 201) {
        Alert.alert('Success', 'Funeral form submitted successfully.');
        navigation.navigate('Home');
      } else {
        setError('Failed to submit form. Please try again.');
      }
    } catch (err) {
      if (err.response) {
        // Server responded with a status other than 200 range
        console.error('Response error:', err.response.data);
        setError(`Error: ${err.response.data.message}`);
      } else if (err.request) {
        // Request was made but no response received
        console.error('Request error:', err.request);
        setError('Network error: No response received from server.');
      } else {
        // Something else happened
        console.error('Error:', err.message);
        setError(`Error: ${err.message}`);
      }
    }
  };

  const showDatepicker = (picker) => {
    setCurrentPicker(picker);
    setShowDatePicker(true);
  };

  const showTimepicker = (picker) => {
    setCurrentPicker(picker);
    setShowTimePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (currentPicker === 'dateOfDeath') {
        setDateOfDeath(selectedDate);
      } else if (currentPicker === 'funeralDate') {
        setFuneralDate(selectedDate);
      } else if (currentPicker === 'funeralMassDate') {
        setFuneralMassDate(selectedDate);
      }
      console.log(`Updated ${currentPicker}:`, selectedDate.toISOString());
    }
  };


  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      if (currentPicker === 'funeralTime') setFuneralTime(selectedTime);
      if (currentPicker === 'funeralMassTime') setFuneralMassTime(selectedTime);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Box>
        <Text fontSize="2xl" mb="4">Funeral Form</Text>
        {error ? <Text color="red.500">{error}</Text> : null}

        <FormControl mb="4">
          <FormControl.Label>Full Name</FormControl.Label>
          <Input
            value={name}
            onChangeText={setName}
          />
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Select Date of Death</FormControl.Label>
          <Button style={{ backgroundColor: '#26572E', borderRadius: 8 }} onPress={() => showDatepicker('dateOfDeath')}>
            {dateOfDeath.toDateString()}
          </Button>
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Kalalagyan sa Buhay?</FormControl.Label>
          <Select
            selectedValue={personStatus}
            onValueChange={(value) => setPersonStatus(value)}
          >
            <Select.Item label="Dalaga/Binata" value="Dalaga/Binata" />
            <Select.Item label="May Asawa" value="May Asawa" />
            <Select.Item label="Biyuda" value="Biyuda" />
          </Select>
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Age</FormControl.Label>
          <Input
            value={age}
            onChangeText={setAge}
          />
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Contact Person</FormControl.Label>
          <Input
            value={contactPerson}
            onChangeText={setContactPerson}
          />
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Relationship</FormControl.Label>
          <Input
            value={relationship}
            onChangeText={setRelationship}
          />
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Phone</FormControl.Label>
          <Input
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>State</FormControl.Label>
          <Input
            value={address.state}
            onChangeText={(text) => setAddress({ ...address, state: text })}
          />
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Zip</FormControl.Label>
          <Input
            value={address.zip}
            onChangeText={(text) => setAddress({ ...address, zip: text })}
          />
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Country</FormControl.Label>
          <Input
            value={address.country}
            onChangeText={(text) => setAddress({ ...address, country: text })}
          />
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Priest Visit</FormControl.Label>
          <Select
            selectedValue={priestVisit}
            onValueChange={(value) => setPriestVisit(value)}
          >
            <Select.Item label="Oo/Yes" value="Oo/Yes" />
            <Select.Item label="Hindi/No" value="Hindi/No" />
          </Select>
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Reason of Death</FormControl.Label>
          <Input
            value={reasonOfDeath}
            onChangeText={setReasonOfDeath}
          />
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Select Funeral Date</FormControl.Label>
          <Button style={{ backgroundColor: '#26572E', borderRadius: 8 }} onPress={() => showDatepicker('funeralDate')}>
            {funeralDate ? funeralDate.toLocaleDateString() : 'Select Date'}
          </Button>

        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Select Funeral Time</FormControl.Label>
          <Button style={{ backgroundColor: '#26572E', borderRadius: 8 }} onPress={() => showTimepicker('funeralTime')}>
            {funeralTime.toLocaleTimeString()}
          </Button>
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Place of Death</FormControl.Label>
          <Input
            value={placeOfDeath}
            onChangeText={setPlaceOfDeath}
          />
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Service Type</FormControl.Label>
          <Select
            selectedValue={serviceType}
            onValueChange={(value) => setServiceType(value)}
          >
            <Select.Item label="Misa" value="Misa" />
            <Select.Item label="Blessing" value="Blessing" />
          </Select>
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Placing of Pall</FormControl.Label>
          <Select
            selectedValue={placingOfPall.by}
            onValueChange={(value) => setPlacingOfPall({ ...placingOfPall, by: value })}
          >
            <Select.Item label="Priest" value="Priest" />
            <Select.Item label="Family Member" value="Family Member" />
          </Select>
        </FormControl>

        {placingOfPall.by === 'Family Member' && (
          <Box>
            {placingOfPall.familyMembers.map((member, index) => (
              <FormControl mb="4" key={index}>
                <FormControl.Label>Family Member</FormControl.Label>
                <Input
                  value={member}
                  onChangeText={(text) => {
                    let updatedFamily = [...placingOfPall.familyMembers];
                    updatedFamily[index] = text;
                    setPlacingOfPall({ ...placingOfPall, familyMembers: updatedFamily });
                  }}
                />
              </FormControl>
            ))}
            <Button style={{ backgroundColor: '#26572E', borderRadius: 8 }} onPress={() => setPlacingOfPall({ ...placingOfPall, familyMembers: [...placingOfPall.familyMembers, ''] })}>
              Add Family Member
            </Button>
          </Box>
        )}

        <FormControl mb="4">
          <FormControl.Label>Select Funeral Mass Date</FormControl.Label>
          <Button style={{ backgroundColor: '#26572E', borderRadius: 8 }} onPress={() => showDatepicker('funeralMassDate')}>
            {funeralMassDate.toDateString()}
          </Button>
        </FormControl>

        <FormControl mb="4" >
          <FormControl.Label>Select Funeral Mass Time</FormControl.Label>
          <Button style={{ backgroundColor: '#26572E', borderRadius: 8 }} onPress={() => showTimepicker('funeralMassTime')}>
            {funeralMassTime.toLocaleTimeString()}
          </Button>
        </FormControl>

        <FormControl mb="4">
          <FormControl.Label>Funeral Mass</FormControl.Label>
          <Input
            value={funeralMass}
            onChangeText={setFuneralMass}
          />
        </FormControl>

        <Button style={{ backgroundColor: '#26572E', borderRadius: 8 }} onPress={pickImage}>
          Upload Death Certificate
        </Button>
        {deathCertificate && <Image source={{ uri: deathCertificate.uri }} style={{ width: 200, height: 200 }} />}

        <Button onPress={handleSubmit} mt="4" style={{ backgroundColor: '#26572E', borderRadius: 8 }}>
          Submit
        </Button>

      </Box>

      {showDatePicker && (
        <DateTimePicker
          value={
            currentPicker === 'dateOfDeath'
              ? dateOfDeath
              : currentPicker === 'funeralDate'
                ? funeralDate
                : funeralMassDate
          }
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={currentPicker === 'funeralTime' ? funeralTime : funeralMassTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </ScrollView>
  );
};

export default FuneralForm;