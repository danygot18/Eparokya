import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";

const WeddingForm2 = ({ navigation, route }) => {
  const {
    bride,
    brideAge,
    brideGender,
    bridePhone,
    brideAddress,
    dateOfApplication,
    weddingDate,
    weddingTime,
  } = route.params;

  const [groomName, setGroomName] = useState("");
  const [groomStreet, setGroomStreet] = useState("");
  const [groomZip, setGroomZip] = useState("");
  const [groomCity, setGroomCity] = useState("");
  const [groomPhone, setGroomPhone] = useState("");
  const [groomBirthDate, setGroomBirthDate] = useState(new Date());
  const [groomOccupation, setGroomOccupation] = useState("");
  const [groomReligion, setGroomReligion] = useState("");
  const [groomFather, setGroomFather] = useState("");
  const [groomMother, setGroomMother] = useState("");
  const [error, setError] = useState("");
  const [showGroomBirthDatePicker, setShowGroomBirthDatePicker] = useState(false);
  const { user, token } = useSelector((state) => state.auth);

  const onGroomBirthDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setGroomBirthDate(selectedDate);
    }
    setShowGroomBirthDatePicker(false);
  };

  const clearFields = () => {
    setGroomName("");
    setGroomStreet("");
    setGroomZip("");
    setGroomCity("");
    setGroomPhone("");
    setGroomBirthDate(new Date());
    setGroomOccupation("");
    setGroomReligion("");
    setGroomFather("");
    setGroomMother("");
    setError("");
  };

  const goToNextPage = () => {
    if (
      !groomName ||
      !groomStreet ||
      !groomZip ||
      !groomCity ||
      !groomPhone ||
      !groomBirthDate ||
      !groomOccupation ||
      !groomReligion ||
      !groomFather ||
      !groomMother
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const groomAddress = {
      street: groomStreet,
      zip: groomZip,
      city: groomCity,
    };

    navigation.navigate("WeddingForm3", {
      ...route.params, // Include previous form data
      groomName,
      groomAddress,
      groomPhone,
      groomBirthDate: groomBirthDate.toISOString(),
      groomOccupation,
      groomReligion,
      groomFather,
      groomMother,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Groom's Name" value={groomName} onChangeText={setGroomName} style={styles.input} />
      <TextInput placeholder="Street" value={groomStreet} onChangeText={setGroomStreet} style={styles.input} />
      <TextInput placeholder="Zip" value={groomZip} keyboardType="numeric" onChangeText={setGroomZip} style={styles.input} />
      <TextInput placeholder="City" value={groomCity} onChangeText={setGroomCity} style={styles.input} />
      <TextInput placeholder="Phone" keyboardType="phone-pad" value={groomPhone} onChangeText={setGroomPhone} style={styles.input} />

      <TouchableOpacity onPress={() => setShowGroomBirthDatePicker(true)} style={styles.button}>
        <Text style={styles.buttonText}>Select Birthday</Text>
      </TouchableOpacity>
      {showGroomBirthDatePicker && (
        <DateTimePicker value={groomBirthDate} mode="date" display="default" onChange={onGroomBirthDateChange} />
      )}
      <Text style={styles.selectedDate}>Selected Birthday: {groomBirthDate.toDateString()}</Text>

      <TextInput placeholder="Occupation" value={groomOccupation} onChangeText={setGroomOccupation} style={styles.input} />
      <TextInput placeholder="Religion" value={groomReligion} onChangeText={setGroomReligion} style={styles.input} />
      <TextInput placeholder="Father's Name" value={groomFather} onChangeText={setGroomFather} style={styles.input} />
      <TextInput placeholder="Mother's Name" value={groomMother} onChangeText={setGroomMother} style={styles.input} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity onPress={goToNextPage} style={[styles.button, styles.nextButton]}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={clearFields} style={[styles.button, styles.clearButton]}>
        <Text style={styles.clearButtonText}>Clear Fields</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "flex-start" },
  input: { marginBottom: 10, padding: 10, borderWidth: 1, borderColor: "#ccc", width: "100%" },
  error: { color: "red", marginBottom: 10 },
  button: { borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, marginBottom: 10, alignItems: "center" },
  nextButton: { backgroundColor: "#26572E" , alignItems: "center" },
  clearButton: { backgroundColor: "#B3CF99" },
  buttonText: { color: "white", fontWeight: "bold" },
  clearButtonText: { color: "black", fontWeight: "bold" },
  selectedDate: { marginBottom: 10 }
});

export default WeddingForm2;
