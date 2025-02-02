import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import SyncStorage from "sync-storage";
import baseURL from "../../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RNPickerSelect from "react-native-picker-select";

import { setAuth } from "../../State/authSlice";
import { useDispatch, useSelector } from "react-redux";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [preference, setPreference] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const navigation = useNavigation();

  const { user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const getProfile = async () => {
    setLoading(true);
    try {
      
      if (!token) {
        Alert.alert("Authentication Error", "Please log in again.");
        navigation.navigate("Login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Add "Bearer " prefix
        },
      };

      const { data } = await axios.get(`${baseURL}/profile`, config);
      console.log("User data:", data);

      setName(data.user.name);
      setEmail(data.user.email);
      setPhone(data.user.phone);
      setAge(data.user.age);
      setPreference(data.user.preference);
      setBarangay(data.user.barangay);
      setCity(data.user.city);
      setZip(data.user.zip);
      setCountry(data.user.country);
      setAvatarPreview(data.user.image);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        Alert.alert("Session Expired", "Please log in again.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", "Failed to fetch user profile.");
      }
      setLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    setLoading(true);
    try {
      
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Ensure Bearer prefix
        },
      };

      const response = await axios.put(`${baseURL}/users/profile/update`, formData, config);
      console.log("Profile update response:", response.data);
      setIsUpdated(true);
      Alert.alert("Success", "Profile updated successfully!");
      navigation.navigate("UserProfile");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      Alert.alert("Validation Error", "Name and Email are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("age", age);
    formData.append("preference", preference);
    formData.append("barangay", barangay);
    formData.append("city", city);
    formData.append("zip", zip);
    formData.append("country", country);

    if (avatar) {
      formData.append("image", {
        uri: avatar,
        name: `profile_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
    }

    await updateProfile(formData);
  };

  const handleChooseAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera roll permissions are required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.uri);
      setAvatarPreview(result.uri);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Update Profile</Text>
        <Image source={{ uri: avatarPreview || "default-avatar-placeholder" }} style={styles.avatar} />
        <TouchableOpacity onPress={handleChooseAvatar}>
          <Text>Choose Avatar</Text>
        </TouchableOpacity>

        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} />
        <TextInput style={styles.input} placeholder="Age" value={age?.toString()} editable={false} />

        <TextInput style={styles.input} placeholder="Barangay" value={barangay} onChangeText={setBarangay} />
        <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
        <TextInput style={styles.input} placeholder="Zip Code" value={zip} onChangeText={setZip} />
        <TextInput style={styles.input} placeholder="Country" value={country} onChangeText={setCountry} />

        <TouchableOpacity onPress={handleUpdateProfile} style={styles.updateButton}>
          <MaterialIcons name="done-all" size={40} color="white" />
        </TouchableOpacity>

        {isUpdated && <Text>Profile updated successfully!</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { alignItems: "center", paddingVertical: 20 },
  heading: { fontSize: 24, fontWeight: "bold" },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  input: { width: "80%", borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 20 },
  updateButton: { backgroundColor: "black", padding: 10, borderRadius: 5 },
});

export default UpdateProfile;
