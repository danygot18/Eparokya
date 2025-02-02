import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Modal, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Image } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input.js";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from 'react-native-picker-select';

var { height, width } = Dimensions.get("window");

const Register2 = () => {
  const [age, setAge] = useState(null);
  const [phone, setPhone] = useState("");
  const [barangay, setBarangay] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [preference, setPreference] = useState("They/Them");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [ministryCategory, setMinistryCategories] = useState([]);
  const [selectedMinistryCategory, setSelectedMinistryCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const { email, name, password } = route.params;

  const defaultImage = "https://rb.gy/hnb4yc";

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image selected:", result.assets[0].uri);
      setSelectedImage(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  const handleTakePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  const handleRemoveProfile = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  const register = () => {
    if (
      age === null ||
      phone === "" ||
      barangay === "" ||
      zip === "" ||
      city === "" ||
      country === "" ||
      !selectedMinistryCategory 
    ) {
      setError("Please fill in the form correctly");
      return;
    }

    const formData = new FormData();

    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('age', age);
    formData.append('phone', phone);
    formData.append('barangay', barangay);
    formData.append('zip', zip);
    formData.append('city', city);
    formData.append('country', country);
    formData.append('preference', preference);
    formData.append('ministryCategory', selectedMinistryCategory);

    if (selectedImage) {
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
    }

    axios
      .post(`${baseURL}/users/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
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
      })
      .catch((error) => {
        Toast.show({
          position: "bottom",
          bottomOffset: 20,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/ministryCategory/`)
      .then((response) => {
        console.log("Fetched Categories:", response.data);
        setMinistryCategories(response.data || []);
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        setMinistryCategories([]);
      });
  }, []);




  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer style={styles.container}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: selectedImage || defaultImage }}
            style={styles.profileImage}
            alt="Profile Image"
          />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Profile</Text>
              <TouchableOpacity
                onPress={handleImagePick}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleTakePhoto}
                style={styles.modalButton}
              >
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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select Age', value: null }}
            onValueChange={(value) => setAge(value)}
            items={Array.from({ length: 100 }, (_, i) => ({
              label: `${i + 1}`,
              value: i + 1
            }))}
            style={pickerSelectStyles}
            value={age}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Preference</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select Preference', value: null }}
            onValueChange={(value) => setPreference(value)}
            items={[
              { label: 'He', value: 'He' },
              { label: 'She', value: 'She' },
              { label: 'They/Them', value: 'They/Them' }
            ]}
            style={pickerSelectStyles}
            value={preference}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ministry</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedMinistryCategory(value)} 
            items={(ministryCategory || []).map((category) => ({
              label: category.name,
              value: category._id,
            }))}
            placeholder={{ label: "Select Ministry Category if Part of the Ministry", value: null }}
            style={pickerSelectStyles}
          />
        </View>

        <Input
          placeholder={"Phone Number"}
          name={"phone"}
          id={"phone"}
          keyboardType={"numeric"}
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder={"Barangay"}
          name={"barangay"}
          id={"barangay"}
          onChangeText={(text) => setBarangay(text)}
        />
        <Input
          placeholder={"Zip Code"}
          name={"zip"}
          id={"zip"}
          keyboardType={"numeric"}
          onChangeText={(text) => setZip(text)}
        />
        <Input
          placeholder={"City"}
          name={"city"}
          id={"city"}
          onChangeText={(text) => setCity(text)}
        />
        <Input
          placeholder={"Country"}
          name={"country"}
          id={"country"}
          onChangeText={(text) => setCountry(text)}
        />

        <View style={styles.buttonGroup}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <Button
          variant={"ghost"}
          onPress={register}
          style={styles.registerButton}
        >
          <Text style={styles.buttonText}>Register</Text>
        </Button>
      </FormContainer>
    </KeyboardAwareScrollView>
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
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 20,
    width: "80%",
  },
  buttonGroup: {
    width: "100%",
    margin: 10,
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: '#1C5739',
    width: "80%",
    borderRadius: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
  },
  errorText: {
    color: "red",
    textAlign: "center",
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
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    width: "100%",
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    width: "100%",
  },
});

export default Register2;