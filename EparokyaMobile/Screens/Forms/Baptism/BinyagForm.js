import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useSelector } from "react-redux";
import baseURL from "../../../assets/common/baseUrl";
import { Image } from "react-native";

const marriageStatusOptions = ["Simbahan", "Civil", "Nat", "Others"];

const BaptismForm = ({ navigation }) => {
  const [baptismDate, setBaptismDate] = useState(new Date());
  const [baptismTime, setBaptismTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [phone, setPhone] = useState("");
  const [ninong, setNinong] = useState({ name: "", address: "", religion: "" });
  const [ninang, setNinang] = useState({ name: "", address: "", religion: "" });
  const [certificateNoRecord, setCertificateNoRecord] = useState(null);
  const [showChildDOBPicker, setShowChildDOBPicker] = useState(false);
  const [showBaptismDatePicker, setShowBaptismDatePicker] = useState(false);
  const [showBaptismTimePicker, setShowBaptismTimePicker] = useState(false);

  const [child, setChild] = useState({
    fullName: "",
    dateOfBirth: new Date(),
    placeOfBirth: "",
    gender: "",
  });

  const [parents, setParents] = useState({
    fatherFullName: "",
    placeOfFathersBirth: "",
    motherFullName: "",
    placeOfMothersBirth: "",
    address: "",
    marriageStatus: "",
    customMarriageStatus: "",
  });

  const [NinongGodparents, setNinongGodparents] = useState([]);
  const [NinangGodparents, setNinangGodparents] = useState([]);
  const [error, setError] = useState("");
  const { user, token } = useSelector((state) => state.auth);

  // Image states (unchanged)
  const [birthCertificate, setBirthCertificate] = useState(null);
  const [marriageCertificate, setMarriageCertificate] = useState(null);
  const [baptismPermit, setBaptismPermit] = useState(null);

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const addGodparent = (type) => {
    if (type === "ninong" && NinongGodparents.length < 6) {
      setNinongGodparents([
        ...NinongGodparents,
        { name: "", address: "", religion: "" },
      ]);
    } else if (type === "ninang" && NinangGodparents.length < 6) {
      setNinangGodparents([
        ...NinangGodparents,
        { name: "", address: "", religion: "" },
      ]);
    }
  };

  const removeGodparent = (type, index) => {
    if (type === "ninong") {
      setNinongGodparents(NinongGodparents.filter((_, i) => i !== index));
    } else {
      setNinangGodparents(NinangGodparents.filter((_, i) => i !== index));
    }
  };
  const ImagePreview = ({ uri, label }) => (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.fileName}>{label}:</Text>
      <Image
        source={{ uri }}
        style={{ width: 100, height: 100, borderRadius: 10 }}
        resizeMode="cover"
      />
    </View>
  );
  const getAgeFromDOB = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassedThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassedThisYear) {
      age--;
    }

    return age;
  };

  const handleSubmit = async () => {
    const childAge = getAgeFromDOB(child.dateOfBirth);

    if (childAge >= 3 && !baptismPermit && !certificateNoRecord) {
      setError(
        "For children 3 years or older, a baptism permit or certificate of no record is required."
      );
      return;
    }

    if (
      !phone ||
      !child.fullName ||
      !child.dateOfBirth ||
      !parents.fatherFullName ||
      !parents.motherFullName ||
      !parents.address ||
      (!parents.marriageStatus && !parents.customMarriageStatus) ||
      !birthCertificate ||
      !marriageCertificate
    ) {
      setError("Please fill in all the required fields.");
      return;
    }

    const parentsData = {
      ...parents,
      marriageStatus:
        parents.marriageStatus === "Others"
          ? parents.customMarriageStatus
          : parents.marriageStatus,
    };

    const childToSend = {
      ...child,
      dateOfBirth: child.dateOfBirth ? child.dateOfBirth.toISOString() : null,
    };

    let formData = new FormData();
    formData.append("baptismDate", baptismDate.toISOString());
    formData.append("baptismTime", baptismTime.toISOString());
    formData.append("phone", phone);
    formData.append("child", JSON.stringify(childToSend));
    formData.append("parents", JSON.stringify(parentsData));
    formData.append("ninong", JSON.stringify(ninong));
    formData.append("ninang", JSON.stringify(ninang));
    formData.append("NinongGodparents", JSON.stringify(NinongGodparents));
    formData.append("NinangGodparents", JSON.stringify(NinangGodparents));

    formData.append("birthCertificate", {
      uri: birthCertificate,
      name: "birth_certificate.jpg",
      type: "image/jpeg",
    });
    formData.append("marriageCertificate", {
      uri: marriageCertificate,
      name: "marriage_certificate.jpg",
      type: "image/jpeg",
    });
    formData.append("baptismPermit", {
      uri: baptismPermit,
      name: "baptism_permit.jpg",
      type: "image/jpeg",
    });
    formData.append("certificateOfNoRecordBaptism", {
      uri: certificateNoRecord,
      name: "certificate_no_record.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post(`${baseURL}/baptismCreate`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Baptism form submitted successfully.");
        setPhone("");
        setChild({ fullName: "", dateOfBirth: "" });
        setParents({
          fatherFullName: "",
          motherFullName: "",
          address: "",
          marriageStatus: "",
          customMarriageStatus: "",
        });
        setNinong({ fullName: "", address: "" });
        setNinang({ fullName: "", address: "" });
        setNinongGodparents([{ fullName: "", address: "" }]);
        setNinangGodparents([{ fullName: "", address: "" }]);
        setBirthCertificate(null);
        setMarriageCertificate(null);
        setBaptismPermit(null);
        setCertificateNoRecord(null);
        setError(null);
        navigation.navigate("Home");
      } else {
        setError("Failed to submit form. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An error occurred. Please try again later.");
    }
  };

  const onChildDateChange = (event, selectedDate) => {
    setShowChildDOBPicker(false);
    if (selectedDate) {
      setChild({ ...child, dateOfBirth: selectedDate });
    }
  };

  const onBaptismDateChange = (event, selectedDate) => {
    setShowBaptismDatePicker(false);
    if (selectedDate) {
      setBaptismDate(selectedDate);
    }
  };

  const onBaptismTimeChange = (event, selectedTime) => {
    setShowBaptismTimePicker(false);
    if (selectedTime) {
      setBaptismTime(selectedTime);
    }
  };

  const formatTime12Hour = (date) => {
    if (!date) return "";
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesStr}${ampm}`;
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.header}>Baptism Form</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Contact Number */}
      <View style={styles.section}>
        <Text style={styles.label}>Contact Number *</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter contact number"
        />
      </View>

      {/* Child Details */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Child Details</Text>

        <Text style={styles.label}>Full Name of Child *</Text>
        <TextInput
          style={styles.input}
          value={child.fullName}
          onChangeText={(text) => setChild({ ...child, fullName: text })}
          placeholder="Enter child's full name"
        />

        {showDatePicker && (
          <DateTimePicker
            value={child.dateOfBirth || new Date()}
            mode="date"
            display="default"
            onChange={onChildDateChange}
          />
        )}

        <TouchableOpacity onPress={() => setShowChildDOBPicker(true)}>
          <TextInput
            editable={false}
            value={child.dateOfBirth ? child.dateOfBirth.toDateString() : ""}
            style={styles.input}
            placeholder="Select date of birth"
          />
        </TouchableOpacity>
        {showChildDOBPicker && (
          <DateTimePicker
            value={child.dateOfBirth || new Date()}
            mode="date"
            display="default"
            onChange={onChildDateChange}
          />
        )}

        <Text style={styles.label}>Place of Birth</Text>
        <TextInput
          style={styles.input}
          value={child.placeOfBirth}
          onChangeText={(text) => setChild({ ...child, placeOfBirth: text })}
          placeholder="Enter place of birth"
        />

        <Text style={styles.label}>Gender</Text>
        <Picker
          selectedValue={child.gender}
          onValueChange={(itemValue) =>
            setChild({ ...child, gender: itemValue })
          }
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      {/* Baptism Date & Time */}
      <View style={styles.section}>
        <Text style={styles.label}>Baptism Date *</Text>
        <TouchableOpacity onPress={() => setShowBaptismDatePicker(true)}>
          <TextInput
            editable={false}
            value={baptismDate.toDateString()}
            style={styles.input}
            placeholder="Select baptism date"
          />
        </TouchableOpacity>
        {showBaptismDatePicker && (
          <DateTimePicker
            value={baptismDate}
            mode="date"
            display="default"
            onChange={onBaptismDateChange}
          />
        )}

        <Text style={styles.label}>Baptism Time *</Text>
        <TouchableOpacity onPress={() => setShowBaptismTimePicker(true)}>
          <TextInput
            editable={false}
            value={formatTime12Hour(baptismTime)}
            style={styles.input}
            placeholder="Select baptism time"
          />
        </TouchableOpacity>
        {showBaptismTimePicker && (
          <DateTimePicker
            value={baptismTime}
            mode="time"
            display="default"
            onChange={onBaptismTimeChange}
          />
        )}
      </View>

      {/* Parents Details */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Parents Details</Text>

        <Text style={styles.label}>Father's Full Name *</Text>
        <TextInput
          style={styles.input}
          value={parents.fatherFullName}
          onChangeText={(text) =>
            setParents({ ...parents, fatherFullName: text })
          }
          placeholder="Enter father's full name"
        />

        <Text style={styles.label}>Place of Father's Birth</Text>
        <TextInput
          style={styles.input}
          value={parents.placeOfFathersBirth}
          onChangeText={(text) =>
            setParents({ ...parents, placeOfFathersBirth: text })
          }
          placeholder="Enter place of father's birth"
        />

        <Text style={styles.label}>Mother's Full Name *</Text>
        <TextInput
          style={styles.input}
          value={parents.motherFullName}
          onChangeText={(text) =>
            setParents({ ...parents, motherFullName: text })
          }
          placeholder="Enter mother's full name"
        />

        <Text style={styles.label}>Place of Mother's Birth</Text>
        <TextInput
          style={styles.input}
          value={parents.placeOfMothersBirth}
          onChangeText={(text) =>
            setParents({ ...parents, placeOfMothersBirth: text })
          }
          placeholder="Enter place of mother's birth"
        />

        {/* Remove barangay and city pickers here */}

        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={styles.input}
          value={parents.address}
          onChangeText={(text) => setParents({ ...parents, address: text })}
          placeholder="Enter address"
        />

        <Text style={styles.label}>Marriage Status *</Text>
        <Picker
          selectedValue={parents.marriageStatus}
          onValueChange={(value) =>
            setParents({ ...parents, marriageStatus: value })
          }
          style={styles.picker}
        >
          <Picker.Item label="Select Marriage Status" value="" />
          {marriageStatusOptions.map((status, i) => (
            <Picker.Item key={i} label={status} value={status} />
          ))}
        </Picker>
        {parents.marriageStatus === "Others" && (
          <TextInput
            style={styles.input}
            placeholder="Specify Marriage Status"
            value={parents.customMarriageStatus}
            onChangeText={(text) =>
              setParents({ ...parents, customMarriageStatus: text })
            }
          />
        )}
      </View>

      {/* Principal Sponsor: Ninong */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>
          Ninong (Principal Godfather) Details *
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={ninong.name}
          onChangeText={(text) => setNinong({ ...ninong, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={ninong.address}
          onChangeText={(text) => setNinong({ ...ninong, address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Religion"
          value={ninong.religion}
          onChangeText={(text) => setNinong({ ...ninong, religion: text })}
        />
      </View>

      {/* Principal Sponsor: Ninang */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>
          Ninang (Principal Godmother) Details *
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={ninang.name}
          onChangeText={(text) => setNinang({ ...ninang, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={ninang.address}
          onChangeText={(text) => setNinang({ ...ninang, address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Religion"
          value={ninang.religion}
          onChangeText={(text) => setNinang({ ...ninang, religion: text })}
        />
      </View>

      {/* Secondary Sponsors: NinongGodparents */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Secondary Ninong Godparents</Text>
        {NinongGodparents.map((godparent, index) => (
          <View key={index} style={styles.inlineGroup}>
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder="Name"
              value={godparent.name}
              onChangeText={(text) => {
                const newList = [...NinongGodparents];
                newList[index].name = text;
                setNinongGodparents(newList);
              }}
            />
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder="Address"
              value={godparent.address}
              onChangeText={(text) => {
                const newList = [...NinongGodparents];
                newList[index].address = text;
                setNinongGodparents(newList);
              }}
            />
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder="Religion"
              value={godparent.religion}
              onChangeText={(text) => {
                const newList = [...NinongGodparents];
                newList[index].religion = text;
                setNinongGodparents(newList);
              }}
            />
            <TouchableOpacity
              onPress={() => removeGodparent("ninong", index)}
              style={[styles.removeBtn, { backgroundColor: "#26572E" }]}
            >
              <Text style={{ color: "white" }}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          onPress={() => addGodparent("ninong")}
          style={[
            styles.addBtn,
            {
              backgroundColor:
                NinongGodparents.length >= 6 ? "gray" : "#26572E",
            },
          ]}
          disabled={NinongGodparents.length >= 6}
        >
          <Text style={{ color: "white" }}>Add Ninong Godparent</Text>
        </TouchableOpacity>
      </View>

      {/* Secondary Sponsors: NinangGodparents */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Secondary Ninang Godparents</Text>
        {NinangGodparents.map((godparent, index) => (
          <View key={index} style={styles.inlineGroup}>
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder="Name"
              value={godparent.name}
              onChangeText={(text) => {
                const newList = [...NinangGodparents];
                newList[index].name = text;
                setNinangGodparents(newList);
              }}
            />
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder="Address"
              value={godparent.address}
              onChangeText={(text) => {
                const newList = [...NinangGodparents];
                newList[index].address = text;
                setNinangGodparents(newList);
              }}
            />
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder="Religion"
              value={godparent.religion}
              onChangeText={(text) => {
                const newList = [...NinangGodparents];
                newList[index].religion = text;
                setNinangGodparents(newList);
              }}
            />
            <TouchableOpacity
              onPress={() => removeGodparent("ninang", index)}
              style={[styles.removeBtn, { backgroundColor: "#26572E" }]}
            >
              <Text style={{ color: "white" }}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          onPress={() => addGodparent("ninang")}
          style={[
            styles.addBtn,
            {
              backgroundColor:
                NinangGodparents.length >= 6 ? "gray" : "#26572E",
            },
          ]}
          disabled={NinangGodparents.length >= 6}
        >
          <Text style={{ color: "white" }}>Add Ninang Godparent</Text>
        </TouchableOpacity>
      </View>

      {/* Document Uploads */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Upload Documents *</Text>

        {/* --- REQUIRED: Birth Certificate --- */}
        <Button
          title="Select Birth Certificate"
          onPress={() => pickImage(setBirthCertificate)}
          color="#007AFF" // Use same color as submit for consistency
        />
        {birthCertificate && (
          <ImagePreview uri={birthCertificate} label="Birth Certificate" />
        )}

        {/* --- REQUIRED: Marriage Certificate --- */}
        <Button
          title="Select Marriage Certificate"
          onPress={() => pickImage(setMarriageCertificate)}
          color="#007AFF"
        />
        {marriageCertificate && (
          <ImagePreview
            uri={marriageCertificate}
            label="Marriage Certificate"
          />
        )}

        {/* --- CONDITIONALLY REQUIRED: Baptism Permit --- */}
        <Button
          title="Select Baptism Permit"
          onPress={() => pickImage(setBaptismPermit)}
          color="#007AFF"
        />
        {baptismPermit && (
          <ImagePreview uri={baptismPermit} label="Baptism Permit" />
        )}

        {/* OPTIONAL: Certificate of No Record of Baptism */}
        <Button
          title="Select Certificate of No Record of Baptism"
          onPress={() => pickImage(setCertificateNoRecord)}
          color="#007AFF"
        />
        {certificateNoRecord && (
          <ImagePreview
            uri={certificateNoRecord}
            label="Certificate of No Record of Baptism"
          />
        )}
      </View>

      {/* Submit Button */}
      <View style={{ marginVertical: 20 }}>
        <Button title="Submit Form" onPress={handleSubmit} />
      </View>

      {/* Date & Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={child.dateOfBirth || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              // Determine which date is being picked: child's DOB or baptismDate
              if (child.dateOfBirth) {
                setChild({ ...child, dateOfBirth: selectedDate });
              } else {
                setBaptismDate(selectedDate);
              }
            }
          }}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={baptismTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setBaptismTime(selectedTime);
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  subHeader: {
    subHeader: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  },
  label: { marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  section: {
    marginBottom: 24,
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
  inlineGroup: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  flex1: {
    flex: 1,
    marginRight: 4,
  },
  addBtn: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  removeBtn: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  submitBtn: {
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  fileName: {
    marginVertical: 4,
    fontStyle: "italic",
    color: "#666",
  },
});

export default BaptismForm;
