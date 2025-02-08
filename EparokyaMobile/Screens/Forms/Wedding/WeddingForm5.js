import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";

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
  const [error, setError] = useState("");
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
      setError("Please upload all required certificates.");
      return;
    }

    const formattedCertificates = Object.entries(certificates).reduce((acc, [key, uri]) => {
      acc[key] = {
        uri,
        type: "image/jpeg",
        name: `${key}.jpg`,
      };
      return acc;
    }, {});

    navigation.navigate("WeddingForm6", {
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
    setError("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      {Object.keys(certificates).map((key) => (
        <View key={key} style={styles.uploadContainer}>
          <TouchableOpacity onPress={() => pickDocument(key)} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>{`Upload ${key.replace(/([A-Z])/g, ' $1').trim()}`}</Text>
          </TouchableOpacity>
          {certificates[key] && <Image source={{ uri: certificates[key] }} style={styles.imagePreview} />}
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={goToNextPage} style={[styles.button, styles.nextButton]}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearForm} style={[styles.button, styles.clearButton]}>
          <Text style={styles.clearButtonText}>Clear Fields</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  uploadContainer: { marginBottom: 20, alignItems: "center" },
  error: { color: "red", marginBottom: 10 },
  uploadButton: { backgroundColor: "#26572E", padding: 10, borderRadius: 5, alignItems: "center" },
  uploadButtonText: { color: "white", fontWeight: "bold" },
  imagePreview: { width: 200, height: 200, marginTop: 10, borderRadius: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "center", width: "100%" },
  button: { borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, marginHorizontal: 5, alignItems: "center" },
  nextButton: { backgroundColor: "#26572E" },
  clearButton: { backgroundColor: "#B3CF99" },
  buttonText: { color: "white", fontWeight: "bold" },
  clearButtonText: { color: "black", fontWeight: "bold" },
});

export default WeddingForm5;
