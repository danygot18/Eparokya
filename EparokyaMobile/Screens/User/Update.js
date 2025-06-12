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
import baseURL from "../../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { setAuth } from "../../State/authSlice";
import { useDispatch, useSelector } from "react-redux";

const civilStatusOptions = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
  "Separated",
  "In Civil Partnership",
  "Former Civil Partner",
];
const preferenceOptions = ["He", "She", "They/Them"];
const barangayOptions = [
  "Bagumbayan",
  "Bambang",
  "Calzada",
  "Cembo",
  "Central Bicutan",
  "Central Signal Village",
  "Comembo",
  "East Rembo",
  "Fort Bonifacio",
  "Hagonoy",
  "Ibayo-Tipas",
  "Katuparan",
  "Ligid-Tipas",
  "Lower Bicutan",
  "Maharlika Village",
  "Napindan",
  "New Lower Bicutan",
  "North Daang Hari",
  "North Signal Village",
  "Palingon",
  "Pembo",
  "Pinagsama",
  "Pitogo",
  "Post Proper Northside",
  "Post Proper Southside",
  "Rizal",
  "San Miguel",
  "Santa Ana",
  "South Cembo",
  "South Daang Hari",
  "South Signal Village",
  "Tanyag",
  "Tuktukan",
  "Upper Bicutan",
  "Ususan",
  "Wawa",
  "West Rembo",
  "Western Bicutan",
  "Others",
];
const cityOptions = ["Taguig City", "Others"];
const roleOptions = [
  "Coordinator",
  "Assistant Coordinator",
  "Office Worker",
  "Member",
  "Others",
];

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showBirthDate, setShowBirthDate] = useState(false);
  const [preference, setPreference] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [address, setAddress] = useState({
    BldgNameTower: "",
    LotBlockPhaseHouseNo: "",
    SubdivisionVillageZone: "",
    Street: "",
    District: "",
    barangay: "",
    customBarangay: "",
    city: "",
    customCity: "",
  });
  const [ministryRoles, setMinistryRoles] = useState([
    {
      ministry: "",
      role: "",
      customRole: "",
      startYear: "",
      endYear: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const navigation = useNavigation();
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [ministryCategory, setMinistryCategory] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseURL}/getAllMinistryCategory`)
      .then((res) => setMinistryCategory(res.data.categories || []))
      .catch(() => setMinistryCategory([]));
  }, []);

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
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${baseURL}/profile`, config);
      setName(data.user.name);
      setEmail(data.user.email);
      setPhone(data.user.phone || "");
      setBirthDate(
        data.user.birthDate ? new Date(data.user.birthDate) : new Date()
      );
      setPreference(data.user.preference || "");
      setCivilStatus(data.user.civilStatus || "");
      setAvatarPreview(data.user.avatar?.url);
      setAddress({
        BldgNameTower: data.user.address?.BldgNameTower || "",
        LotBlockPhaseHouseNo: data.user.address?.LotBlockPhaseHouseNo || "",
        SubdivisionVillageZone: data.user.address?.SubdivisionVillageZone || "",
        Street: data.user.address?.Street || "",
        District: data.user.address?.District || "",
        barangay: data.user.address?.barangay || "",
        customBarangay: data.user.address?.customBarangay || "",
        city: data.user.address?.city || "",
        customCity: data.user.address?.customCity || "",
      });
      setMinistryRoles(
        data.user.ministryRoles?.length
          ? data.user.ministryRoles.map((role) => ({
              ministry: role.ministry?._id || "",
              role: role.role || "",
              customRole: role.customRole || "",
              startYear: role.startYear ? String(role.startYear) : "",
              endYear: role.endYear ? String(role.endYear) : "",
            }))
          : [
              {
                ministry: "",
                role: "",
                customRole: "",
                startYear: "",
                endYear: "",
              },
            ]
      );
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user profile.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

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

  const handleMinistryRoleChange = (idx, field, value) => {
    setMinistryRoles((prev) =>
      prev.map((role, i) => (i === idx ? { ...role, [field]: value } : role))
    );
  };

  const addMinistryRole = () => {
    setMinistryRoles((prev) => [
      ...prev,
      { ministry: "", role: "", customRole: "", startYear: "", endYear: "" },
    ]);
  };

  const removeMinistryRole = (idx) => {
    setMinistryRoles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateProfile = async () => {
    if (!name || !email) {
      Alert.alert("Validation Error", "Name and Email are required.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("birthDate", birthDate.toISOString());
    formData.append("preference", preference);
    formData.append("civilStatus", civilStatus);

    // Address fields
    Object.entries(address).forEach(([key, value]) => {
      formData.append(`address[${key}]`, value);
    });

    // Ministry roles
    ministryRoles.forEach((role, idx) => {
      formData.append(`ministryRoles[${idx}][ministry]`, role.ministry);
      formData.append(`ministryRoles[${idx}][role]`, role.role);
      formData.append(`ministryRoles[${idx}][customRole]`, role.customRole);
      formData.append(`ministryRoles[${idx}][startYear]`, role.startYear);
      formData.append(`ministryRoles[${idx}][endYear]`, role.endYear);
    });

    if (avatar) {
      formData.append("avatar", {
        uri: avatar,
        name: `profile_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`${baseURL}/users/profile/update`, formData, config);
      setIsUpdated(true);
      Alert.alert("Success", "Profile updated successfully!");
      navigation.navigate("UserProfile");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Update Profile</Text>
        <Image
          source={{ uri: avatarPreview || "https://rb.gy/hnb4yc" }}
          style={styles.avatar}
        />
        <TouchableOpacity onPress={handleChooseAvatar}>
          <Text>Choose Avatar</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity onPress={() => setShowBirthDate(true)}>
          <TextInput
            style={styles.input}
            placeholder="Birth Date"
            value={birthDate ? birthDate.toISOString().slice(0, 10) : ""}
            editable={false}
          />
        </TouchableOpacity>
        {showBirthDate && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setShowBirthDate(false);
              if (date) setBirthDate(date);
            }}
          />
        )}

        <Text style={styles.label}>Preference</Text>
        <RNPickerSelect
          onValueChange={setPreference}
          value={preference}
          items={preferenceOptions.map((p) => ({ label: p, value: p }))}
        />

        <Text style={styles.label}>Civil Status</Text>
        <RNPickerSelect
          onValueChange={setCivilStatus}
          value={civilStatus}
          items={civilStatusOptions.map((c) => ({ label: c, value: c }))}
        />

        <Text style={styles.heading2}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Bldg Name/Tower"
          value={address.BldgNameTower}
          onChangeText={(v) => setAddress((a) => ({ ...a, BldgNameTower: v }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Lot/Block/Phase/House No"
          value={address.LotBlockPhaseHouseNo}
          onChangeText={(v) =>
            setAddress((a) => ({ ...a, LotBlockPhaseHouseNo: v }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Subdivision/Village/Zone"
          value={address.SubdivisionVillageZone}
          onChangeText={(v) =>
            setAddress((a) => ({ ...a, SubdivisionVillageZone: v }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Street"
          value={address.Street}
          onChangeText={(v) => setAddress((a) => ({ ...a, Street: v }))}
        />
        <TextInput
          style={styles.input}
          placeholder="District"
          value={address.District}
          onChangeText={(v) => setAddress((a) => ({ ...a, District: v }))}
        />

        <Text style={styles.label}>Barangay</Text>
        <RNPickerSelect
          onValueChange={(v) =>
            setAddress((a) => ({ ...a, barangay: v, customBarangay: "" }))
          }
          value={address.barangay}
          items={barangayOptions.map((b) => ({ label: b, value: b }))}
        />
        {address.barangay === "Others" && (
          <TextInput
            style={styles.input}
            placeholder="Custom Barangay"
            value={address.customBarangay}
            onChangeText={(v) =>
              setAddress((a) => ({ ...a, customBarangay: v }))
            }
          />
        )}

        <Text style={styles.label}>City</Text>
        <RNPickerSelect
          onValueChange={(v) =>
            setAddress((a) => ({ ...a, city: v, customCity: "" }))
          }
          value={address.city}
          items={cityOptions.map((c) => ({ label: c, value: c }))}
        />
        {address.city === "Others" && (
          <TextInput
            style={styles.input}
            placeholder="Custom City"
            value={address.customCity}
            onChangeText={(v) => setAddress((a) => ({ ...a, customCity: v }))}
          />
        )}

        {/* Ministry Roles */}
        <Text style={styles.heading2}>Ministry Roles</Text>
        {ministryRoles.map((role, idx) => (
          <View key={idx} style={styles.ministryRoleContainer}>
            <Text style={styles.label}>Ministry</Text>
            <RNPickerSelect
              onValueChange={(v) =>
                handleMinistryRoleChange(idx, "ministry", v)
              }
              value={role.ministry}
              items={ministryCategory.map((cat) => ({
                label: cat.name,
                value: cat._id,
              }))}
            />
            <Text style={styles.label}>Role</Text>
            <RNPickerSelect
              onValueChange={(v) => handleMinistryRoleChange(idx, "role", v)}
              value={role.role}
              items={roleOptions.map((r) => ({ label: r, value: r }))}
            />
            {role.role === "Others" && (
              <TextInput
                style={styles.input}
                placeholder="Custom Role"
                value={role.customRole}
                onChangeText={(v) =>
                  handleMinistryRoleChange(idx, "customRole", v)
                }
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Start Year"
              value={role.startYear}
              keyboardType="numeric"
              onChangeText={(v) =>
                handleMinistryRoleChange(idx, "startYear", v)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="End Year (optional)"
              value={role.endYear}
              keyboardType="numeric"
              onChangeText={(v) => handleMinistryRoleChange(idx, "endYear", v)}
            />
            {ministryRoles.length > 1 && (
              <TouchableOpacity onPress={() => removeMinistryRole(idx)}>
                <Text style={{ color: "red" }}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity onPress={addMinistryRole}>
          <Text style={{ color: "#26572e", marginBottom: 10 }}>
            + Add Ministry Role
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUpdateProfile}
          style={styles.updateButton}
        >
          <MaterialIcons name="done-all" size={40} color="#26572e" />
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
  heading2: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  updateButton: { padding: 10, borderRadius: 5 },
  label: {
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 5,
    fontWeight: "bold",
  },
  ministryRoleContainer: {
    width: "90%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
  },
});

export default UpdateProfile;
