import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

const WeddingForm = ({ navigation }) => {
  const [bride, setBride] = useState('');
  const [brideAge, setBrideAge] = useState('');
  const [brideGender, setBrideGender] = useState('');
  const [bridePhone, setBridePhone] = useState('');
  
  const [brideState, setBrideState] = useState('');
  const [brideZip, setBrideZip] = useState('');
  const [brideCountry, setBrideCountry] = useState('');
  
  const [error, setError] = useState('');

  const goToNextPage = () => {
    if (!bride || !brideAge || !brideGender || !bridePhone || !brideState || !brideZip || !brideCountry) {
      setError('Please fill in all fields.');
      return;
    }

    const formattedBrideAge = Number(brideAge);
    const brideAddress = {
      state: brideState,
      zip: brideZip,
      country: brideCountry,
    };

    navigation.navigate('WeddingForm2', {
      bride,
      brideAge: formattedBrideAge,
      brideGender: brideGender.trim(),
      bridePhone,
      brideAddress, 
    });
  };

  const clearFields = () => {
    setBride('');
    setBrideAge('');
    setBrideGender('');
    setBridePhone('');
    setBrideState('');
    setBrideZip('');
    setBrideCountry('');
    setError('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Bride's Name"
        value={bride}
        onChangeText={setBride}
        style={styles.input}
      />
      <TextInput
        placeholder="Age"
        keyboardType="numeric"
        value={brideAge}
        onChangeText={setBrideAge}
        style={styles.input}
      />
      <TextInput
        placeholder="Gender"
        value={brideGender}
        onChangeText={setBrideGender}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        keyboardType="phone-pad"
        value={bridePhone}
        onChangeText={setBridePhone}
        style={styles.input}
      />
      <TextInput
        placeholder="State"
        value={brideState}
        onChangeText={setBrideState}
        style={styles.input}
      />
      <TextInput
        placeholder="Zip"
        value={brideZip}
        onChangeText={setBrideZip}
        style={styles.input}
      />
      <TextInput
        placeholder="Country"
        value={brideCountry}
        onChangeText={setBrideCountry}
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

export default WeddingForm;
