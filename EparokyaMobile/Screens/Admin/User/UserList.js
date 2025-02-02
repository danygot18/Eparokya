import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import baseURL from "../../../assets/common/baseUrl";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useFocusEffect } from '@react-navigation/native';  // Add this hook
import { useSelector } from "react-redux";

var { width } = Dimensions.get("window");

const Item = ({ item, navigation, deleteUser }) => {
  return (
    <View style={styles.item}>
      <View style={styles.textContainer}>
        {/* <Text style={styles.label}>Category:</Text> */}
        <Text style={styles.name}>Name: {item.name.substring(0, 11)}</Text>
        <Text style={styles.email}>Email: {item.email.substring(0, 11)}</Text>
        <Text style={styles.label}>Role: {item.isAdmin ? 'Admin' : 'User'}</Text> 
      </View>
      <View style={styles.buttonContainer}>
        <EasyButton
          primary
          medium
          onPress={() =>
            navigation.navigate("UpdateUser", { userId: item._id })
          }
          style={[styles.button, { backgroundColor: '#00a651' }]}
        >
          <MaterialIcons name="edit" size={16} color="white" />
        </EasyButton>
        <EasyButton
          danger
          medium
          onPress={() => deleteUser(item._id)}
          style={[styles.button, { backgroundColor: '#26562e' }]}
        >
          <MaterialIcons name="delete" size={16} color="white" />
        </EasyButton>
      </View>
    </View>
  );
};

const UserList = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  
  const { user, token } = useSelector(state => state.auth);

  const loadUsers = () => {
    axios
      .get(`${baseURL}/users`)
      .then((res) => setUsers(res.data))
      .catch((error) => alert("Error loading users"));
  };

  useEffect(() => {

    loadUsers(); // Initially load users

    return () => {
      setUsers([]);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const deleteUser = (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    axios
      .delete(`${baseURL}/users/${id}`, config)
      .then((res) => {
        const newUsers = users.filter((item) => item._id !== id);
        setUsers(newUsers);
      })
      .catch((error) => alert("Error deleting user"));
  };

  return (
    <View style={{ position: "relative", height: "100%" }}>
      <View style={{ marginBottom: 60 }}>
        <FlatList
          data={users}
          renderItem={({ item, index }) => (
            <Item item={item} index={index} navigation={navigation} deleteUser={deleteUser} />
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
    padding: 10,
    margin: 10,
    backgroundColor: "#c7ddb5", 
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 2,
  },
  label: {
    color: "gray",
  },
  name: {
    color: "black",
  },
  email: {
    color: "black",
  },
  roleContainer: {
    flex: 1,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    marginLeft: 5,
    padding: 5,
    borderRadius: 10,
    width: 60,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'black',
    width: 130, 
    height: 10,
    backgroundColor: '#b3cf99',
  },
  inputAndroid: {
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'black',
    height: 50,
    width: 130, 
    backgroundColor: '#b3cf99',
  },
});

export default UserList;