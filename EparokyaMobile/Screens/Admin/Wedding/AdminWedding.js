import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card, Box, Heading, VStack } from "native-base";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import SyncStorage from "sync-storage";
import { useSelector } from "react-redux";

const AdminWedding = ({ navigation }) => {
  const [weddingForms, setWeddingForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStatus, setFilteredStatus] = useState("All");

  const { user, token } = useSelector(state => state.auth);

  const fetchWeddingForms = async () => {
    setLoading(true);
    

    if (!token) {
      Alert.alert("Error", "Token is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/wedding`, {
        headers: { Authorization: `${token}` },
      });

      if (response.data && Array.isArray(response.data)) {
        setWeddingForms(response.data);
      } else {
        setWeddingForms([]);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch wedding forms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeddingForms();
  }, []);

  const handleCardPress = (item) => {
    navigation.navigate("WeddingDetails", { weddingId: item._id });
  };

  const filterWeddingForms = (status) => {
    if (status === "All") {
      return weddingForms;
    }
    return weddingForms.filter((wedding) => wedding.weddingStatus === status);
  };

  const renderWeddingForm = ({ item }) => {
    const { bride, groom, attendees, flowerGirl, ringBearer, weddingDate, weddingStatus } = item;

    const statusColor =
      weddingStatus === "Confirmed"
        ? "#28a745"
        : weddingStatus === "Declined"
        ? "#dc3545"
        : "#ffc107";

    return (
      <TouchableOpacity onPress={() => handleCardPress(item)}>
        <Card style={[styles.card, { borderLeftColor: statusColor }]}>
          <VStack space={2}>
            <Heading size="md" style={styles.cardHeader}>
              {bride && groom ? `${bride} & ${groom}` : "Names not available"}
            </Heading>

            <View style={styles.cardContent}>
              <Text style={styles.label}>
                Wedding Date:{" "}
                <Text style={styles.text}>
                  {weddingDate ? new Date(weddingDate).toLocaleDateString() : "N/A"}
                </Text>
              </Text>

              <View style={styles.statusContainer}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {weddingStatus || "N/A"}
                </Text>
              </View>

              <Text style={styles.label}>
                Attendees: <Text style={styles.text}>{attendees ?? "N/A"}</Text>
              </Text>

              <Text style={styles.label}>
                Flower Girl: <Text style={styles.text}>{flowerGirl || "N/A"}</Text> | Ring Bearer:{" "}
                <Text style={styles.text}>{ringBearer || "N/A"}</Text>
              </Text>
            </View>
          </VStack>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <Box style={styles.container}>
      <Heading style={styles.heading}>Submitted Wedding Forms</Heading>

      <View style={styles.filterContainer}>
        {["All", "Confirmed", "Pending", "Declined"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filteredStatus === status && styles.activeFilterButton,
            ]}
            onPress={() => setFilteredStatus(status)}
          >
            <Text
              style={[
                styles.filterText,
                filteredStatus === status && styles.activeFilterText,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <Text style={styles.emptyText}>Loading...</Text>
      ) : (
        <FlatList
          data={filterWeddingForms(filteredStatus)}
          renderItem={renderWeddingForm}
          keyExtractor={(item) => item._id?.toString()}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#154314",
    textAlign: "center",
    marginBottom: 16,
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
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#e8f5e9",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  text: {
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default AdminWedding;
