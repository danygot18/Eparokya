import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity,
  StyleSheet,
   
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../../assets/common/baseUrl";
import { HStack, Pressable } from "native-base";
const SubmittedHouseBlessingList = () => {
    const [houseBlessingForms, setHouseBlessingForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const navigation = useNavigation();

    useEffect(() => {
        fetchMySubmittedForms();
    }, []);

    const fetchMySubmittedForms = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${baseURL}/getAllUserSubmittedHouseBlessing`, 
                { withCredentials: true }
            );
            
            if (response.data && Array.isArray(response.data.forms)) {
                setHouseBlessingForms(response.data.forms);
                setFilteredForms(response.data.forms);
            } else {
                setHouseBlessingForms([]);
                setFilteredForms([]);
            }
        } catch (error) {
            console.error("Error fetching house blessing forms:", error);
            setError("Unable to fetch house blessing forms.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = houseBlessingForms;
        
        if (activeFilter !== "All") {
            filtered = filtered.filter(
                (form) => form.blessingStatus === activeFilter
            );
        }
        
        if (searchTerm) {
            filtered = filtered.filter((form) =>
                form.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                form.address?.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                form.address?.baranggay?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredForms(filtered);
    }, [activeFilter, searchTerm, houseBlessingForms]);

    const handleCardPress = (formId) => {
        navigation.navigate("SubmittedHouseBlessingForm", { formId });
    };





    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Submitted House Blessing Forms</Text>

            {/* Search Input */}
            <TextInput
                placeholder="Search by Name, Street or Baranggay"
                value={searchTerm}
                onChangeText={setSearchTerm}
                style={styles.searchInput}
            />

            {/* Filter Buttons */}
            <HStack justifyContent="space-around" mb={4}>
                {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
                    <TouchableOpacity
                        key={status}
                        style={[
                            styles.filterButton,
                            activeFilter === status && styles.activeFilterButton
                        ]}
                        onPress={() => setActiveFilter(status)}
                    >
                        <Text style={[
                            styles.filterText,
                            activeFilter === status && styles.activeFilterText
                        ]}>
                            {status}
                        </Text>
                    </TouchableOpacity>
                ))}
            </HStack>

            {/* Forms List */}
            {filteredForms.length === 0 ? (
                <Text style={styles.noRecords}>No submitted house blessing forms found.</Text>
            ) : (
                <FlatList
                    data={filteredForms}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => {
                        const statusColor =
                            item.blessingStatus === "Confirmed" ? "#4caf50" :
                            item.blessingStatus === "Cancelled" ? "#ff5722" : "#ffd700";

                        return (
                            <TouchableOpacity
                                style={[styles.card, { borderLeftColor: statusColor }]}
                                onPress={() => handleCardPress(item._id)}
                            >
                                <View style={styles.cardHeader}>
                                    <Text style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                                        {item.blessingStatus ?? "Unknown"}
                                    </Text>
                                    <Text style={styles.cardTitle}>
                                        Record #{index + 1}: {item.fullName ?? "Unknown"}
                                    </Text>
                                </View>
                                <View style={styles.cardDetails}>
                                    <Text><Text style={styles.bold}>Blessing Date:</Text> {item.blessingDate ? new Date(item.blessingDate).toLocaleDateString() : "N/A"}</Text>
                                    <Text><Text style={styles.bold}>Blessing Time:</Text> {item.blessingTime ?? "N/A"}</Text>
                                    <Text><Text style={styles.bold}>Contact:</Text> {item.contactNumber ?? "N/A"}</Text>
                                    <Text><Text style={styles.bold}>Address:</Text> {[
                                        item.address?.houseDetails,
                                        item.address?.street,
                                        item.address?.baranggay,
                                        item.address?.city
                                    ].filter(Boolean).join(", ")}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
    },
    noRecords: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },
    searchInput: {
        height: 40,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 13,
    },
    filterButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#ddd",
    },
    activeFilterButton: {
        backgroundColor: "#4caf50",
    },
    filterText: {
        color: "#333",
        fontWeight: "bold",
    },
    activeFilterText: {
        color: "white",
    },
    card: {
        backgroundColor: "#f9f9f9",
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        borderLeftWidth: 6,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        color: "white",
        fontWeight: "bold",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
        marginLeft: 10,
    },
    cardDetails: {
        marginTop: 5,
    },
    bold: {
        fontWeight: "bold",
    },
});

export default SubmittedHouseBlessingList;