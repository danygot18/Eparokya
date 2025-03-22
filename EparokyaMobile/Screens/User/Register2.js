import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  FlatList,
  ScrollView,
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
import RNPickerSelect from "react-native-picker-select";
import CheckBox from "@react-native-community/checkbox";
import CalendarPicker from "react-native-calendar-picker";

var { height, width } = Dimensions.get("window");

const Register2 = () => {
  const route = useRoute();
  const { email, name, password, selectedImage } = route.params;
  console.log(route.params);
  const navigation = useNavigation();

  const [user, setUser] = useState({
    name: name,
    email: email,
    password: password,
    selectedImage: selectedImage,
    birthday: "",
    preference: "They/Them",
    civilStatus: "",
    phone: "",
    ministryRoles: [], // Updated to match the new model
  });

  const [error, setError] = useState("");
  const [ministryCategories, setMinistryCategories] = useState([]);
  const [ministryModalVisible, setMinistryModalVisible] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMinistryRole, setCurrentMinistryRole] = useState({
    ministry: null,
    startYear: "",
    endYear: "",
    role: "",
    customRole: "",
  });
  const [isAddingMinistryRole, setIsAddingMinistryRole] = useState(false);

  useEffect(() => {
    axios
      .get(`${baseURL}/ministryCategory/getAllMinistryCategories`)
      .then((response) => {
        setMinistryCategories(response.data.categories || []);
      })
      .catch((error) => {
        console.error("Fetch Error:", error.response ? error.response.data : error.message);
        setMinistryCategories([]);
      });
  }, []);

  const handleDateChange = (date) => {
    setUser({ ...user, birthday: date.toISOString().split("T")[0] }); // Format as YYYY-MM-DD
    setShowCalendar(false); // Hide the calendar after selecting a date
  };

  const handleAddMinistryRole = () => {
    if (
      !currentMinistryRole.ministry ||
      !currentMinistryRole.startYear ||
      !currentMinistryRole.role
    ) {
      setError("Please fill in all required fields for the ministry role.");
      return;
    }

    // Add the current ministry role to the user's ministryRoles array
    setUser((prevUser) => ({
      ...prevUser,
      ministryRoles: [...prevUser.ministryRoles, currentMinistryRole],
    }));

    // Reset the current ministry role form
    setCurrentMinistryRole({
      ministry: null,
      startYear: "",
      endYear: "",
      role: "",
      customRole: "",
    });

    // Close the modal
    setIsAddingMinistryRole(false);
  };

  const goToNextPage = () => {
    if (
      !user.birthday ||
      !user.phone ||
      !user.civilStatus ||
      user.ministryRoles.length === 0
    ) {
      setError("Please fill in the form correctly");
      return;
    }

    navigation.navigate("Register3", {
      email: user.email,
      name: user.name,
      password: user.password,
      selectedImage: user.selectedImage,
      birthday: user.birthday,
      preference: user.preference,
      civilStatus: user.civilStatus,
      phone: user.phone,
      ministryRoles: user.ministryRoles,
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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Birthday</Text>
          <TouchableOpacity
            onPress={() => setShowCalendar(true)}
            style={styles.dateInput}
          >
            <Text>{user.birthday || "Select Birthday"}</Text>
          </TouchableOpacity>
          {showCalendar && (
            <CalendarPicker
              onDateChange={handleDateChange}
              selectedStartDate={user.birthday ? new Date(user.birthday) : null}
            />
          )}
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
          Ministry Roles
        </Text>

        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 5,
          }}
          onPress={() => setIsAddingMinistryRole(true)}
        >
          <Text>Add Ministry Role</Text>
        </TouchableOpacity>

        {/* Display Added Ministry Roles */}
        <ScrollView>
          {user.ministryRoles.map((item, index) => (
            <View key={index} style={styles.ministryRoleItem}>
              <Text>{item.ministry}</Text>
              <Text>{item.startYear} - {item.endYear || "Present"}</Text>
              <Text>{item.role === "Others" ? item.customRole : item.role}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Modal for Adding Ministry Roles */}
        <Modal visible={isAddingMinistryRole} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Ministry Role</Text>

              <RNPickerSelect
                placeholder={{ label: "Select Ministry", value: null }}
                onValueChange={(value) =>
                  setCurrentMinistryRole({ ...currentMinistryRole, ministry: value })
                }
                items={ministryCategories.map((cat) => ({
                  label: cat.name,
                  value: cat._id,
                }))}
                style={pickerSelectStyles}
              />

              <Input
                placeholder="Start Year"
                value={currentMinistryRole.startYear}
                onChangeText={(text) =>
                  setCurrentMinistryRole({ ...currentMinistryRole, startYear: text })
                }
                keyboardType="numeric"
              />

              <Input
                placeholder="End Year (Optional)"
                value={currentMinistryRole.endYear}
                onChangeText={(text) =>
                  setCurrentMinistryRole({ ...currentMinistryRole, endYear: text })
                }
                keyboardType="numeric"
              />

              <RNPickerSelect
                placeholder={{ label: "Select Role", value: null }}
                onValueChange={(value) =>
                  setCurrentMinistryRole({ ...currentMinistryRole, role: value })
                }
                items={[
                  { label: "Coordinator", value: "Coordinator" },
                  { label: "Assistant Coordinator", value: "Assistant Coordinator" },
                  { label: "Office Worker", value: "Office Worker" },
                  { label: "Member", value: "Member" },
                  { label: "Others", value: "Others" },
                ]}
                style={pickerSelectStyles}
              />

              {currentMinistryRole.role === "Others" && (
                <Input
                  placeholder="Custom Role"
                  value={currentMinistryRole.customRole}
                  onChangeText={(text) =>
                    setCurrentMinistryRole({ ...currentMinistryRole, customRole: text })
                  }
                />
              )}

              <Button onPress={handleAddMinistryRole} style={styles.modalButton}>
                <Text style={styles.buttonText}>Add Role</Text>
              </Button>

              <Button
                onPress={() => setIsAddingMinistryRole(false)}
                style={styles.modalButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Button>
            </View>
          </View>
        </Modal>

        <View style={styles.buttonGroup}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <Button variant={"ghost"} onPress={goToNextPage} style={styles.registerButton}>
          <Text style={styles.buttonText}>Next</Text>
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
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 20,
    width: "80%",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    width: "100%",
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: "#1C5739",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  ministryRoleItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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