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

const SubmittedWedding = ({ navigation }) => {
  const [weddingForms, setWeddingForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useSelector(state => state.auth);

  const fetchSubmittedForms = async () => {
    setLoading(true); 
   

    if (!token) {
      Alert.alert("Error", "Token is missing. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/wedding/mySubmittedForms`, {
        headers: { Authorization: `Bearer ${token}` }, 
      });

      if (response.data && response.data.forms) {
        setWeddingForms(response.data.forms); 
      } else {
        Alert.alert("Notice", response.data.message || "No forms found.");
        setWeddingForms([]); 
      }
    } catch (error) {
      console.error(
        "Error fetching submitted forms:",
        error.response ? error.response.data : error.message
      );
      Alert.alert("No Forms", "No Wedding Forms Detected.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmittedForms();
  }, []);

  const renderWeddingForm = ({ item }) => {
    const {
      bride,
      groom,
      attendees,
      flowerGirl,
      ringBearer,
      weddingDate,
      weddingStatus,
    } = item;

    const statusColor =
      weddingStatus === "Confirmed"
        ? "green"
        : weddingStatus === "Cancelled"
        ? "red"
        : "orange";

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("WeddingDetails", { weddingId: item._id })
        } 
      >
        <Card style={styles.card}>
          <VStack space={2}>
            <Heading size="md" style={styles.nameText}>
              {bride && groom ? `${bride} & ${groom}` : "Names not available"}
            </Heading>
            <Text style={styles.text}>
              Wedding Date:{" "}
              {weddingDate ? new Date(weddingDate).toLocaleDateString() : "N/A"}
            </Text>
            <Text style={[styles.text, { color: statusColor }]}>
              Status: {weddingStatus || "Pending"}
            </Text>
            <Text style={styles.text}>Attendees: {attendees || "N/A"}</Text>
            <Text style={styles.text}>
              Flower Girl: {flowerGirl || "N/A"} | Ring Bearer:{" "}
              {ringBearer || "N/A"}
            </Text>
          </VStack>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <Box style={styles.container}>
      <Heading style={styles.heading}>My Submitted Wedding Forms</Heading>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : weddingForms.length > 0 ? (
        <FlatList
          data={weddingForms}
          renderItem={renderWeddingForm}
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

export default SubmittedWedding;
