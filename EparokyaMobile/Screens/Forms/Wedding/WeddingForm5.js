import React, { useState } from 'react';
import { View, Button, StyleSheet, Text, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';

const WeddingForm5 = ({ navigation, route }) => {
  const { updatedWeddingData, userId } = route.params;

  const [certificates, setCertificates] = useState({
    GroomNewBaptismalCertificate: null,
    GroomNewConfirmationCertificate: null,
    GroomMarriageLicense: null,
    GroomMarriageBans: null,
    GroomOrigCeNoMar: null,
    GroomOrigPSA: null,
  });
  const [error, setError] = useState('');
  const { user, token } = useSelector(state => state.auth);

  const pickDocument = async (field) => {
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
      setCertificates(prev => ({
        ...prev,
        [field]: result.assets[0].uri,
      }));
    }
  };

  const goToNextPage = () => {
    if (Object.values(certificates).some(value => !value)) {
      setError('Please upload all required certificates.');
      return;
    }

    const formattedCertificates = Object.entries(certificates).reduce((acc, [key, uri]) => {
      acc[key] = {
        uri,
        type: 'image/jpeg',
        name: `${key}.jpg`,
      };
      return acc;
    }, {});

    console.log('Navigating to WeddingForm6 with data:', {
      updatedWeddingData,
      formattedCertificates,
      userId,
    });

    navigation.navigate('WeddingForm6', {
      updatedWeddingData,
      certificates: formattedCertificates,
      userId,
    });
  };

  const clearForm = () => {
    setCertificates({
      GroomNewBaptismalCertificate: null,
      GroomNewConfirmationCertificate: null,
      GroomMarriageLicense: null,
      GroomMarriageBans: null,
      GroomOrigCeNoMar: null,
      GroomOrigPSA: null,
    });
    setError('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {error && <Text style={styles.error}>{error}</Text>}

      {Object.keys(certificates).map((key) => (
        <View key={key} style={styles.uploadContainer}>
          <Button title={`Upload ${key.replace(/([A-Z])/g, ' $1').trim()}`} onPress={() => pickDocument(key)} />
          {certificates[key] && <Image source={{ uri: certificates[key] }} style={styles.imagePreview} />}
        </View>
      ))}

      <Button title="Next" onPress={goToNextPage} />
      <Button title="Clear Form" onPress={clearForm} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  uploadContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default WeddingForm5;