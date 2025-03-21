import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
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
import RNPickerSelect from "react-native-picker-select";
import { barangays } from "../../assets/common/barangays.js";
import CheckBox from "@react-native-community/checkbox";
import { Picker } from "@react-native-picker/picker";

var { height, width } = Dimensions.get("window");

const Register2 = () => {
  const route = useRoute();
  const { email, name, password } = route.params;
  console.log("Email:", email, "Name:", name, "Password:", password);

  const [user, setUser] = useState({
    name: name,
    email: email,
    password: password,
    age: "",
    preference: "They/Them",
    civilStatus: "",
    phone: "",
    address: {
      BldgNameTower: "",
      LotBlockPhaseHouseNo: "",
      SubdivisionVillageZone: "",
      Street: "",
      District: "",
      barangay: "",
      city: "",
      customCity: "",
    },
    ministryRoles: [],
  });

  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [ministryCategories, setMinistryCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ministryModalVisible, setMinistryModalVisible] = useState(false);
  const navigation = useNavigation();




  const defaultImage = require("../../assets/EPAROKYA-SYST.png");

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

  useEffect(() => {
    axios
      .get(`${baseURL}/ministryCategory/getAllMinistryCategories`)
      .then((response) => {
        console.log("Fetched Categories:", response.data);
        setMinistryCategories(response.data.categories || []);
      })
      .catch((error) => {
        console.error("Fetch Error:", error.response ? error.response.data : error.message);
        setMinistryCategories([]);
      });
  }, []);

  const handleMinistryCategoryChange = (categoryId) => {
    setUser((prevUser) => {
      const updatedRoles = prevUser.ministryRoles.includes(categoryId)
        ? prevUser.ministryRoles.filter((id) => id !== categoryId) // Deselect if already selected
        : [...prevUser.ministryRoles, categoryId]; // Add if not selected
      return { ...prevUser, ministryRoles: updatedRoles };
    });
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
      !user.age ||
      !user.phone ||
      !user.address.barangay ||
      !user.address.BldgNameTower ||
      !user.address.LotBlockPhaseHouseNo ||
      !user.address.SubdivisionVillageZone ||
      !user.address.Street ||
      !user.address.District ||
      !user.address.country ||
      !user.civilStatus ||
      user.ministryRoles.length === 0
    ) {
      setError("Please fill in the form correctly");
      return;
    }

    const formData = new FormData();

    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("age", user.age);
    formData.append("phone", user.phone);
    formData.append("preference", user.preference);
    formData.append("civilStatus", user.civilStatus);

    // Append address as a JSON string
    const address = {
      BldgNameTower: user.address.BldgNameTower,
      LotBlockPhaseHouseNo: user.address.LotBlockPhaseHouseNo,
      SubdivisionVillageZone: user.address.SubdivisionVillageZone,
      Street: user.address.Street,
      District: user.address.District,
      barangay: user.address.barangay,
      city: user.address.city,
      country: user.address.country,
    };
    formData.append("address", JSON.stringify(address));

    // Append ministryRoles as a JSON string
    const ministryRoles = user.ministryRoles.map((categoryId) => ({
      ministry: categoryId,
      role: "Member", // Default role, update as needed
      startYear: new Date().getFullYear(), // Default start year, update as needed
      endYear: new Date().getFullYear() + 1, // Default end year, update as needed
    }));
    formData.append("ministryRoles", JSON.stringify(ministryRoles));

    if (selectedImage) {
      formData.append("avatar", {
        uri: selectedImage,
        type: "image/jpeg",
        name: "image.jpg",
      });
    }
    console.log("formData:", formData);
    axios
      .post(`${baseURL}/register`, formData, {
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

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
      paddingTop={20}
    >
      <FormContainer style={styles.container}>
        <Text padding={10} fontSize={5}>
          Select Image
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={selectedImage ? { uri: selectedImage } : defaultImage}
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
              <TouchableOpacity onPress={handleImagePick} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleTakePhoto} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Take a Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRemoveProfile} style={styles.modalButton}>
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
            placeholder={{ label: "Select Age", value: null }}
            onValueChange={(value) => setUser({ ...user, age: value })}
            items={Array.from({ length: 100 }, (_, i) => ({
              label: `${i + 1}`,
              value: i + 1,
            }))}
            style={pickerSelectStyles}
            value={user.age}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Preference</Text>
          <RNPickerSelect
            placeholder={{ label: "Select Preference", value: null }}
            onValueChange={(value) => setUser({ ...user, preference: value })}
            items={[
              { label: "He", value: "He" },
              { label: "She", value: "She" },
              { label: "They/Them", value: "They/Them" },
            ]}
            style={pickerSelectStyles}
            value={user.preference}
          />
        </View>



        <Input
          placeholder={"Phone Number"}
          name={"phone"}
          id={"phone"}
          keyboardType={"numeric"}
          onChangeText={(text) => setUser({ ...user, phone: text })}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Civil Status</Text>
          <RNPickerSelect
            placeholder={{ label: "Select Civil Status ", value: null }}
            onValueChange={(value) => setUser({ ...user, civilStatus: value })}
            items={[
              { label: "Single", value: "Single" },
              { label: "Married", value: "Married" },
              { label: "Widowed", value: "Widowed" },
              { label: "Separated", value: "Separated" },
            ]}
            style={pickerSelectStyles}
            value={user.civilStatus}
          />
        </View>

        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
          Ministry Categories
        </Text>

        {/* Touchable Dropdown */}
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 5,
          }}
          onPress={() => setMinistryModalVisible(true)}
        >
          <Text>
            {user.ministryRoles.length > 0
              ? ministryCategories
                .filter((cat) => user.ministryRoles.includes(cat._id))
                .map((cat) => cat.name)
                .join(", ")
              : "Select Ministries"}
          </Text>
        </TouchableOpacity>
        <Modal visible={ministryModalVisible} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                width: "80%",
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                Select Ministries (Max 3)
              </Text>
              <FlatList
                data={ministryCategories}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                    <CheckBox
                      value={user.ministryRoles.includes(item._id)}
                      onValueChange={() => handleMinistryCategoryChange(item._id)}
                    />
                    <Text>{item.name}</Text>
                  </View>
                )}
              />
              <TouchableOpacity
                onPress={() => setMinistryModalVisible(false)}
                style={{
                  backgroundColor: "#007BFF",
                  padding: 10,
                  borderRadius: 5,
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.label} marginTop={20}>Address</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Barangay</Text>
          <RNPickerSelect
            placeholder={{ label: "Select Barangay", value: null }}
            onValueChange={(value) => setUser({ ...user, address: { ...user.address, barangay: value } })}
            items={barangays.map((barangay) => ({ label: barangay, value: barangay }))}
            style={pickerSelectStyles}
            value={user.address.barangay}
          />
        </View>
        <Input
          placeholder={"Building Name/Tower"}
          name={"BldgNameTower"}
          id={"BldgNameTower"}
          onChangeText={(text) => setUser({ ...user, address: { ...user.address, BldgNameTower: text } })}
        />
        <Input
          placeholder={"Lot/Block/Phase/House No."}
          name={"LotBlockPhaseHouseNo"}
          id={"LotBlockPhaseHouseNo"}
          onChangeText={(text) => setUser({ ...user, address: { ...user.address, LotBlockPhaseHouseNo: text } })}
        />
        <Input
          placeholder={"Subdivision/Village/Zone"}
          name={"SubdivisionVillageZone"}
          id={"SubdivisionVillageZone"}
          onChangeText={(text) => setUser({ ...user, address: { ...user.address, SubdivisionVillageZone: text } })}
        />
        <Input
          placeholder={"Street"}
          name={"Street"}
          id={"Street"}
          onChangeText={(text) => setUser({ ...user, address: { ...user.address, Street: text } })}
        />
        <Input
          placeholder={"District"}
          name={"District"}
          id={"District"}
          onChangeText={(text) => setUser({ ...user, address: { ...user.address, District: text } })}
        />


        <Input
          placeholder={"City"}
          name={"city"}
          id={"city"}
          onChangeText={(text) => setUser({ ...user, address: { ...user.address, city: text } })}
        />
        {/* <View style={styles.inputContainer}>
          <Text style={styles.label}>City</Text>
          <RNPickerSelect
            placeholder={{ label: "Select City ", value: null }}
            onValueChange={(value) => setUser({ ...user.address, city: value })}
            items={[
              { label: "Taguig City", value: "Taguig City" },
              { label: "Others", value: "Others" },

            ]}
            style={pickerSelectStyles}
            value={user.city}
          />
        </View> */}

        <Input
          placeholder={"Country"}
          name={"country"}
          id={"country"}
          onChangeText={(text) => setUser({ ...user, address: { ...user.address, country: text } })}
        />

        <View style={styles.buttonGroup}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <Button variant={"ghost"} onPress={register} style={styles.registerButton}>
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
    backgroundColor: "#1C5739",
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    width: "100%",
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    width: "100%",
  },
});

export default Register2;