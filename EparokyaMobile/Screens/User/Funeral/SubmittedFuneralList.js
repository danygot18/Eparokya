import React, { useEffect, useState } from "react";
import { FlatList, TextInput } from "react-native";
import { Box, Text, VStack, HStack, Spinner, Pressable } from "native-base";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import baseURL from '../../../assets/common/baseUrl';

const SubmittedFuneralList = () => {
    const [funeralForms, setFuneralForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const navigation = useNavigation();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchMySubmittedForms();
    }, []);

    const fetchMySubmittedForms = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseURL}/getAllUserSubmittedFuneral`, {
                withCredentials: true,
            });
            // Sort by latest to oldest using createdAt (or fallback to funeralDate)
            const sortedForms = (response.data.forms || []).sort((a, b) => {
                const dateA = new Date(a.createdAt || a.funeralDate || 0);
                const dateB = new Date(b.createdAt || b.funeralDate || 0);
                return dateB - dateA;
            });
            setFuneralForms(sortedForms);
            setFilteredForms(sortedForms);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching funeral forms.");
        } finally {
            setLoading(false);
        }
    };

    const filterForms = (status) => {
        setActiveFilter(status);
        let filtered = funeralForms;
        if (status !== "All") {
            filtered = filtered.filter((form) => form.funeralStatus === status);
        }
        if (searchTerm) {
            filtered = filtered.filter((form) =>
                form.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredForms(filtered);
    };

    useEffect(() => {
        filterForms(activeFilter);
    }, [activeFilter, searchTerm, funeralForms]);

    const handleCardPress = (funeralId) => {
        navigation.navigate("SubmittedFuneralForm", { formId: funeralId });
    };

    return (
        <Box flex={1} bg="gray.100" p={4}>
            <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center">
                My Submitted Funeral Forms
            </Text>

            {/* Filter Buttons */}
            <HStack justifyContent="space-around" mb={4}>
                {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
                    <Pressable
                        key={status}
                        style={[
                            styles.filterButton,
                            activeFilter === status && styles.activeFilterButton
                        ]}
                        onPress={() => filterForms(status)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                activeFilter === status && styles.activeFilterText
                            ]}
                        >
                            {status}
                        </Text>
                    </Pressable>
                ))}
            </HStack>

            {/* Search Input */}
            <TextInput
                placeholder="Search by Name"
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
                    No submitted funeral forms found.
                </Text>
            ) : (
                <FlatList
                    data={filteredForms}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => {
                        const statusColor =
                            item.funeralStatus === "Confirmed" ? "green.500" :
                            item.funeralStatus === "Cancelled" ? "red.500" : "yellow.500";

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
                                            Record #{index + 1}: {item.name || "Unknown"}
                                        </Text>
                                        <Text color={statusColor} fontWeight="bold">
                                            {item.funeralStatus || "Unknown"}
                                        </Text>
                                    </HStack>

                                    <VStack mt={2}>
                                        <Text><Text fontWeight="bold">Place of Death:</Text> {item.placeOfDeath || "N/A"}</Text>
                                        <Text><Text fontWeight="bold">Reason of Death:</Text> {item.reasonOfDeath || "N/A"}</Text>
                                        <Text><Text fontWeight="bold">Funeral Date:</Text> {item.funeralDate ? new Date(item.funeralDate).toLocaleDateString() : "N/A"}</Text>
                                        <Text><Text fontWeight="bold">Funeral Time:</Text> {item.funeraltime || "N/A"}</Text>
                                        <Text><Text fontWeight="bold">Service Type:</Text> {item.serviceType || "N/A"}</Text>
                                        <Text><Text fontWeight="bold">Contact Person:</Text> {item.contactPerson || "N/A"}</Text>
                                        <Text><Text fontWeight="bold">Phone:</Text> {item.phone || "N/A"}</Text>
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

export default SubmittedFuneralList;