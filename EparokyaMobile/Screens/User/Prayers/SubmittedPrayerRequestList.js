import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Box, Button, Heading, VStack } from "native-base";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import baseURL from '../../../assets/common/baseUrl';
import { useSelector } from "react-redux";

const SubmittedPrayerRequestList = () => {
    const [prayerRequestForms, setPrayerRequestForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const navigation = useNavigation();
    const { user } = useSelector((state) => state.auth);
    

    const fetchPrayerRequestForms = async () => {
        try {
            setLoading(true);
            console.log(`${baseURL}/getAllUserSubmittedPrayerRequest`); 
            const response = await axios.get(`${baseURL}/getAllUserSubmittedPrayerRequest`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPrayerRequestForms(response.data.prayerRequests || []);
            setFilteredForms(response.data.prayerRequests || []);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching prayer requests forms.");
        } finally {
            setLoading(false);
        }
    };

    const filterForms = () => {
        let filtered = prayerRequestForms;

        if (activeFilter !== "All") {
            filtered = filtered.filter((form) => form.prayerType.includes(activeFilter));
        }

        if (searchTerm) {
            filtered = filtered.filter((form) => form.offerrorsName?.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        setFilteredForms(filtered);
    };

    useEffect(() => {
        fetchPrayerRequestForms();
    }, []);

    useEffect(() => {
        filterForms();
    }, [activeFilter, searchTerm, prayerRequestForms]);

    return (
        <ScrollView padding={5}>
            <Heading textAlign="center" mb={5}>Prayer Request Records</Heading>
            <VStack space={4}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {["All", "Eternal Repose(Patay)", "Thanks Giving(Pasasalamat)", "Special Intentions(Natatanging Kahilingan)"].map((prayerType) => (
                        <Button
                            key={prayerType}
                            variant={activeFilter === prayerType ? "solid" : "outline"}
                            onPress={() => setActiveFilter(prayerType)}
                            m={1}
                        >
                            {prayerType}
                        </Button>
                    ))}
                </ScrollView>
                
                <TextInput
                    placeholder="Search by Full Name"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    style={{ padding: 10, borderWidth: 1, borderRadius: 5 }}
                />
                
                {error && <Text style={{ color: "red" }}>{error}</Text>}
                
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : filteredForms.length === 0 ? (
                    <Text>No prayer requests available.</Text>
                ) : (
                    filteredForms.map((item, index) => (
                        <TouchableOpacity
                            key={item._id}
                            onPress={() => navigation.navigate("PrayerRequestDetails", { prayerId: item._id })}
                        >
                            <Box p={4} borderWidth={1} borderRadius={8} mb={2}>
                                <Text><Text bold>Record #{index + 1}</Text></Text>
                                <Text><Text bold>Offeror's Full Name:</Text> {item.offerrorsName || "N/A"}</Text>
                                <Text><Text bold>Prayer Request Date:</Text> {item.prayerRequestDate ? new Date(item.prayerRequestDate).toLocaleDateString() : "N/A"}</Text>
                                <Text>
                                    <Text bold>Intentions:</Text> {Array.isArray(item.Intentions) && item.Intentions.length > 0
                                        ? item.Intentions.map((intent, i) => (
                                            <Text key={intent._id || i}>
                                                {intent.name || "Unnamed"}
                                                {i !== item.Intentions.length - 1 ? ", " : ""}
                                            </Text>
                                        ))
                                        : "N/A"}
                                </Text>
                                <Text><Text bold>Submitted By:</Text></Text>
                                <Text><Text bold>Name:</Text> {item.userId?.name || "Unknown"}</Text>
                                <Text><Text bold>User ID:</Text> {item.userId?._id || "Unknown"}</Text>
                            </Box>
                        </TouchableOpacity>
                    ))
                )}
            </VStack>
        </ScrollView>
    );
};

export default SubmittedPrayerRequestList;
