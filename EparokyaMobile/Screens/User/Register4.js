import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

var { height, width } = Dimensions.get("window");

const Register4 = () => {
  const route = useRoute();
  const {
    email,
    name,
    password,
    birthday,
    preference,
    civilStatus,
    phone,
    ministryRoles,
    address,
  } = route.params;
  const navigation = useNavigation();

  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
  const [modalVisible, setModalVisible] = useState(false); // State for the image selection modal
  const [error, setError] = useState("");

  const defaultImage = require("../../assets/EPAROKYA-SYST.png"); // Default image

  // Function to pick an image from the gallery
  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
    setModalVisible(false);
  };

  // Function to take a photo using the camera
  const handleTakePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
    setModalVisible(false);
  };

  // Function to remove the selected profile picture
  const handleRemoveProfile = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  // Function to handle registration
  const register = async () => {
    if (!selectedImage) {
      setError("Please select a profile image.");
      return;
    }

    // Create a FormData object
    const formData = new FormData();

    // Append user details
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("birthDate", birthday); // Ensure the field name matches the backend
    formData.append("preference", preference);
    formData.append("civilStatus", civilStatus);
    formData.append("phone", phone);
    formData.append("ministryRoles", JSON.stringify(ministryRoles));
    formData.append("address", JSON.stringify(address));

    // Append the selected image file
    const file = {
      uri: selectedImage.uri,
      name: "profile.jpg", // Ensure the file has a valid name
      type: "image/jpeg", // Ensure the file has a valid MIME type
    };
    formData.append("avatar", file);

    // Debugging: Log the FormData contents
    console.log("FormData Contents:");
    console.log("name:", name);
    console.log("email:", email);
    console.log("password:", password);
    console.log("birthDate:", birthday);
    console.log("preference:", preference);
    console.log("civilStatus:", civilStatus);
    console.log("phone:", phone);
    console.log("ministryRoles:", JSON.stringify(ministryRoles));
    console.log("address:", JSON.stringify(address));
    console.log("avatar:", file);

    // Send the request
    try {
      const response = await axios.post(`${baseURL}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type
        },
      });

      if (response.status === 200) {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Registration Succeeded",
          text2: "Please Log in to your account",
        });
        setTimeout(() => {
          navigation.navigate("Login");
        }, 500);
      }
    } catch (error) {
      Toast.show({
        position: "bottom",
        bottomOffset: 20,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
      console.error("Error:", error);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <FormContainer>
          <Text style={styles.label}>Profile Image</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={selectedImage ? { uri: selectedImage.uri } : defaultImage}
              style={styles.profileImage}
              alt="Profile Image"
            />
          </TouchableOpacity>

          {/* Image Selection Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Profile</Text>
                <TouchableOpacity onPress={handleImagePick} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTakePhoto} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Take a Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleRemoveProfile}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Remove Profile Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Register Button */}
          <Button onPress={register} style={styles.registerButton}>
            <Text style={styles.buttonText}>Register</Text>
          </Button>
        </FormContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    marginVertical: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: "#1C5739",
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  registerButton: {
    backgroundColor: "#1C5739",
    width: "80%",
    borderRadius: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
  },
});

export default Register4;