import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";

const WeddingForm4 = ({ navigation, route }) => {
  const { weddingData, userId } = route.params;

  const [ninongName, setNinongName] = useState('');
  const [ninongStreet, setNinongStreet] = useState('');
  const [ninongZip, setNinongZip] = useState('');
  const [ninongCity, setNinongCity] = useState('');
  const [ninangName, setNinangName] = useState('');
  const [ninangStreet, setNinangStreet] = useState('');
  const [ninangZip, setNinangZip] = useState('');
  const [ninangCity, setNinangCity] = useState('');
  const [error, setError] = useState('');

  const { user, token } = useSelector(state => state.auth);

  const goToNextPage = () => {
    if (!ninongName || !ninongStreet || !ninongZip || !ninongCity || !ninangName || !ninangStreet || !ninangZip || !ninangCity) {
      setError('Please fill in all fields.');
      return;
    }

    const ninong = {
      name: ninongName,
      address: {
        street: ninongStreet,
        zip: ninongZip,
        city: ninongCity,
      },
    };

    const ninang = {
      name: ninangName,
      address: {
        street: ninangStreet,
        zip: ninangZip,
        city: ninangCity,
      },
    };

    const updatedWeddingData = {
      ...weddingData,
      Ninong: [ninong],
      Ninang: [ninang],
    };

    navigation.navigate('WeddingForm5', {
      updatedWeddingData,
      userId,
    });
  };

  const clearForm = () => {
    setNinongName('');
    setNinongStreet('');
    setNinongZip('');
    setNinongCity('');
    setNinangName('');
    setNinangStreet('');
    setNinangZip('');
    setNinangCity('');
    setError('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput placeholder="Ninong's Name" value={ninongName} onChangeText={setNinongName} style={styles.input} />
      <TextInput placeholder="Ninong's Street" value={ninongStreet} onChangeText={setNinongStreet} style={styles.input} />
      <TextInput placeholder="Ninong's Zip" value={ninongZip} onChangeText={setNinongZip} style={styles.input} />
      <TextInput placeholder="Ninong's City" value={ninongCity} onChangeText={setNinongCity} style={styles.input} />

      <TextInput placeholder="Ninang's Name" value={ninangName} onChangeText={setNinangName} style={styles.input} />
      <TextInput placeholder="Ninang's Street" value={ninangStreet} onChangeText={setNinangStreet} style={styles.input} />
      <TextInput placeholder="Ninang's Zip" value={ninangZip} onChangeText={setNinangZip} style={styles.input} />
      <TextInput placeholder="Ninang's City" value={ninangCity} onChangeText={setNinangCity} style={styles.input} />

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

export default WeddingForm4;