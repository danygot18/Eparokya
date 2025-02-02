import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

const WeddingForm2 = ({ navigation, route }) => {
  const { bride, brideAge, brideGender, bridePhone, brideAddress } = route.params;
  
  const [groom, setGroom] = useState('');
  const [groomAge, setGroomAge] = useState('');
  const [groomGender, setGroomGender] = useState('');
  const [groomPhone, setGroomPhone] = useState('');
  
  // Separate state fields for the address
  const [groomState, setGroomState] = useState('');
  const [groomZip, setGroomZip] = useState('');
  const [groomCountry, setGroomCountry] = useState('');

  const [error, setError] = useState('');

  const goToNextPage = () => {
    // Check if all required fields are filled in
    if (!groom || !groomAge || !groomGender || !groomPhone || !groomState || !groomZip || !groomCountry) {
      setError('Please fill in all fields.');
      return;
    }

    const formattedGroomAge = Number(groomAge);
    const groomAddress = {
      state: groomState,
      zip: groomZip,
      country: groomCountry,
    };

    // Pass all data to the next form page
    navigation.navigate('WeddingForm3', {
      bride,
      brideAge,
      brideGender,
      bridePhone,
      brideAddress,
      groom,
      groomAge: formattedGroomAge,
      groomGender: groomGender.trim(),
      groomPhone,
      groomAddress, // Pass the structured address object
    });
  };

  // Clear all fields
  const clearFields = () => {
    setGroom('');
    setGroomAge('');
    setGroomGender('');
    setGroomPhone('');
    setGroomState('');
    setGroomZip('');
    setGroomCountry('');
    setError('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Groom's Name"
        value={groom}
        onChangeText={setGroom}
        style={styles.input}
      />
      <TextInput
        placeholder="Age"
        keyboardType="numeric"
        value={groomAge}
        onChangeText={setGroomAge}
        style={styles.input}
      />
      <TextInput
        placeholder="Gender"
        value={groomGender}
        onChangeText={setGroomGender}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        keyboardType="phone-pad"
        value={groomPhone}
        onChangeText={setGroomPhone}
        style={styles.input}
      />
      {/* Separate fields for the address */}
      <TextInput
        placeholder="State"
        value={groomState}
        onChangeText={setGroomState}
        style={styles.input}
      />
      <TextInput
        placeholder="Zip"
        value={groomZip}
        onChangeText={setGroomZip}
        style={styles.input}
      />
      <TextInput
        placeholder="Country"
        value={groomCountry}
        onChangeText={setGroomCountry}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Next" onPress={goToNextPage} />
      <Button title="Clear Fields" onPress={clearFields} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' },
  error: { color: 'red', marginBottom: 10 },
});

export default WeddingForm2;
