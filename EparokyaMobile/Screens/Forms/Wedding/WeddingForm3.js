import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import SyncStorage from 'sync-storage';
import baseURL from "../../../assets/common/baseUrl";
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';

const WeddingForm3 = ({ navigation, route }) => {
  const { bride, brideAge, brideGender, bridePhone, brideAddress,
    groom, groomAge, groomGender, groomPhone, groomAddress } = route.params;

  const [attendees, setAttendees] = useState('');
  const [flowerGirl, setFlowerGirl] = useState('');
  const [ringBearer, setRingBearer] = useState('');
  const [weddingDate, setWeddingDate] = useState(new Date());
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [groomRelative, setGroomRelative] = useState('');
  const [groomRelationship, setGroomRelationship] = useState('');
  const [brideRelative, setBrideRelative] = useState('');
  const [brideRelationship, setBrideRelationship] = useState('');

  const [brideBirthCertificate, setBrideBirthCertificate] = useState(null);
  const [groomBirthCertificate, setGroomBirthCertificate] = useState(null);
  const [brideBaptismalCertificate, setBrideBaptismalCertificate] = useState(null);
  const [groomBaptismalCertificate, setGroomBaptismalCertificate] = useState(null);

  const { user, token } = useSelector(state => state.auth);

  const pickDocument = async (setFile) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Camera roll permissions are needed to select images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFile(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        if (!token) {
          Alert.alert("Error", "Token is missing. Please log in again.");
          navigation.navigate("LoginPage");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${baseURL}/users/profile`, config);
        setUserId(data.user._id);
      } catch (error) {
        Alert.alert("Error", "Unable to retrieve user ID. Please log in again.");
        navigation.navigate("LoginPage");
      }
    };

    fetchUserData();
  }, [navigation]);

  const handleSubmit = async () => {
    if (!attendees || !flowerGirl || !ringBearer || !groomRelative || !groomRelationship || !brideRelative || !brideRelationship || !userId) {
      setError('Please fill in all fields and ensure you are logged in.');
      return;
    }

    if (!brideBirthCertificate || !groomBirthCertificate || !brideBaptismalCertificate || !groomBaptismalCertificate) {
      setError('Please upload all required certificates.');
      return;
    }

    const weddingData = {
      bride,
      brideAge: Number(brideAge),
      brideGender: brideGender.trim(),
      bridePhone,
      brideAddress,
      groom,
      groomAge: Number(groomAge),
      groomGender: groomGender.trim(),
      groomPhone,
      groomAddress,
      brideRelative,
      brideRelationship,
      groomRelative,
      groomRelationship,
      attendees: String(attendees),
      flowerGirl,
      ringBearer,
      weddingDate: weddingDate ? weddingDate.toISOString() : "",
    };

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('weddingData', JSON.stringify(weddingData));

    formData.append('brideBirthCertificate', {
      uri: brideBirthCertificate,
      type: 'image/jpeg',
      name: 'brideBirthCertificate.jpg',
    });
    formData.append('groomBirthCertificate', {
      uri: groomBirthCertificate,
      type: 'image/jpeg',
      name: 'groomBirthCertificate.jpg',
    });
    formData.append('brideBaptismalCertificate', {
      uri: brideBaptismalCertificate,
      type: 'image/jpeg',
      name: 'brideBaptismalCertificate.jpg',
    });
    formData.append('groomBaptismalCertificate', {
      uri: groomBaptismalCertificate,
      type: 'image/jpeg',
      name: 'groomBaptismalCertificate.jpg',
    });

    try {
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      await axios.post(`${baseURL}/wedding/submit`, formData, config);
      Alert.alert("Success", "Wedding form submitted successfully!");
      navigation.navigate('Profile');
    } catch (error) {
      setError('An error occurred while submitting your wedding details. Please try again.');
    }
  };

  const clearForm = () => {
    setAttendees('');
    setFlowerGirl('');
    setRingBearer('');
    setGroomRelative('');
    setGroomRelationship('');
    setBrideRelative('');
    setBrideRelationship('');
    setWeddingDate(new Date());
    setBrideBirthCertificate(null);
    setGroomBirthCertificate(null);
    setBrideBaptismalCertificate(null);
    setGroomBaptismalCertificate(null);
    setError('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput placeholder="Number of Attendees" value={attendees} onChangeText={setAttendees} style={styles.input} />
      <TextInput placeholder="Flower Girl" value={flowerGirl} onChangeText={setFlowerGirl} style={styles.input} />
      <TextInput placeholder="Ring Bearer" value={ringBearer} onChangeText={setRingBearer} style={styles.input} />
      <TextInput placeholder="Groom's Relative" value={groomRelative} onChangeText={setGroomRelative} style={styles.input} />
      <TextInput placeholder="Groom's Relationship" value={groomRelationship} onChangeText={setGroomRelationship} style={styles.input} />
      <TextInput placeholder="Bride's Relative" value={brideRelative} onChangeText={setBrideRelative} style={styles.input} />
      <TextInput placeholder="Bride's Relationship" value={brideRelationship} onChangeText={setBrideRelationship} style={styles.input} />
      
      <Button title="Pick a Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={weddingDate}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setWeddingDate(selectedDate);
          }}
          mode="date"
        />
      )}

      <Button title="Upload Bride Birth Certificate" onPress={() => pickDocument(setBrideBirthCertificate)} />
      {brideBirthCertificate && <Text>Uploaded: {brideBirthCertificate.split('/').pop()}</Text>}

      <Button title="Upload Groom Birth Certificate" onPress={() => pickDocument(setGroomBirthCertificate)} />
      {groomBirthCertificate && <Text>Uploaded: {groomBirthCertificate.split('/').pop()}</Text>}

      <Button title="Upload Bride Baptismal Certificate" onPress={() => pickDocument(setBrideBaptismalCertificate)} />
      {brideBaptismalCertificate && <Text>Uploaded: {brideBaptismalCertificate.split('/').pop()}</Text>}

      <Button title="Upload Groom Baptismal Certificate" onPress={() => pickDocument(setGroomBaptismalCertificate)} />
      {groomBaptismalCertificate && <Text>Uploaded: {groomBaptismalCertificate.split('/').pop()}</Text>}

      <Button title="Submit Form" onPress={handleSubmit} />
      <Button title="Clear Form" onPress={clearForm} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default WeddingForm3;
