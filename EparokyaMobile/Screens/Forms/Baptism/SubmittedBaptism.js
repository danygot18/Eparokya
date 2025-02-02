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

const SubmittedBaptism = ({ navigation }) => {
  const [baptismForms, setBaptismForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredForms, setFilteredForms] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  
  const { user, token } = useSelector(state => state.auth);
  const fetchSubmittedForms = async () => {
    setLoading(true);
    

    if (!token) {
      Alert.alert("Error", "Token is missing. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/binyag/mySubmittedForms`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.forms) {
        setBaptismForms(response.data.forms);
        setFilteredForms(response.data.forms);
      } else {
        Alert.alert("Notice", response.data.message || "No forms found.");
        setBaptismForms([]);
      }
    } catch (error) {
      console.error("Error fetching submitted baptism forms:", error.response ? error.response.data : error.message);
      Alert.alert("No Forms", "No Baptism Forms Detected.");
    } finally {
      setLoading(false);
    }
  };

  const filterForms = (status) => {
    setActiveFilter(status);
    if (status === "All") {
      setFilteredForms(baptismForms);
    } else {
      setFilteredForms(baptismForms.filter((form) => form.binyagStatus === status));
    }
  };

  useEffect(() => {
    fetchSubmittedForms();
  }, []);

  const renderBaptismForm = ({ item }) => {
    const {
      child,
      baptismDate,
      baptismVenue,
      godparents,
      binyagStatus,
    } = item;

    // Handle missing values with "N/A" or "Unavailable"
    const childName = child?.fullName || "Child Name Not Available";
    const baptismDateFormatted = baptismDate ? new Date(baptismDate).toLocaleDateString() : "N/A";
    const baptismVenueText = baptismVenue || "N/A";
    const godfatherName = godparents?.find(godparent => godparent.name)?.name || "N/A";
    const godmotherName = godparents?.find(godparent => godparent.contactInfo)?.contactInfo || "N/A";

    const statusColor =
      binyagStatus === "Confirmed"
        ? "green"
        : binyagStatus === "Cancelled"
        ? "red"
        : "orange";

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("BaptismDetails", { baptismId: item._id })}
      >
        <Card style={styles.card}>
          <VStack space={2}>
            <Heading size="md" style={styles.nameText}>
              {childName}
            </Heading>
            <Text style={styles.text}>
              Baptism Date: {baptismDateFormatted}
            </Text>
            <Text style={[styles.text, { color: statusColor }]}>{`Status: ${binyagStatus || "Pending"}`}</Text>
            <Text style={styles.text}>Venue: {baptismVenueText}</Text>
            <Text style={styles.text}>Godfather: {godfatherName}</Text>
            <Text style={styles.text}>Godmother: {godmotherName}</Text>
          </VStack>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <Box style={styles.container}>
      <Heading style={styles.heading}>My Submitted Baptism Forms</Heading>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, activeFilter === status && styles.activeFilterButton]}
            onPress={() => filterForms(status)}
          >
            <Text style={[styles.filterText, activeFilter === status && styles.activeFilterText]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : filteredForms.length > 0 ? (
        <FlatList
          data={filteredForms}
          renderItem={renderBaptismForm}
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
  },
  activeFilterButton: {
    backgroundColor: "#1C5739",
  },
  filterText: {
    color: "#000",
  },
  activeFilterText: {
    color: "#fff",
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

export default SubmittedBaptism;
