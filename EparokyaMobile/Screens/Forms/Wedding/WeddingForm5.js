import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';

const WeddingForm5 = ({ navigation, route }) => {
  const { updatedWeddingData, userId } = route.params;

  const [groomNewBaptismalCertificate, setGroomNewBaptismalCertificate] = useState(null);
  const [groomNewConfirmationCertificate, setGroomNewConfirmationCertificate] = useState(null);
  const [groomMarriageLicense, setGroomMarriageLicense] = useState(null);
  const [groomMarriageBans, setGroomMarriageBans] = useState(null);
  const [groomOrigCeNoMar, setGroomOrigCeNoMar] = useState(null);
  const [groomOrigPSA, setGroomOrigPSA] = useState(null);
  const [error, setError] = useState('');

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

  const goToNextPage = () => {
    if (!groomNewBaptismalCertificate || !groomNewConfirmationCertificate || !groomMarriageLicense || !groomMarriageBans || !groomOrigCeNoMar || !groomOrigPSA) {
      setError('Please upload all required certificates.');
      return;
    }

    const certificates = {
      GroomNewBaptismalCertificate: {
        uri: groomNewBaptismalCertificate,
        type: 'image/jpeg',
        name: 'groomNewBaptismalCertificate.jpg',
      },
      GroomNewConfirmationCertificate: {
        uri: groomNewConfirmationCertificate,
        type: 'image/jpeg',
        name: 'groomNewConfirmationCertificate.jpg',
      },
      GroomMarriageLicense: {
        uri: groomMarriageLicense,
        type: 'image/jpeg',
        name: 'groomMarriageLicense.jpg',
      },
      GroomMarriageBans: {
        uri: groomMarriageBans,
        type: 'image/jpeg',
        name: 'groomMarriageBans.jpg',
      },
      GroomOrigCeNoMar: {
        uri: groomOrigCeNoMar,
        type: 'image/jpeg',
        name: 'groomOrigCeNoMar.jpg',
      },
      GroomOrigPSA: {
        uri: groomOrigPSA,
        type: 'image/jpeg',
        name: 'groomOrigPSA.jpg',
      },
    };

    console.log('Navigating to WeddingForm6 with data:', {
      updatedWeddingData,
      certificates,
      userId,
    });

    navigation.navigate('WeddingForm6', {
      updatedWeddingData,
      certificates,
      userId,
    });
  };

  const clearForm = () => {
    setGroomNewBaptismalCertificate(null);
    setGroomNewConfirmationCertificate(null);
    setGroomMarriageLicense(null);
    setGroomMarriageBans(null);
    setGroomOrigCeNoMar(null);
    setGroomOrigPSA(null);
    setError('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {error && <Text style={styles.error}>{error}</Text>}

      <Button title="Upload Groom New Baptismal Certificate" onPress={() => pickDocument(setGroomNewBaptismalCertificate)} />
      {groomNewBaptismalCertificate && <Text>Uploaded: {groomNewBaptismalCertificate.split('/').pop()}</Text>}

      <Button title="Upload Groom New Confirmation Certificate" onPress={() => pickDocument(setGroomNewConfirmationCertificate)} />
      {groomNewConfirmationCertificate && <Text>Uploaded: {groomNewConfirmationCertificate.split('/').pop()}</Text>}

      <Button title="Upload Groom Marriage License" onPress={() => pickDocument(setGroomMarriageLicense)} />
      {groomMarriageLicense && <Text>Uploaded: {groomMarriageLicense.split('/').pop()}</Text>}

      <Button title="Upload Groom Marriage Bans" onPress={() => pickDocument(setGroomMarriageBans)} />
      {groomMarriageBans && <Text>Uploaded: {groomMarriageBans.split('/').pop()}</Text>}

      <Button title="Upload Groom Original Certificate of No Marriage" onPress={() => pickDocument(setGroomOrigCeNoMar)} />
      {groomOrigCeNoMar && <Text>Uploaded: {groomOrigCeNoMar.split('/').pop()}</Text>}

      <Button title="Upload Groom Original PSA" onPress={() => pickDocument(setGroomOrigPSA)} />
      {groomOrigPSA && <Text>Uploaded: {groomOrigPSA.split('/').pop()}</Text>}

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

export default WeddingForm5;