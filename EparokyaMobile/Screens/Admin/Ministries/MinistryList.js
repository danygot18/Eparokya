import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, Alert, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import baseURL from "../../../assets/common/baseUrl";
import axios from "axios";
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; 
import Toast from 'react-native-toast-message';
import { useSelector } from "react-redux";

const Item = ({ item, deleteMinistry, openUpdateModal }) => {
  return (
    <View style={styles.item}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>Name: {item.name.substring(0, 11)}</Text>
        <Text style={styles.email}>Description: {item.description.substring(0, 11)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <EasyButton
          danger
          medium
          onPress={() => deleteMinistry(item._id)}
          style={[styles.button, { backgroundColor: '#26562e' }]}
        >
          <MaterialIcons name="delete" size={16} color="white" />
        </EasyButton>
        <EasyButton
          medium
          onPress={() => openUpdateModal(item)}
          style={[styles.button, { backgroundColor: '#007bff' }]}
        >
          <MaterialIcons name="edit" size={16} color="white" />
        </EasyButton>
      </View>
    </View>
  );
};

const MinistryList = ({ navigation }) => {
  const [ministryCategories, setMinistryCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const { user, token } = useSelector(state => state.auth);

  const loadMinistries = useCallback(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .get(`${baseURL}/ministryCategory`, config)
      .then((res) => {
        console.log('Fetched Ministries:', res.data);
        setMinistryCategories(res.data);
      })
      .catch((error) => {
        console.error('Error loading ministries:', error.response || error.message);
        Alert.alert("Error loading ministries");
      });
  }, [token]);

  useEffect(() => {
    loadMinistries();
    return () => {
      setMinistryCategories([]);
    };
  }, [loadMinistries]);

  useFocusEffect(
    useCallback(() => {
      loadMinistries();
    }, [loadMinistries])
  );

  const deleteMinistry = (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    axios
      .delete(`${baseURL}/ministryCategory/${id}`, config)
      .then(() => {
        const newCategories = ministryCategories.filter((item) => item._id !== id);
        setMinistryCategories(newCategories);
        Toast.show({
          text1: 'Deleted!',
          text2: 'Ministry category deleted successfully.',
          type: 'success',
        });
      })
      .catch(() => Alert.alert("Error deleting ministry category"));
  };

  const updateMinistry = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
  
    axios
      .put(`${baseURL}/ministryCategory/${selectedMinistry._id}`, {
        name: updatedName,
        description: updatedDescription,
      }, config)
      .then(() => {
        const updatedCategories = ministryCategories.map((item) => {
          if (item._id === selectedMinistry._id) {
            return { ...item, name: updatedName, description: updatedDescription };
          }
          return item;
        });
        setMinistryCategories(updatedCategories);
        setModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Action Successful!',
          position: 'bottom',
          visibilityTime: 4000,
          autoHide: true,
        });
      })
      .catch(() => Alert.alert("Error updating ministry category"));
  };

  const openUpdateModal = (item) => {
    setSelectedMinistry(item);
    setUpdatedName(item.name);
    setUpdatedDescription(item.description);
    setModalVisible(true);
  };

  return (
    <View style={{ position: "relative", height: "100%" }}>
      <FlatList
        data={ministryCategories}
        renderItem={({ item }) => (
          <Item item={item} deleteMinistry={deleteMinistry} openUpdateModal={openUpdateModal} />
        )}
        keyExtractor={(item) => item._id}
      />
      <Toast ref={(ref) => Toast.setRef(ref)} />

      {/* Update Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Ministry Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={updatedName}
              onChangeText={setUpdatedName}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={updatedDescription}
              onChangeText={setUpdatedDescription}
            />
            <View style={styles.buttonRow}>
              <EasyButton medium onPress={updateMinistry}>
                <Text style={styles.buttonText}>Confirm</Text>
              </EasyButton>
              <EasyButton medium onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </EasyButton>
            </View>
          </View>
        </View>
      </Modal>
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
  name: {
    color: "black",
  },
  email: {
    color: "black",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "white",
  },
});

export default MinistryList;
