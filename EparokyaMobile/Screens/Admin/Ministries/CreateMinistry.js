import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Input from "../../../Shared/Form/Input";
import FormContainer from "../../../Shared/Form/FormContainer";
import { Button } from "native-base";
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";

const MinistryCategory = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      Alert.alert("Error", "Both name and description are required.");
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/ministryCategory/create`, formData);
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: response.data.message || "Ministry category created successfully!",
      });
      // navigation.navigate("MinistryList"); 
    } catch (err) {
      console.error("Submission Error:", err.response ? err.response.data : err.message);
      setError(err?.response?.data?.message || "Please try again later");
      Alert.alert("Submission Error", "There was an error submitting the form.");
      Toast.show({
        position: "bottom",
        bottomOffset: 20,
        type: "error",
        text1: err?.response?.data?.message || "Please try again later",
      });
    }
  };

  return (
    <FormContainer style={styles.container}>
      <Input
        placeholder="Ministry Name"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <Input
        placeholder="Description"
        value={formData.description}
        onChangeText={(text) => handleChange("description", text)}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.buttonContainer}>
        <Button style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </Button>
        <Button style={styles.cancelButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Button>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 60,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },
  button: {
    backgroundColor: '#1C5739',
    width: '40%',
    borderRadius: 20,
    alignSelf: 'center',
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    width: '40%',
    borderRadius: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: "white",
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    width: "100%",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default MinistryCategory;
