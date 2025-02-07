import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { Box, VStack, HStack, Button, Badge } from "native-base";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../../assets/common/baseUrl";

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
            const response = await axios.get(`${baseURL}/getAllUserSubmittedHouseBlessing`, { withCredentials: true });
            if (response.data && Array.isArray(response.data.forms)) {
                setHouseBlessingForms(response.data.forms);
                setFilteredForms(response.data.forms);
            } else {
                setHouseBlessingForms([]);
                setFilteredForms([]);
            }
        } catch (error) {
            setError("Unable to fetch house blessing forms.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = houseBlessingForms;
        if (activeFilter !== "All") {
            filtered = filtered.filter((form) => form.blessingStatus === activeFilter);
        }
        if (searchTerm) {
            filtered = filtered.filter((form) =>
                form.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredForms(filtered);
    }, [activeFilter, searchTerm, houseBlessingForms]);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <ScrollView p={5}>
            <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
                My Submitted House Blessing Records
            </Text>
            
            <HStack space={2} justifyContent="center" mb={4}>
                {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
                    <Button
                        key={status}
                        variant={activeFilter === status ? "solid" : "outline"}
                        onPress={() => setActiveFilter(status)}
                    >
                        {status}
                    </Button>
                ))}
            </HStack>

            <TextInput
                placeholder="Search by Full Name"
                value={searchTerm}
                onChangeText={setSearchTerm}
                style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
            />

            {filteredForms.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>No house blessings forms submitted by you.</Text>
            ) : (
                filteredForms.map((item, index) => (
                    <TouchableOpacity key={item._id} onPress={() => navigation.navigate("MySubmittedHouseBlessingForm", { formId: item._id })}>
                        <Box p={4} borderWidth={1} borderRadius={8} mb={3}>
                            <Badge colorScheme={item.blessingStatus === "Confirmed" ? "success" : item.blessingStatus === "Cancelled" ? "danger" : "warning"} alignSelf="flex-start">{item.blessingStatus}</Badge>
                            <Text fontSize="lg" fontWeight="bold">Record #{index + 1}</Text>
                            <VStack space={2} mt={2}>
                                <Text><Text fontWeight="bold">Full Name:</Text> {item.fullName || "N/A"}</Text>
                                <Text><Text fontWeight="bold">Contact Number:</Text> {item.contactNumber || "N/A"}</Text>
                                <Text><Text fontWeight="bold">House Blessing Date:</Text> {item.blessingDate ? new Date(item.blessingDate).toLocaleDateString() : "N/A"}</Text>
                                <Text><Text fontWeight="bold">House Blessing Time:</Text> {item.blessingTime || "N/A"}</Text>
                                <Text><Text fontWeight="bold">Address:</Text> {item.address?.houseDetails || "N/A"}, {item.address?.block || "N/A"}, {item.address?.lot || "N/A"}, {item.address?.phase || "N/A"}, {item.address?.street || "N/A"}, {item.address?.baranggay || "N/A"}, {item.address?.district || "N/A"}, {item.address?.city || "N/A"}</Text>
                            </VStack>
                        </Box>
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
};

export default SubmittedHouseBlessingList;
