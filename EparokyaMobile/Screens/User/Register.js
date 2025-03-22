import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input.js";
import { MaterialIcons } from "@expo/vector-icons";

var { height, width } = Dimensions.get("window");

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  // Function to navigate to the next screen
  const goToNextPage = () => {
    if (email === "" || name === "" || password === "") {
      setError("Please fill in the form correctly");
      return;
    }

    // Navigate to Register2 with the collected data
    navigation.navigate("Register2", {
      email,
      name,
      password,
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <FormContainer>
          <Input
            placeholder={"Email"}
            name={"email"}
            id={"email"}
            onChangeText={(text) => setEmail(text.toLowerCase())}
          />
          <Input
            placeholder={"Name"}
            name={"name"}
            id={"name"}
            onChangeText={(text) => setName(text)}
          />
          <Input
            placeholder={"Password"}
            name={"password"}
            id={"password"}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />

          <View style={styles.buttonGroup}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <Button onPress={goToNextPage} style={styles.registerButton}>
            <Text style={styles.buttonText}>Next</Text>
          </Button>
        </FormContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
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
});

export default Register;