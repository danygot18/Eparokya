import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import SyncStorage from "sync-storage";
import baseURL from "../../../assets/common/baseUrl";
import { useSelector } from "react-redux";

const FuneralList = ({ navigation }) => {
  const [funeralList, setFuneralList] = useState([]);
  const [filteredFuneralList, setFilteredFuneralList] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const { user, token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchFunerals = async () => {
      try {
        
        if (!token) {
          Alert.alert("Error", "Token is missing. Please log in again.");
          navigation.navigate("LoginPage");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${baseURL}/funeral/`, config);
        setFuneralList(response.data);
        setFilteredFuneralList(response.data);
      } catch (err) {
        console.error(
          "Error fetching funerals:",
          err.response ? err.response.data : err.message
        );
        setError("Unable to fetch funerals. Please try again later.");
      }
    };

    fetchFunerals();
  }, []);

  const applyFilter = (status) => {
    setFilter(status);
    if (status === "All") {
      setFilteredFuneralList(funeralList);
    } else {
      const filtered = funeralList.filter(
        (funeral) => funeral.funeralStatus === status
      );
      setFilteredFuneralList(filtered);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderLeftColor:
            item.funeralStatus === "Pending"
              ? "#FFD700"
              : item.funeralStatus === "Confirmed"
              ? "#4CAF50"
              : "#FF5722",
        },
      ]}
      onPress={() => navigation.navigate("FuneralDetails", { funeralId: item._id })}
    >
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{item.funeralStatus}</Text>
      </View>
      <Text style={styles.cardHeader}>Record #{index + 1}</Text>
      <View style={styles.cardContent}>
        <Text>
          <Text style={styles.label}>Name:</Text>{" "}
          {`${item.name.firstName} ${item.name.middleName} ${item.name.lastName} ${item.name.suffix || ""}`}
        </Text>
        <Text>
          <Text style={styles.label}>Gender:</Text> {item.gender}
        </Text>
        <Text>
          <Text style={styles.label}>Age:</Text> {item.age}
        </Text>
        <Text>
          <Text style={styles.label}>Funeral Date:</Text>{" "}
          {new Date(item.funeralDate).toLocaleDateString()}
        </Text>
        <Text>
          <Text style={styles.label}>Service Type:</Text> {item.serviceType}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Funeral List</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filter === status && styles.activeFilterButton,
            ]}
            onPress={() => applyFilter(status)}
          >
            <Text
              style={[
                styles.filterText,
                filter === status && styles.activeFilterText,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredFuneralList.length > 0 ? (
        <FlatList
          data={filteredFuneralList}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text style={styles.emptyText}>
          No funeral records found for the selected filter.
        </Text>
      )}
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
  error: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default FuneralList;
