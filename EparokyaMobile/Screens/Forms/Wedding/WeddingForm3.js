import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";

const WeddingForm3 = ({ navigation, route }) => {
  const { groomName, groomAddress, groomPhone, groomBirthDate, groomOccupation, groomReligion, groomFather, groomMother } = route.params;

  const [brideName, setBrideName] = useState("");
  const [brideStreet, setBrideStreet] = useState("");
  const [brideZip, setBrideZip] = useState("");
  const [brideCity, setBrideCity] = useState("");
  const [bridePhone, setBridePhone] = useState("");
  const [brideBirthDate, setBrideBirthDate] = useState(new Date());
  const [brideOccupation, setBrideOccupation] = useState("");
  const [brideReligion, setBrideReligion] = useState("");
  const [brideFather, setBrideFather] = useState("");
  const [brideMother, setBrideMother] = useState("");
  const [error, setError] = useState("");
  const [showBrideBirthDatePicker, setShowBrideBirthDatePicker] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const onBrideBirthDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setBrideBirthDate(selectedDate);
    }
    setShowBrideBirthDatePicker(false);
  };

  const clearFields = () => {
    setBrideName("");
    setBrideStreet("");
    setBrideZip("");
    setBrideCity("");
    setBridePhone("");
    setBrideBirthDate(new Date());
    setBrideOccupation("");
    setBrideReligion("");
    setBrideFather("");
    setBrideMother("");
    setError("");
  };

  const goToNextPage = () => {
    if (
      !brideName ||
      !brideStreet ||
      !brideZip ||
      !brideCity ||
      !bridePhone ||
      !brideBirthDate ||
      !brideOccupation ||
      !brideReligion ||
      !brideFather ||
      !brideMother
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const brideAddress = {
      street: brideStreet,
      zip: brideZip,
      city: brideCity,
    };

    navigation.navigate("WeddingForm4", {
      ...route.params, // Include previous form data
      brideName,
      brideAddress,
      bridePhone,
      brideBirthDate: brideBirthDate.toISOString(),
      brideOccupation,
      brideReligion,
      brideFather,
      brideMother,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Bride's Name" value={brideName} onChangeText={setBrideName} style={styles.input} />
      <TextInput placeholder="Street" value={brideStreet} onChangeText={setBrideStreet} style={styles.input} />
      <TextInput placeholder="Zip" value={brideZip} keyboardType="numeric" onChangeText={setBrideZip} style={styles.input} />
      <TextInput placeholder="City" value={brideCity} onChangeText={setBrideCity} style={styles.input} />
      <TextInput placeholder="Phone" keyboardType="phone-pad" value={bridePhone} onChangeText={setBridePhone} style={styles.input} />

      <TouchableOpacity onPress={() => setShowBrideBirthDatePicker(true)} style={styles.button}>
        <Text style={styles.buttonText}>Select Birthday</Text>
      </TouchableOpacity>
      {showBrideBirthDatePicker && (
        <DateTimePicker value={brideBirthDate} mode="date" display="default" onChange={onBrideBirthDateChange} />
      )}
      <Text style={styles.selectedDate}>Selected Birthday: {brideBirthDate.toDateString()}</Text>

      <TextInput placeholder="Occupation" value={brideOccupation} onChangeText={setBrideOccupation} style={styles.input} />
      <TextInput placeholder="Religion" value={brideReligion} onChangeText={setBrideReligion} style={styles.input} />
      <TextInput placeholder="Father's Name" value={brideFather} onChangeText={setBrideFather} style={styles.input} />
      <TextInput placeholder="Mother's Name" value={brideMother} onChangeText={setBrideMother} style={styles.input} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={goToNextPage} style={[styles.button, styles.nextButton]}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearFields} style={[styles.button, styles.clearButton]}>
          <Text style={styles.clearButtonText}>Clear Fields</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "flex-start" },
  input: { marginBottom: 10, padding: 10, borderWidth: 1, borderColor: "#ccc", width: "100%" },
  error: { color: "red", marginBottom: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "center", width: "100%" },
  button: { borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, marginHorizontal: 5, alignItems: "center" },
  nextButton: { backgroundColor: "#26572E" },
  clearButton: { backgroundColor: "#B3CF99" },
  buttonText: { color: "white", fontWeight: "bold" },
  clearButtonText: { color: "black", fontWeight: "bold" },
  selectedDate: { marginBottom: 10 }
});

export default WeddingForm3;
