import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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

  const goToNextPage = () => {
    if (email === "" || name === "" || password === "") {
      setError("Please fill in the form correctly");
      return;
    }
    navigation.navigate("Register2", { email, name, password });
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer style={styles.container}>
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

        <Button
          variant={"ghost"}
          onPress={goToNextPage}
          style={styles.arrowButton}
        >
          <View style={styles.arrowIconContainer}>
            <MaterialIcons name="arrow-forward" size={24} color="white" />
          </View>
        </Button>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "100%",
    margin: 10,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  arrowButton: {
    backgroundColor: '#1C5739',
    width: "80%",
    borderRadius: 20,
    alignSelf: "center",
  },
});

export default Register;
