import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";

const BaptismList = () => {
  const [baptismForms, setBaptismForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const navigation = useNavigation();

  const fetchBaptismForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/binyag/list`);
      setBaptismForms(response.data.baptismForms);
      setFilteredForms(response.data.baptismForms); 
    } catch (err) {
      setError(
        err.response?.data?.message || "Error fetching baptism forms."
      );
    } finally {
      setLoading(false);
    }
  };

  const filterForms = (status) => {
    setActiveFilter(status);
    if (status === "All") {
      setFilteredForms(baptismForms);
    } else {
      setFilteredForms(
        baptismForms.filter((form) => form.binyagStatus === status)
      );
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBaptismForms();
    }, [])
  );

  const handleCardPress = (item) => {
    navigation.navigate("BaptismDetails", { baptismId: item._id });
  };

  if (error) {
    Alert.alert("Error", error, [{ text: "OK", onPress: () => setError(null) }]);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#154314" />
        <Text style={styles.loadingText}>Loading baptism forms...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Baptism Forms</Text>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {["All", "Pending", "Confirmed", "Declined"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              activeFilter === status && styles.activeFilterButton,
            ]}
            onPress={() => filterForms(status)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === status && styles.activeFilterText,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredForms}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleCardPress(item)}>
            <View
              style={[
                styles.card,
                {
                  borderLeftColor:
                    item.binyagStatus === "Pending"
                      ? "#FFD700"
                      : item.binyagStatus === "Confirmed"
                      ? "#4CAF50"
                      : "#FF5722",
                },
              ]}
            >
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>{item.binyagStatus}</Text>
              </View>
              <Text style={styles.cardHeader}>Form #{index + 1}</Text>
              <View style={styles.cardContent}>
                <Text>
                  <Text style={styles.label}>Child Name:</Text>{" "}
                  {item.child.fullName}
                </Text>
                <Text>
                  <Text style={styles.label}>Father's Name:</Text>{" "}
                  {item.parents.fatherFullName}
                </Text>
                <Text>
                  <Text style={styles.label}>Mother's Name:</Text>{" "}
                  {item.parents.motherFullName}
                </Text>
                <Text>
                  <Text style={styles.label}>Address:</Text>{" "}
                  {item.parents.address}
                </Text>
                <Text>
                  <Text style={styles.label}>Contact Info:</Text>{" "}
                  {item.parents.contactInfo}
                </Text>
                <Text>
                  <Text style={styles.label}>Baptism Date:</Text>{" "}
                  {new Date(item.baptismDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No baptism forms available.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#154314",
    textAlign: "center",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 6,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#154314",
    marginBottom: 8,
  },
  cardContent: {
    marginLeft: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  statusContainer: {
    padding: 8,
    backgroundColor: "#E8F5E9",
    borderRadius: 4,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    fontWeight: "bold",
    color: "#154314",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default BaptismList;
