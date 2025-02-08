import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";

const WeddingForm6 = ({ navigation, route }) => {
  const { updatedWeddingData, certificates, userId, dateOfApplication, weddingDate, weddingTime, groomName, groomAddress, groomPhone, groomBirthDate, groomOccupation, groomReligion, groomFather, groomMother, brideName, brideAddress, bridePhone, brideBirthDate, brideOccupation, brideReligion, brideFather, brideMother, Ninong, Ninang } = route.params;

  useEffect(() => {
    console.log('Route params:', route.params);
  }, [route.params]);

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

    formData.append("userId", userId || "");
    formData.append("dateOfApplication", new Date(updatedWeddingData.dateOfApplication).toISOString());
    formData.append("weddingDate", new Date(updatedWeddingData.weddingDate).toISOString());
    formData.append("weddingTime", updatedWeddingData.weddingTime || "");
    formData.append("groomName", updatedWeddingData.groomName || "");
    formData.append("groomAddress", JSON.stringify({
      street: updatedWeddingData.groomAddress?.street || "",
      zip: updatedWeddingData.groomAddress?.zip || "",
      city: updatedWeddingData.groomAddress?.city || "",
    }));
    formData.append("groomPhone", updatedWeddingData.groomPhone || "");
    formData.append("groomBirthDate", new Date(updatedWeddingData.groomBirthDate).toISOString());
    formData.append("groomOccupation", updatedWeddingData.groomOccupation || "");
    formData.append("groomReligion", updatedWeddingData.groomReligion || "");
    formData.append("groomFather", updatedWeddingData.groomFather || "");
    formData.append("groomMother", updatedWeddingData.groomMother || "");
    formData.append("brideName", updatedWeddingData.brideName || "");
    formData.append("brideAddress", JSON.stringify({
      street: updatedWeddingData.brideAddress?.street || "",
      zip: updatedWeddingData.brideAddress?.zip || "",
      city: updatedWeddingData.brideAddress?.city || "",
    }));
    formData.append("bridePhone", updatedWeddingData.bridePhone || "");
    formData.append("brideBirthDate", new Date(updatedWeddingData.brideBirthDate).toISOString());
    formData.append("brideOccupation", updatedWeddingData.brideOccupation || "");
    formData.append("brideReligion", updatedWeddingData.brideReligion || "");
    formData.append("brideFather", updatedWeddingData.brideFather || "");
    formData.append("brideMother", updatedWeddingData.brideMother || "");
    formData.append("Ninong", JSON.stringify(updatedWeddingData.Ninong || []));
    formData.append("Ninang", JSON.stringify(updatedWeddingData.Ninang || []));



    formData.append('GroomNewBaptismalCertificate', {
      uri: certificates.GroomNewBaptismalCertificate.uri,
      type: certificates.GroomNewBaptismalCertificate.type,
      name: certificates.GroomNewBaptismalCertificate.name,
    });
    formData.append('GroomNewConfirmationCertificate', {
      uri: certificates.GroomNewConfirmationCertificate.uri,
      type: certificates.GroomNewConfirmationCertificate.type,
      name: certificates.GroomNewConfirmationCertificate.name,
    });
    formData.append('GroomMarriageLicense', {
      uri: certificates.GroomMarriageLicense.uri,
      type: certificates.GroomMarriageLicense.type,
      name: certificates.GroomMarriageLicense.name,
    });
    formData.append('GroomMarriageBans', {
      uri: certificates.GroomMarriageBans.uri,
      type: certificates.GroomMarriageBans.type,
      name: certificates.GroomMarriageBans.name,
    });
    formData.append('GroomOrigCeNoMar', {
      uri: certificates.GroomOrigCeNoMar.uri,
      type: certificates.GroomOrigCeNoMar.type,
      name: certificates.GroomOrigCeNoMar.name,
    });
    formData.append('GroomOrigPSA', {
      uri: certificates.GroomOrigPSA.uri,
      type: certificates.GroomOrigPSA.type,
      name: certificates.GroomOrigPSA.name,
    });

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
      console.error('Error submitting wedding form:', error);

      if (error.response) {
        console.error('Response Data:', error.response.data);
        setError(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response from server. Please check your internet connection or server status.');
      } else {
        console.error('Error setting up request:', error.message);
        setError(`Request setup error: ${error.message}`);
      }
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
      {brideNewBaptismalCertificate && <Text>Uploaded: {brideNewBaptismalCertificate ? brideNewBaptismalCertificate.split('/').pop() : ''}</Text>}

      <Button title="Upload Bride New Confirmation Certificate" onPress={() => pickDocument(setBrideNewConfirmationCertificate)} />
      {brideNewConfirmationCertificate && <Text>Uploaded: {brideNewConfirmationCertificate ? brideNewConfirmationCertificate.split('/').pop() : ''}</Text>}

      <Button title="Upload Bride Marriage License" onPress={() => pickDocument(setBrideMarriageLicense)} />
      {brideMarriageLicense && <Text>Uploaded: {brideMarriageLicense ? brideMarriageLicense.split('/').pop() : ''}</Text>}

      <Button title="Upload Bride Marriage Bans" onPress={() => pickDocument(setBrideMarriageBans)} />
      {brideMarriageBans && <Text>Uploaded: {brideMarriageBans ? brideMarriageBans.split('/').pop() : ''}</Text>}

      <Button title="Upload Bride Original Certificate of No Marriage" onPress={() => pickDocument(setBrideOrigCeNoMar)} />
      {brideOrigCeNoMar && <Text>Uploaded: {brideOrigCeNoMar ? brideOrigCeNoMar.split('/').pop() : ''}</Text>}

      <Button title="Upload Bride Original PSA" onPress={() => pickDocument(setBrideOrigPSA)} />
      {brideOrigPSA && <Text>Uploaded: {brideOrigPSA ? brideOrigPSA.split('/').pop() : ''}</Text>}

      <Button title="Upload Permit From the Parish Of the Bride" onPress={() => pickDocument(setPermitFromtheParishOftheBride)} />
      {permitFromtheParishOftheBride && <Text>Uploaded: {permitFromtheParishOftheBride ? permitFromtheParishOftheBride.split('/').pop() : ''}</Text>}

      <Button title="Upload Child Birth Certificate (if applicable)" onPress={() => pickDocument(setChildBirthCertificate)} />
      {childBirthCertificate && <Text>Uploaded: {childBirthCertificate ? childBirthCertificate.split('/').pop() : ''}</Text>}

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