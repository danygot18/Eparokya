import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";

const WeddingForm3 = ({ navigation, route }) => {
  const { bride, brideAge, brideGender = '', bridePhone, brideAddress,
    groom, groomAge, groomGender = '', groomPhone, groomAddress } = route.params;

  const [brideBirthDate, setBrideBirthDate] = useState(new Date());
  const [brideOccupation, setBrideOccupation] = useState('');
  const [brideReligion, setBrideReligion] = useState('');
  const [brideFather, setBrideFather] = useState('');
  const [brideMother, setBrideMother] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [showBrideBirthDatePicker, setShowBrideBirthDatePicker] = useState(false);

  const { user, token } = useSelector(state => state.auth);


  const goToNextPage = () => {
    if (!brideOccupation || !brideReligion || !brideFather || !brideMother) {
      setError('Please fill in all fields and ensure you are logged in.');
      return;
    }

    const weddingData = {
      bride,
      brideAge: Number(brideAge),
      brideGender: brideGender.trim(),
      bridePhone,
      brideAddress,
      brideBirthDate: brideBirthDate.toISOString(),
      brideOccupation,
      brideReligion,
      brideFather,
      brideMother,
      groom,
      groomAge: Number(groomAge),
      groomGender: groomGender.trim(),
      groomPhone,
      groomAddress,
    };

    navigation.navigate('WeddingForm4', {
      weddingData,
      userId,
    });
  };

  const clearForm = () => {
    setBrideOccupation('');
    setBrideReligion('');
    setBrideFather('');
    setBrideMother('');
    setBrideBirthDate(new Date());
    setError('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput placeholder="Bride's Occupation" value={brideOccupation} onChangeText={setBrideOccupation} style={styles.input} />
      <TextInput placeholder="Bride's Religion" value={brideReligion} onChangeText={setBrideReligion} style={styles.input} />
      <TextInput placeholder="Bride's Father" value={brideFather} onChangeText={setBrideFather} style={styles.input} />
      <TextInput placeholder="Bride's Mother" value={brideMother} onChangeText={setBrideMother} style={styles.input} />

      <Button title="Pick Bride's Birth Date" onPress={() => setShowBrideBirthDatePicker(true)} />
      {showBrideBirthDatePicker && (
        <DateTimePicker
          value={brideBirthDate}
          onChange={(event, selectedDate) => {
            setShowBrideBirthDatePicker(false);
            if (selectedDate) setBrideBirthDate(selectedDate);
          }}
          mode="date"
        />
      )}
      <Text>{brideBirthDate.toDateString()}</Text>

      <Button title="Next" onPress={goToNextPage} />
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