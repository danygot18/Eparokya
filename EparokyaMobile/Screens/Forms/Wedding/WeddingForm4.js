import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";

const WeddingForm4 = ({ navigation, route }) => {
  const { weddingData, userId } = route.params;

  const [ninongName, setNinongName] = useState("");
  const [ninongStreet, setNinongStreet] = useState("");
  const [ninongZip, setNinongZip] = useState("");
  const [ninongCity, setNinongCity] = useState("");
  const [ninangName, setNinangName] = useState("");
  const [ninangStreet, setNinangStreet] = useState("");
  const [ninangZip, setNinangZip] = useState("");
  const [ninangCity, setNinangCity] = useState("");
  const [error, setError] = useState("");

  const goToNextPage = () => {
    if (!ninongName || !ninongStreet || !ninongZip || !ninongCity || !ninangName || !ninangStreet || !ninangZip || !ninangCity) {
      setError("Please fill in all fields.");
      return;
    }

    const updatedWeddingData = {
      ...weddingData,
      Ninong: [{ name: ninongName, address: { street: ninongStreet, zip: ninongZip, city: ninongCity } }],
      Ninang: [{ name: ninangName, address: { street: ninangStreet, zip: ninangZip, city: ninangCity } }],
    };

    navigation.navigate("WeddingForm5", { updatedWeddingData, userId });
  };

  const clearForm = () => {
    setNinongName("");
    setNinongStreet("");
    setNinongZip("");
    setNinongCity("");
    setNinangName("");
    setNinangStreet("");
    setNinangZip("");
    setNinangCity("");
    setError("");
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Ninong's Name" value={ninongName} onChangeText={setNinongName} style={styles.input} />
      <TextInput placeholder="Street" value={ninongStreet} onChangeText={setNinongStreet} style={styles.input} />
      <TextInput placeholder="Zip" value={ninongZip} onChangeText={setNinongZip} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="City" value={ninongCity} onChangeText={setNinongCity} style={styles.input} />

      <TextInput placeholder="Ninang's Name" value={ninangName} onChangeText={setNinangName} style={styles.input} />
      <TextInput placeholder="Street" value={ninangStreet} onChangeText={setNinangStreet} style={styles.input} />
      <TextInput placeholder="Zip" value={ninangZip} onChangeText={setNinangZip} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="City" value={ninangCity} onChangeText={setNinangCity} style={styles.input} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={goToNextPage} style={[styles.button, styles.nextButton]}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearForm} style={[styles.button, styles.clearButton]}>
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
});

export default WeddingForm4;
