import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { Alert } from "react-native";

const WeddingForm5 = ({ navigation, route }) => {

  const [certificates, setCertificates] = useState({
    GroomNewBaptismalCertificate: null,
    GroomNewConfirmationCertificate: null,
    GroomMarriageLicense: null,
    GroomMarriageBans: null,
    GroomOrigCeNoMar: null,
    GroomOrigPSA: null,
    GroomPermitFromtheParishOftheBride: null,
    GroomChildBirthCertificate: null,
    GroomOneByOne: null,
  });
  const requiredFields = Object.keys(certificates);
  const [error, setError] = useState("");
  const { user, token } = useSelector((state) => state.auth);

  const pickDocument = async (field) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Camera roll permissions are needed to select images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setCertificates((prev) => ({
        ...prev,
        [field]: result.assets[0].uri,
      }));
    }
  };

  const goToNextPage = () => {
    const missingRequired = requiredFields.filter(
      (field) => !certificates[field]
    );
    if (missingRequired.length > 0) {
      setError("Please upload all required certificates.");
      return;
    }

    const formattedCertificates = Object.entries(certificates).reduce(
      (acc, [key, uri]) => {
        acc[key] = uri
          ? {
              uri,
              type: "image/jpeg",
              name: `${key}.jpg`,
            }
          : null;
        return acc;
      },
      {}
    );

    navigation.navigate("WeddingForm6", {
      ...route.params,
      // updatedWeddingData,
      certificates: formattedCertificates,
     
    });
  };
  console.log(route.params)

  const clearForm = () => {
    const cleared = {};
    Object.keys(certificates).forEach((key) => (cleared[key] = null));
    setCertificates(cleared);
    setError("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      {Object.keys(certificates).map((key) => (
        <View key={key} style={styles.uploadContainer}>
          <TouchableOpacity
            onPress={() => pickDocument(key)}
            style={styles.uploadButton}
          >
            <Text style={styles.uploadButtonText}>{`Upload ${key
              .replace(/([A-Z])/g, " $1")
              .trim()}`}</Text>
          </TouchableOpacity>
          {certificates[key] && (
            <Image
              source={{ uri: certificates[key] }}
              style={styles.imagePreview}
            />
          )}
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={clearForm}
          style={[styles.button, styles.clearButton]}
        >
          <Text style={styles.clearButtonText}>Clear Fields</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToNextPage}
          style={[styles.button, styles.nextButton]}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  uploadContainer: {
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  uploadButton: {
    backgroundColor: "#26572E",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  button: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#26572E",
  },
  clearButton: {
    backgroundColor: "#B3CF99",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  clearButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default WeddingForm5;
