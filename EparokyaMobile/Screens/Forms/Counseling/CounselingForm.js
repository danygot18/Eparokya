import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { Button } from 'native-base';
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import baseURL from "../../../assets/common/baseUrl";
import TermsAndConditionsModal from "../../../Screens/TermsAndConditionsModal";

const relationshipOptions = [
  "Mother/Nanay",
  "Father/Tatay",
  "Child/Anak",
  "Sibling/Kapatid",
  "Spouse/Asawa",
  "Stepparent",
  "Stepchild",
  "In-law",
  "Godparent",
  "Godchild",
  "Relative/Kamag-anak",
  "Guardian",
  "Friend/Kaibigan",
];

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

const formatDate = (date) => {
  if (!date) return "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

const formatTime = (date) => {
  if (!date) return "";
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours || 12;
  return `${hours}:${minutes.toString().padStart(2, "0")}${ampm}`;
};

const initialFormData = {
  person: { fullName: "", dateOfBirth: "" },
  purpose: "",
  contactPerson: { fullName: "", contactNumber: "", relationship: "" },
  contactNumber: "",
  address: {
    BldgNameTower: "",
    LotBlockPhaseHouseNo: "",
    SubdivisionVillageZone: "",
    Street: "",
    District: "",
    barangay: "",
    customBarangay: "",
    city: "",
    customCity: "",
  },
  counselingDate: "",
  counselingTime: "",
};

const CounselingForm = () => {
  const [formData, setFormData] = useState({
    person: { fullName: "", dateOfBirth: "" },
    purpose: "",
    contactPerson: { fullName: "", contactNumber: "", relationship: "" },
    contactNumber: "",
    address: {
      BldgNameTower: "",
      LotBlockPhaseHouseNo: "",
      SubdivisionVillageZone: "",
      Street: "",
      District: "",
      barangay: "",
      customBarangay: "",
      city: "",
      customCity: "",
    },
    counselingDate: "",
    counselingTime: "",
  });

  const navigation = useNavigation();
  const { user, token } = useSelector((state) => state.auth);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showCounselingDatePicker, setShowCounselingDatePicker] =
    useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);

  const handleChange = (value, fieldPath) => {
    const keys = fieldPath.split(".");
    setFormData((prev) => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleClear = () => {
    setFormData({
      person: { fullName: "", dateOfBirth: "" },
      purpose: "",
      contactPerson: { fullName: "", contactNumber: "", relationship: "" },
      contactNumber: "",
      address: {
        BldgNameTower: "",
        LotBlockPhaseHouseNo: "",
        SubdivisionVillageZone: "",
        Street: "",
        District: "",
        barangay: "",
        customBarangay: "",
        city: "",
        customCity: "",
      },
      counselingDate: "",
      counselingTime: "",
    });
  };

  const handleSubmit = async () => {
    if (!hasAgreedToTerms) {
      toast.show({
        description:
          "Please agree to the Terms and Conditions before submitting.",
      });
      return;
    }
    const { fullName, dateOfBirth } = formData.person;
    const {
      purpose,
      contactNumber,
      contactPerson,
      address,
      counselingDate,
      counselingTime,
    } = formData;

    if (
      !fullName ||
      !dateOfBirth ||
      !purpose ||
      !contactNumber ||
      !contactPerson.relationship ||
      !address.barangay ||
      !address.city ||
      !address.Street ||
      !address.District
    ) {
      Alert.alert("Error", "Please fill out all required fields!");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const submissionData = { ...formData, userId: user?._id };

      const response = await axios.post(
        `${baseURL}/counselingSubmit`,
        submissionData,
        config
      );

      if (response.status === 201) {
        Alert.alert("Success", "Counseling form submitted successfully.");
        setFormData(initialFormData);
        navigation.navigate("Home");
      } else {
        Alert.alert("Error", "Failed to submit form. Please try again.");
      }
    } catch (err) {
      console.error(
        "Error submitting form:",
        err.response ? err.response.data : err.message
      );
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Personal Information</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={formData.person.fullName}
        onChangeText={(value) => handleChange(value, "person.fullName")}
      />

      <TouchableOpacity onPress={() => setShowBirthDatePicker(true)}>
        <TextInput
          placeholder="Date of Birth"
          style={styles.input}
          value={
            formData.person.dateOfBirth
              ? formatDate(formData.person.dateOfBirth)
              : ""
          }
          editable={false}
        />
      </TouchableOpacity>
      {showBirthDatePicker && (
        <DateTimePicker
          value={
            formData.person.dateOfBirth
              ? new Date(formData.person.dateOfBirth)
              : new Date()
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowBirthDatePicker(false);
            if (date) handleChange(date.toISOString(), "person.dateOfBirth");
          }}
        />
      )}

      <Text style={styles.header}>Counseling Details</Text>

      <TextInput
        placeholder="Purpose"
        style={styles.input}
        value={formData.purpose}
        onChangeText={(value) => handleChange(value, "purpose")}
      />

      <TextInput
        placeholder="Contact Number"
        style={styles.input}
        value={formData.contactNumber}
        keyboardType="phone-pad"
        onChangeText={(value) => handleChange(value, "contactNumber")}
      />

      <Text style={styles.header}>Contact Person</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={formData.contactPerson.fullName}
        onChangeText={(value) => handleChange(value, "contactPerson.fullName")}
      />

      <TextInput
        placeholder="Contact Number"
        style={styles.input}
        value={formData.contactPerson.contactNumber}
        keyboardType="phone-pad"
        onChangeText={(value) =>
          handleChange(value, "contactPerson.contactNumber")
        }
      />

      <Text style={{ marginTop: 10, fontWeight: "bold" }}>Relationship *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.contactPerson.relationship}
          onValueChange={(value) =>
            handleChange(value, "contactPerson.relationship")
          }
        >
          <Picker.Item label="Select relationship" value="" />
          {relationshipOptions.map((rel) => (
            <Picker.Item key={rel} label={rel} value={rel} />
          ))}
        </Picker>
      </View>

      <Text style={styles.header}>Address</Text>

      <TextInput
        placeholder="Building Name / Tower"
        style={styles.input}
        value={formData.address.BldgNameTower}
        onChangeText={(value) => handleChange(value, "address.BldgNameTower")}
      />

      <TextInput
        placeholder="Lot / Block / Phase / House No."
        style={styles.input}
        value={formData.address.LotBlockPhaseHouseNo}
        onChangeText={(value) =>
          handleChange(value, "address.LotBlockPhaseHouseNo")
        }
      />

      <TextInput
        placeholder="Subdivision / Village / Zone"
        style={styles.input}
        value={formData.address.SubdivisionVillageZone}
        onChangeText={(value) =>
          handleChange(value, "address.SubdivisionVillageZone")
        }
      />

      <TextInput
        placeholder="Street *"
        style={styles.input}
        value={formData.address.Street}
        onChangeText={(value) => handleChange(value, "address.Street")}
      />

      <TextInput
        placeholder="District *"
        style={styles.input}
        value={formData.address.District}
        onChangeText={(value) => handleChange(value, "address.District")}
      />

      <Text style={{ marginTop: 10, fontWeight: "bold" }}>Barangay *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.address.barangay}
          onValueChange={(value) => handleChange(value, "address.barangay")}
        >
          <Picker.Item label="Select barangay" value="" />
          {barangayOptions.map((brgy) => (
            <Picker.Item key={brgy} label={brgy} value={brgy} />
          ))}
        </Picker>
      </View>

      {formData.address.barangay === "Others" && (
        <TextInput
          placeholder="Specify Barangay"
          style={styles.input}
          value={formData.address.customBarangay}
          onChangeText={(value) =>
            handleChange(value, "address.customBarangay")
          }
        />
      )}

      <Text style={{ marginTop: 10, fontWeight: "bold" }}>City *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.address.city}
          onValueChange={(value) => handleChange(value, "address.city")}
        >
          <Picker.Item label="Select city" value="" />
          {cityOptions.map((city) => (
            <Picker.Item key={city} label={city} value={city} />
          ))}
        </Picker>
      </View>

      {formData.address.city === "Others" && (
        <TextInput
          placeholder="Specify City"
          style={styles.input}
          value={formData.address.customCity}
          onChangeText={(value) => handleChange(value, "address.customCity")}
        />
      )}

      <Text style={styles.header}>Counseling Schedule</Text>

      <TouchableOpacity onPress={() => setShowCounselingDatePicker(true)}>
        <TextInput
          placeholder="Counseling Date"
          style={styles.input}
          value={
            formData.counselingDate ? formatDate(formData.counselingDate) : ""
          }
          editable={false}
        />
      </TouchableOpacity>
      {showCounselingDatePicker && (
        <DateTimePicker
          value={
            formData.counselingDate
              ? new Date(formData.counselingDate)
              : new Date()
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowCounselingDatePicker(false);
            if (date) handleChange(date.toISOString(), "counselingDate");
          }}
        />
      )}

      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <TextInput
          placeholder="Counseling Time"
          style={styles.input}
          value={
            formData.counselingTime
              ? formatTime(new Date(formData.counselingTime))
              : ""
          }
          editable={false}
        />
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={
            formData.counselingTime
              ? new Date(formData.counselingTime)
              : new Date()
          }
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowTimePicker(false);
            if (date) handleChange(date.toISOString(), "counselingTime");
          }}
        />
      )}

      <View style={styles.buttonContainer}>
        {/* Terms and Conditions button */}
        <Button
          variant="outline"
          onPress={() => setIsTermsModalVisible(true)}
          colorScheme={hasAgreedToTerms ? "green" : "gray"}
          style={{ marginBottom: 10 }}
        >
          {hasAgreedToTerms ? "Terms Accepted" : "Read Terms & Conditions"}
        </Button>

        {/* Submit button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        {/* Clear All Fields button */}
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClear}
        >
          <Text style={[styles.buttonText, styles.clearButtonText]}>
            Clear All Fields
          </Text>
        </TouchableOpacity>

        {/* Terms and Conditions Modal */}
        <TermsAndConditionsModal
          isVisible={isTermsModalVisible}
          onAgree={() => {
            setHasAgreedToTerms(true);
            setIsTermsModalVisible(false);
          }}
          onClose={() => setIsTermsModalVisible(false)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 15,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  button: {
    flex: 1,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  clearButtonText: {
    color: "#f8f9fa",
  },
});

export default CounselingForm;
