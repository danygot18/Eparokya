import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";

const WeddingForm6 = ({ navigation, route }) => {
  const { updatedWeddingData, certificates } = route.params;
  const { user, token } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  console.log("Updated Wedding Data:", updatedWeddingData);
  const [docs, setDocs] = useState({
    brideNewBaptismalCertificate: null,
    brideNewConfirmationCertificate: null,
    brideMarriageLicense: null,
    brideMarriageBans: null,
    brideOrigCeNoMar: null,
    brideOrigPSA: null,
    permitFromtheParishOftheBride: null,
    childBirthCertificate: null,
    oneByOne: null,
  });

  const [error, setError] = useState("");

  const requiredBride = [
    "brideNewBaptismalCertificate",
    "brideNewConfirmationCertificate",
    "brideMarriageLicense",
    "brideMarriageBans",
    "brideOrigCeNoMar",
    "brideOrigPSA",
    "permitFromtheParishOftheBride",
    "oneByOne",
  ];

  const handleImagePick = async (field) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera roll permissions are needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setDocs((prev) => ({ ...prev, [field]: result.assets[0].uri }));
    }
  };

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError("");

    try {
      // Validate required documents
      const missingDocs = requiredBride.filter((field) => !docs[field]);
      if (missingDocs.length > 0) {
        const missingNames = missingDocs
          .map((field) => field.replace(/([A-Z])/g, " $1").trim())
          .join(", ");
        throw new Error(
          `Please upload these required documents: ${missingNames}`
        );
      }

      // Prepare FormData
      const formData = new FormData();

      // Add wedding data (stringify nested objects)
      Object.entries(updatedWeddingData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        formData.append(
          key,
          typeof value === "object" && !(value instanceof File)
            ? JSON.stringify(value)
            : value
        );
      });

      // Add all certificate files
      Object.entries(certificates).forEach(([key, uri]) => {
        if (uri) {
          formData.append(key, {
            uri,
            type: "image/jpeg",
            name: `${key}.jpg`,
          });
        }
      });

      // Add all bride document files
      Object.entries(docs).forEach(([key, uri]) => {
        if (uri) {
          formData.append(key, {
            uri,
            type: "image/jpeg",
            name: `${key}.jpg`,
          });
        }
      });

      // Add user context
      formData.append("submittedBy", user._id);
      formData.append("submissionDate", new Date().toISOString());

      // Submit to server
      const response = await axios.post(`${baseURL}/weddings`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        timeout: 30000, // 30 seconds timeout
      });

      // Handle success
      if (response.data.success) {
        Alert.alert(
          "Submission Successful",
          "Your wedding application has been submitted successfully.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("Profile", {
                  refresh: true,
                }),
            },
          ]
        );
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);

      // Handle specific error cases
      let errorMessage = "Submission failed. Please try again.";
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timeout. Please try again.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      setError(errorMessage);
      Alert.alert("Submission Error", errorMessage);
    } finally {
      // Reset submission state
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const clearAll = () => {
    setDocs((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, null]))
    );
    setError("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {Object.entries(docs).map(([field, uri]) => (
        <View key={field} style={styles.uploadContainer}>
          <TouchableOpacity
            onPress={() => handleImagePick(field)}
            style={styles.uploadButton}
          >
            <Text style={styles.uploadButtonText}>
              Upload {field.replace(/([A-Z])/g, " $1").trim()}
              {requiredBride.includes(field) ? " *" : ""}
            </Text>
          </TouchableOpacity>
          {uri && (
            <Image
              source={{ uri }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
          )}
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearAll}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
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

export default WeddingForm6;