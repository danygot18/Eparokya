import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";

const WeddingForm3 = ({ navigation, route }) => {
  const params = route.params || {};
  const [brideName, setBrideName] = useState(params.brideName || "");
  const [brideAddress, setBrideAddress] = useState({
    street: params.brideAddress?.street || "",
    city: params.brideAddress?.city || "",
    zip: params.brideAddress?.zip || "",
  });
  const [brideBirthDate, setBrideBirthDate] = useState(new Date(params.brideBirthDate || new Date()));
  const [brideOccupation, setBrideOccupation] = useState(params.brideOccupation || "");
  const [bridePhone, setBridePhone] = useState(params.bridePhone || "");
  const [brideReligion, setBrideReligion] = useState(params.brideReligion || "");
  const [brideFather, setBrideFather] = useState(params.brideFather || "");
  const [brideMother, setBrideMother] = useState(params.brideMother || "");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [showBrideBirthDatePicker, setShowBrideBirthDatePicker] = useState(false);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setUserId(user._id);
    }
  }, [user]);

  const handleAddressChange = (key, value) => {
    setBrideAddress((prevAddress) => ({
      ...prevAddress,
      [key]: value,
    }));
  };

  const goToNextPage = () => {
    if (!brideOccupation || !brideReligion || !brideFather || !brideMother) {
      setError("Please fill in all fields.");
      return;
    }
  
    if (!brideAddress.street || !brideAddress.city || !brideAddress.zip) {
      setError("Bride's address is incomplete.");
      return;
    }
  
    const weddingData = {
      ...route.params, // Include previous form data
      brideName,
      brideAddress,
      bridePhone,
      brideBirthDate: brideBirthDate.toISOString(),
      brideOccupation,
      brideReligion,
      brideFather,
      brideMother,
    };
  
    navigation.navigate("WeddingForm4", {
      weddingData,
      userId,
    });
  };

  const clearForm = () => {
    setBrideOccupation("");
    setBrideReligion("");
    setBridePhone("");
    setBrideFather("");
    setBrideMother("");
    setBrideBirthDate(new Date());
    setBrideAddress({ street: "", city: "", zip: "" });
    setError("");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        placeholder="Name of the Bride"
        value={brideName}
        onChangeText={(text) => setBrideName(text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Street Address"
        value={brideAddress.street}
        onChangeText={(text) => handleAddressChange("street", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="City"
        value={brideAddress.city}
        onChangeText={(text) => handleAddressChange("city", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="ZIP Code"
        value={brideAddress.zip}
        onChangeText={(text) => handleAddressChange("zip", text)}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Pick Bride's Birth Date" onPress={() => setShowBrideBirthDatePicker(true)} />
      {showBrideBirthDatePicker && (
        <DateTimePicker
          value={brideBirthDate}
          onChange={(event, selectedDate) => {
            setShowBrideBirthDatePicker(false);
            if (selectedDate) setBrideBirthDate(selectedDate);
          }}
          mode="date"
        />
      )}
      <Text>Selected Birth Date: {brideBirthDate.toDateString()}</Text>

      <TextInput
        placeholder="Phone"
        keyboardType="phone-pad"
        value={bridePhone}
        onChangeText={setBridePhone}
        style={styles.input}
      />

      <TextInput
        placeholder="Bride's Occupation"
        value={brideOccupation}
        onChangeText={setBrideOccupation}
        style={styles.input}
      />

      <TextInput
        placeholder="Bride's Religion"
        value={brideReligion}
        onChangeText={setBrideReligion}
        style={styles.input}
      />

      <TextInput
        placeholder="Bride's Father"
        value={brideFather}
        onChangeText={setBrideFather}
        style={styles.input}
      />

      <TextInput
        placeholder="Bride's Mother"
        value={brideMother}
        onChangeText={setBrideMother}
        style={styles.input}
      />

      <Button title="Next" onPress={goToNextPage} />
      <Button title="Clear Form" onPress={clearForm} color="red" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default WeddingForm3;