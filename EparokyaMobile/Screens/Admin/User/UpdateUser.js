// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Dimensions,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Pressable,
// } from "react-native";
// import EasyButton from "../../../Shared/StyledComponents/EasyButton";
// import baseURL from "../../../assets/common/baseUrl";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { CheckIcon, Select } from "native-base";
// import Error from "../../../Shared/Error";
// import Input from "../../../Shared/Form/Input";

// const { width } = Dimensions.get("window");

// const items = [
//   { label: "Admin", value: true },
//   { label: "User", value: false },
// ];

// const UpdateUser = ({ route, navigation }) => {
//   const { userId } = route.params;

//   const [user, setUser] = useState({});
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [roles, setRoles] = useState("");
//   const [token, setToken] = useState("");
//   const [error, setError] = useState("");
//   const [modalVisible, setModalVisible] = useState(true);

//   useEffect(() => {
//     AsyncStorage.getItem("jwt")
//       .then((res) => {
//         setToken(res);
//       })
//       .catch((error) => console.log(error));

//     axios
//       .get(`${baseURL}/users/${userId}`)
//       .then((res) => {
//         setUser(res.data);
//         setName(res.data.user.name);
//         setEmail(res.data.user.email);
//         setRoles(res.data.user.isAdmin);
//       })
//       .catch((error) => alert("Error loading User"));

//     return () => {
//       setUser({});
//       setToken("");
//     };
//   }, [userId]);

//   const updateUser = async () => {
//     const updatedUser = {
//       name: name,
//       email: email,
//       password: password,
//       isAdmin: roles,
//     };

//     try {
//       const response = await axios.put(`${baseURL}/users/${userId}`, updatedUser, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log(response.data);
//       navigation.navigate("UserList");
//     } catch (error) {
//       console.log(error.response);
//       setError(error.message);
//     }
//   };

//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={modalVisible}
//       onRequestClose={() => {
//         setModalVisible(!modalVisible);
//       }}
//     >
//       <View style={styles.centeredView}>
//         <View style={styles.modalView}>
//           <Pressable
//             style={styles.exitButton}
//             onPress={() => setModalVisible(!modalVisible)}
//           >
//             <Text style={styles.exitText}>x</Text>
//           </Pressable>

//           <Text style={styles.title}>Update User</Text>

//           {error ? <Error message={error} /> : null}

//           <Input
//             placeholder="Name"
//             name="name"
//             id="name"
//             value={name}
//             onChangeText={(text) => setName(text)}
//           />
//           <Input
//             placeholder="Email"
//             name="email"
//             id="email"
//             value={email}
//             onChangeText={(text) => setEmail(text)}
//           />
//           <Input
//             placeholder="Password"
//             name="password"
//             id="password"
//             secureTextEntry
//             value={password}
//             onChangeText={(text) => setPassword(text)}
//           />

//           <Select
//             selectedValue={roles}
//             minWidth="200"
//             accessibilityLabel="Choose Role"
//             placeholder="Select Role"
//             _selectedItem={{
//               bg: "teal.600",
//               endIcon: <CheckIcon size="5" />,
//             }}
//             mt={1}
//             onValueChange={(itemValue) => setRoles(itemValue)}
//           >
//             {items.map((item) => (
//               <Select.Item key={item.value} label={item.label} value={item.value} />
//             ))}
//           </Select>

//           <View style={styles.buttonContainer}>
//             <EasyButton large primary onPress={updateUser}>
//               <Text style={styles.buttonText}>Update User</Text>
//             </EasyButton>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 35,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 15,
//   },
//   exitButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     padding: 5,
//     borderRadius: 50,
//     backgroundColor: "#ccc",
//   },
//   exitText: {
//     fontSize: 18,
//     color: "black",
//     fontWeight: "bold",
//   },
//   buttonContainer: {
//     width: "100%",
//     marginTop: 20,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "white",
//   },
// });

// export default UpdateUser;


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import baseURL from "../../../assets/common/baseUrl";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { setFormData, setImageUpload } from "../../../utils/formData";
import { FontAwesome } from "@expo/vector-icons";
import FormContainer from "../../../Shared/Form/FormContainer";
import Error from "../../../Shared/Error";
import Input from "../../../Shared/Form/Input";
import { CheckIcon, Select } from "native-base";

const { width } = Dimensions.get("window");

const items = [
  { label: "Admin", value: true },
  { label: "User", value: false },
];

const UpdateUser = ({ route, navigation }) => {
  const { userId } = route.params;
  console.log({ userId });

  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState();

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${baseURL}/users/${userId}`)
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
        setName(res.data.user.name);
        console.log(res.data.user.name);
        setEmail(res.data.user.email);
        console.log(res.data.user.isAdmin);
        setRoles(res.data.user.isAdmin);
      })
      .catch((error) => alert("Error loading User"));

    return () => {
      setUser({});
      setToken("");
    };
  }, []);

  const UpdateUser = async () => {
    const updatedUser = {
      name: name,
      email: email,
      isAdmin: roles,
    };
    try {
            const response = await axios.put(`${baseURL}/users/${userId}`, updatedUser, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            console.log(response.data);
            navigation.navigate("UserList");
          } catch (error) {
            console.log(error.response);
            setError(error.message);
          }
        };
      
    // console.log(updatedUser)
    // const formData = await setFormData(updatedUser);

    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    // };

  //   axios
  //     .put(`${baseURL}/users/${userId}`, formData, config)
  //     .then((res) => {
  //       // Handle successful update
  //       navigation.navigate("UserList");
  //       console.log(formData)
  //     })
  //     .catch((error) => console.log(error.response));
  // };

  return (
    // <View style={{ flex: 1 }}>
    //     <Text style={{ marginLeft: 10 }}>Name</Text>
    //     <TextInput
    //         value={name}
    //         style={styles.input}
    //         onChangeText={(text) => setName(text)}
    //         placeholder="Name"
    //     />
    //     <Text style={{ marginLeft: 10 }}>Email</Text>
    //     <TextInput
    //         value={email}
    //         style={styles.input}
    //         onChangeText={(text) => setEmail(text)}
    //         placeholder="Email"
    //     />
    //     <TextInput
    //         value={roles}
    //         style={styles.input}
    //         onChangeText={(text) => setRoles(text)}
    //         placeholder="Email"
    //     />

    //     <View style={{ alignItems: "center" }}>
    //         <EasyButton
    //             medium
    //             primary
    //             onPress={updateUser}
    //         >
    //             <Text style={{ color: "white", fontWeight: "bold" }}>Update User</Text>
    //         </EasyButton>
    //     </View>
    // </View>
    <FormContainer title="UpdateUser">
      {error ? <Error message={error} /> : null}

      <Input
        placeholder="Name"
        name="name"
        id="name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Input
        placeholder="email"
        name="email"
        id="email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {/* <Input
                placeholder="roles"
                name="roles"
                id="roles"
                value={roles}
                onChangeText={(text) => setRoles(text)}
            /> */}
      <Select
        selectedValue={roles}
        minWidth="200"
        accessibilityLabel="Choose Service"
        placeholder="roles"
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />,
        }}
        mt={1}
        onValueChange={(itemValue) => setRoles(itemValue)}
      >
        {items.map((item) => (
          <Select.Item label={item.label} value={item.value} />
        ))}
      </Select>

      <View style={styles.buttonContainer}>
        <EasyButton large primary onPress={UpdateUser}>
          <Text style={styles.buttonText}>Update User</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 9,
    padding: 5,
  },
  buttonContainer: {
    width: "80%",
    marginBottom: 80,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});

export default UpdateUser;