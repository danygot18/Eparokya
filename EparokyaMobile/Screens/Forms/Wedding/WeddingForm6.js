import React, { useState } from 'react';
import { View, Button, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";

const WeddingForm6 = ({ navigation, route }) => {
  const { updatedWeddingData, certificates, userId } = route.params;

  const [brideNewBaptismalCertificate, setBrideNewBaptismalCertificate] = useState(null);
  const [brideNewConfirmationCertificate, setBrideNewConfirmationCertificate] = useState(null);
  const [brideMarriageLicense, setBrideMarriageLicense] = useState(null);
  const [brideMarriageBans, setBrideMarriageBans] = useState(null);
  const [brideOrigCeNoMar, setBrideOrigCeNoMar] = useState(null);
  const [brideOrigPSA, setBrideOrigPSA] = useState(null);
  const [permitFromtheParishOftheBride, setPermitFromtheParishOftheBride] = useState(null);
  const [childBirthCertificate, setChildBirthCertificate] = useState(null);
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

  const handleSubmit = async () => {
    if (!brideNewBaptismalCertificate || !brideNewConfirmationCertificate || !brideMarriageLicense || !brideMarriageBans || !brideOrigCeNoMar || !brideOrigPSA || !permitFromtheParishOftheBride) {
      setError('Please upload all required certificates.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('weddingData', JSON.stringify(updatedWeddingData));

    formData.append('GroomNewBaptismalCertificate', certificates.GroomNewBaptismalCertificate);
    formData.append('GroomNewConfirmationCertificate', certificates.GroomNewConfirmationCertificate);
    formData.append('GroomMarriageLicense', certificates.GroomMarriageLicense);
    formData.append('GroomMarriageBans', certificates.GroomMarriageBans);
    formData.append('GroomOrigCeNoMar', certificates.GroomOrigCeNoMar);
    formData.append('GroomOrigPSA', certificates.GroomOrigPSA);

    formData.append('BrideNewBaptismalCertificate', {
      uri: brideNewBaptismalCertificate,
      type: 'image/jpeg',
      name: 'brideNewBaptismalCertificate.jpg',
    });
    formData.append('BrideNewConfirmationCertificate', {
      uri: brideNewConfirmationCertificate,
      type: 'image/jpeg',
      name: 'brideNewConfirmationCertificate.jpg',
    });
    formData.append('BrideMarriageLicense', {
      uri: brideMarriageLicense,
      type: 'image/jpeg',
      name: 'brideMarriageLicense.jpg',
    });
    formData.append('BrideMarriageBans', {
      uri: brideMarriageBans,
      type: 'image/jpeg',
      name: 'brideMarriageBans.jpg',
    });
    formData.append('BrideOrigCeNoMar', {
      uri: brideOrigCeNoMar,
      type: 'image/jpeg',
      name: 'brideOrigCeNoMar.jpg',
    });
    formData.append('BrideOrigPSA', {
      uri: brideOrigPSA,
      type: 'image/jpeg',
      name: 'brideOrigPSA.jpg',
    });
    formData.append('PermitFromtheParishOftheBride', {
      uri: permitFromtheParishOftheBride,
      type: 'image/jpeg',
      name: 'permitFromtheParishOftheBride.jpg',
    });
    if (childBirthCertificate) {
      formData.append('ChildBirthCertificate', {
        uri: childBirthCertificate,
        type: 'image/jpeg',
        name: 'childBirthCertificate.jpg',
      });
    }
    
    console.log("Final wedding data before submission:", JSON.stringify(updatedWeddingData, null, 2));

    console.log('Submitting form with data:', {
      userId,
      updatedWeddingData,
      certificates,
      brideNewBaptismalCertificate,
      brideNewConfirmationCertificate,
      brideMarriageLicense,
      brideMarriageBans,
      brideOrigCeNoMar,
      brideOrigPSA,
      permitFromtheParishOftheBride,
      childBirthCertificate,
    });

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      await axios.post(`${baseURL}/submitWeddingForm`, formData, config);
      Alert.alert("Success", "Wedding form submitted successfully!");
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error submitting wedding form:', error.response.data);
      setError(`An error occurred while submitting your wedding details. Please try again. Error: ${error.response.data.message}`);
    }
  };

  const clearForm = () => {
    setBrideNewBaptismalCertificate(null);
    setBrideNewConfirmationCertificate(null);
    setBrideMarriageLicense(null);
    setBrideMarriageBans(null);
    setBrideOrigCeNoMar(null);
    setBrideOrigPSA(null);
    setPermitFromtheParishOftheBride(null);
    setChildBirthCertificate(null);
    setError('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {error && <Text style={styles.error}>{error}</Text>}

      <Button title="Upload Bride New Baptismal Certificate" onPress={() => pickDocument(setBrideNewBaptismalCertificate)} />
      {brideNewBaptismalCertificate && <Text>Uploaded: {brideNewBaptismalCertificate.split('/').pop()}</Text>}

      <Button title="Upload Bride New Confirmation Certificate" onPress={() => pickDocument(setBrideNewConfirmationCertificate)} />
      {brideNewConfirmationCertificate && <Text>Uploaded: {brideNewConfirmationCertificate.split('/').pop()}</Text>}

      <Button title="Upload Bride Marriage License" onPress={() => pickDocument(setBrideMarriageLicense)} />
      {brideMarriageLicense && <Text>Uploaded: {brideMarriageLicense.split('/').pop()}</Text>}

      <Button title="Upload Bride Marriage Bans" onPress={() => pickDocument(setBrideMarriageBans)} />
      {brideMarriageBans && <Text>Uploaded: {brideMarriageBans.split('/').pop()}</Text>}

      <Button title="Upload Bride Original Certificate of No Marriage" onPress={() => pickDocument(setBrideOrigCeNoMar)} />
      {brideOrigCeNoMar && <Text>Uploaded: {brideOrigCeNoMar.split('/').pop()}</Text>}

      <Button title="Upload Bride Original PSA" onPress={() => pickDocument(setBrideOrigPSA)} />
      {brideOrigPSA && <Text>Uploaded: {brideOrigPSA.split('/').pop()}</Text>}

      <Button title="Upload Permit From the Parish Of the Bride" onPress={() => pickDocument(setPermitFromtheParishOftheBride)} />
      {permitFromtheParishOftheBride && <Text>Uploaded: {permitFromtheParishOftheBride.split('/').pop()}</Text>}

      <Button title="Upload Child Birth Certificate (if applicable)" onPress={() => pickDocument(setChildBirthCertificate)} />
      {childBirthCertificate && <Text>Uploaded: {childBirthCertificate.split('/').pop()}</Text>}

      <Button title="Submit" onPress={handleSubmit} />
      <Button title="Clear Form" onPress={clearForm} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default WeddingForm6;