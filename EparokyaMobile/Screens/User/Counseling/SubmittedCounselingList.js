import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { Box, Button, Heading, VStack, HStack } from "native-base";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../../assets/common/baseUrl";

const SubmittedCounselingList = () => {
  const [counselingForms, setCounselingForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);

  const fetchCounselingForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseURL}/getAllUserSubmittedCounseling`,
        {
          withCredentials: true,
        }
      );

      const forms = response.data.forms || [];

      // Sort from latest to oldest based on createdAt
      const sortedForms = forms.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setCounselingForms(sortedForms);
      setFilteredForms(sortedForms);
    } catch (err) {
      setError("No submitted Counseling forms found.");
    } finally {
      setLoading(false);
    }
  };

  const filterForms = (status) => {
    setActiveFilter(status);
    let filtered = counselingForms;
    if (status !== "All") {
      filtered = filtered.filter((form) => form.counselingStatus === status);
    }
    if (searchTerm) {
      filtered = filtered.filter((form) =>
        form.person?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredForms(filtered);
  };

  useEffect(() => {
    fetchCounselingForms();
  }, []);

  useEffect(() => {
    filterForms(activeFilter);
  }, [activeFilter, searchTerm, counselingForms]);

  const handleCardPress = (counselingId) => {
    navigation.navigate("SubmittedCounselingForm", { formId: counselingId });
  };

  return (
    <Box flex={1} bg="gray.100" p={4}>
      <Text style={styles.title}>My Submitted Counseling Forms</Text>
      {/* Filter Buttons */}
      <HStack justifyContent="space-around" mb={4}>
        {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
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
      </HStack>

      {/* Search Input */}
      <TextInput
        placeholder="Search by Full Name"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />

      {/* Conditional Rendering */}
      {loading ? (
        <ActivityIndicator size="large" color="#1C5739" />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      ) : filteredForms.length === 0 ? (
        <Text style={styles.emptyText}>No counseling forms available.</Text>
      ) : (
        <ScrollView>
          {filteredForms.map((item, index) => {
            const statusColor =
              item.counselingStatus === "Confirmed"
                ? "green.500"
                : item.counselingStatus === "Cancelled"
                ? "red.500"
                : "yellow.500";

            return (
              <Pressable
                key={item._id}
                onPress={() => handleCardPress(item._id)}
              >
                <Box
                  bg="white"
                  p={4}
                  mb={3}
                  borderRadius="lg"
                  shadow={2}
                  borderLeftWidth={4}
                  borderLeftColor={statusColor}
                >
                  <HStack justifyContent="space-between">
                    <Text fontSize="md" fontWeight="bold">
                      Record #{index + 1}: {item.person?.fullName || "N/A"}
                    </Text>
                    <Text color={statusColor} fontWeight="bold">
                      {item.counselingStatus || "Unknown"}
                    </Text>
                  </HStack>

                  <VStack mt={2}>
                    <Text>
                      <Text fontWeight="bold">Purpose:</Text>{" "}
                      {item.purpose || "N/A"}
                    </Text>
                    <Text>
                      <Text fontWeight="bold">Contact Number:</Text>{" "}
                      {item.contactNumber || "N/A"}
                    </Text>
                    <Text>
                      <Text fontWeight="bold">Counseling Date:</Text>{" "}
                      {item.counselingDate
                        ? new Date(item.counselingDate).toLocaleDateString()
                        : "N/A"}
                    </Text>
                    <Text>
                      <Text fontWeight="bold">Counseling Time:</Text>{" "}
                      {item.counselingTime || "N/A"}
                    </Text>
                    <Text>
                      <Text fontWeight="bold">Address:</Text>{" "}
                      {[
                        item.address?.BldgNameTower,
                        item.address?.LotBlockPhaseHouseNo,
                        item.address?.SubdivisionVillageZone,
                        item.address?.Street,
                        item.address?.District,
                        item.address?.barangay === "Others"
                          ? item.address?.customBarangay
                          : item.address?.barangay,
                        item.address?.city === "Others"
                          ? item.address?.customCity
                          : item.address?.city,
                      ]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </Text>
                    <Text>
                      <Text fontWeight="bold">Contact Person:</Text>{" "}
                      {item.contactPerson?.fullName || "N/A"}
                    </Text>
                    <Text>
                      <Text fontWeight="bold">Contact Person Number:</Text>{" "}
                      {item.contactPerson?.contactNumber || "N/A"}
                    </Text>
                    <Text>
                      <Text fontWeight="bold">Relationship:</Text>{" "}
                      {item.contactPerson?.relationship || "N/A"}
                    </Text>
                  </VStack>
                </Box>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </Box>
  );
};

// Styles
const styles = StyleSheet.create({
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
  searchInput: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default SubmittedCounselingList;
