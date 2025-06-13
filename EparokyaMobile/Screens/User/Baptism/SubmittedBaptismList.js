import React, { useEffect, useState } from "react";
import { FlatList, TextInput } from "react-native";
import { Box, Text, VStack, HStack, Spinner, Pressable } from "native-base";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../../assets/common/baseUrl";

const SubmittedBaptismList = () => {
  const [baptismForms, setBaptismForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useNavigation();
  const { user, token } = useSelector((state) => state.auth);


  useEffect(() => {
    fetchMySubmittedForms();
  }, []);

 const fetchMySubmittedForms = async () => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${baseURL}/getAllUserSubmittedBaptism`,
      { withCredentials: true }
    );

    if (response.data && Array.isArray(response.data.forms)) {
      const sortedForms = response.data.forms.sort(
        (a, b) => new Date(b.baptismDate) - new Date(a.baptismDate)
      );
      setBaptismForms(sortedForms);
      setFilteredForms(sortedForms);
    } else {
      setBaptismForms([]);
      setFilteredForms([]);
    }
  } catch (error) {
    console.error("Error fetching baptism forms:", error);
    setError(error.response?.data?.message || "No baptism forms.");
  } finally {
    setLoading(false);
  }
};


  const filterForms = (status) => {
    setActiveFilter(status);
    let filtered = baptismForms;
    if (status !== "All") {
      filtered = filtered.filter((form) => form.binyagStatus === status);
    }
    if (searchTerm) {
      filtered = filtered.filter((form) =>
        form.child?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredForms(filtered);
  };

  useEffect(() => {
    filterForms(activeFilter);
  }, [activeFilter, searchTerm, baptismForms]);

  const handleCardPress = (baptismId) => {
    navigation.navigate("SubmittedBaptismForm", { formId: baptismId });
  };

  return (
    <Box flex={1} bg="gray.100" p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center">
        My Submitted Baptism Forms
      </Text>

      {/* Filter Buttons */}
      <HStack justifyContent="space-around" mb={4}>
        {["All", "Pending", "Confirmed", "Declined"].map((status) => (
          <Pressable
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
          </Pressable>
        ))}
      </HStack>

      {/* Search Input */}
      <TextInput
        placeholder="Search by Child's Name"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />

      {/* Conditional Rendering */}
      {loading ? (
        <Spinner size="lg" mt={10} />
      ) : error ? (
        <Text color="red.500" textAlign="center">
          {error}
        </Text>
      ) : filteredForms.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No submitted baptism forms found.
        </Text>
      ) : (
        <FlatList
          data={filteredForms}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => {
            const statusColor =
              item.binyagStatus === "Confirmed"
                ? "green.500"
                : item.binyagStatus === "Declined"
                ? "red.500"
                : "yellow.500";

            return (
              <Pressable onPress={() => handleCardPress(item._id)}>
                <Box
                  bg="white"
                  p={4}
                  my={2}
                  borderRadius="lg"
                  shadow={2}
                  borderLeftWidth={4}
                  borderLeftColor={statusColor}
                >
                  <HStack justifyContent="space-between">
                    <Text fontSize="md" fontWeight="bold">
                      Record #{index + 1}:{" "}
                      {item.child?.fullName || "Unknown Child"}
                    </Text>
                    <Text color={statusColor} fontWeight="bold">
                      {item.binyagStatus || "Unknown"}
                    </Text>
                  </HStack>

                  <VStack mt={2}>
                    <Text>
                      <Text fontWeight="bold">Baptism Date:</Text>{" "}
                      {item.baptismDate
                        ? new Date(item.baptismDate).toLocaleDateString()
                        : "N/A"}
                    </Text>
                    <Text>
                      <Text fontWeight="bold">Baptism Time:</Text>{" "}
                      {item.baptismTime || "N/A"}
                    </Text>
                    <Text>
                      <Text fontWeight="bold">Parent Contact:</Text>{" "}
                      {item.phone || "N/A"}
                    </Text>
                  </VStack>
                </Box>
              </Pressable>
            );
          }}
        />
      )}
    </Box>
  );
};

// Styles
const styles = {
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
};

export default SubmittedBaptismList;
