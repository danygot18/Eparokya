import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card, VStack, Heading, Box } from "native-base";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import SyncStorage from "sync-storage";
import { useSelector } from "react-redux";

const SubmittedFuneral = ({ navigation }) => {
  const [funeralForms, setFuneralForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, token } = useSelector(state => state.auth);

  // Function to fetch the funeral forms
  const fetchSubmittedForms = async () => {
    setLoading(true);
    

    if (!token) {
      Alert.alert("Error", "Token is missing. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/funeral/mySubmittedForms`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.forms) {
        setFuneralForms(response.data.forms);
      } else {
        Alert.alert("Notice", response.data.message || "No forms found.");
        setFuneralForms([]); 
      }
    } catch (error) {
      console.error("Error fetching submitted funeral forms:", error.response ? error.response.data : error.message);
      Alert.alert("No Forms", "No Funerals Forms Detected.");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchSubmittedForms(); 
  }, []);

  const renderFuneralForm = ({ item }) => {
    const {
      name,  // Deceased name (first, middle, last, suffix)
      funeralDate,
      funeralStatus,
      address,  // Address for the funeral location
      contactPerson,  // Family contact person
    } = item;

    // Combine the name fields
    const deceasedName = `${name.firstName} ${name.middleName ? name.middleName + ' ' : ''}${name.lastName} ${name.suffix || ''}`.trim();

    const funeralLocation = address ? `${address.state}, ${address.country}` : "N/A";

    const statusColor =
      funeralStatus === "Confirmed"
        ? "green"
        : funeralStatus === "Cancelled"
        ? "red"
        : "orange";

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("FuneralDetails", { funeralId: item._id })}
      >
        <Card style={styles.card}>
          <VStack space={2}>
            <Heading size="md" style={styles.nameText}>
              {deceasedName || "Deceased Name Not Available"}
            </Heading>
            <Text style={styles.text}>
              Funeral Date: {funeralDate ? new Date(funeralDate).toLocaleDateString() : "N/A"}
            </Text>
            <Text style={[styles.text, { color: statusColor }]}>
              Status: {funeralStatus || "Pending"}
            </Text>
            <Text style={styles.text}>Location: {funeralLocation || "N/A"}</Text>
            <Text style={styles.text}>
              Family Contact: {contactPerson || "N/A"}
            </Text>
          </VStack>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <Box style={styles.container}>
      <Heading style={styles.heading}>My Submitted Funeral Forms</Heading>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : funeralForms.length > 0 ? (
        <FlatList
          data={funeralForms}
          renderItem={renderFuneralForm}
          keyExtractor={(item) => item._id?.toString()}
        />
      ) : (
        <Text style={styles.emptyText}>No forms found.</Text>
      )}
    </Box>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  heading: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#154314",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  nameText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    color: "#333",
    fontSize: 14,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default SubmittedFuneral;
