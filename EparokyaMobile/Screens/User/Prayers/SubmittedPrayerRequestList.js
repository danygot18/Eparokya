import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
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
            const response = await axios.get(`${baseURL}/getMySubmittedPrayerRequestList`, { withCredentials: true });

            let forms = response.data.forms || [];

            // Sort by prayerRequestDate (latest to oldest)
            forms = forms.sort((a, b) => new Date(b.prayerRequestDate) - new Date(a.prayerRequestDate));

            setPrayerRequestForms(forms);
            setFilteredForms(forms);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching prayer requests forms.");
        } finally {
            setLoading(false);
        }
    };


    const filterForms = () => {
        let filtered = prayerRequestForms;

        if (activeFilter !== "All") {
            filtered = filtered.filter((form) => form.prayerType === activeFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter((form) =>
                form.offerrorsName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
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
        <ScrollView style={{ padding: 16 }} >
            <Heading textAlign="center" mb={5}>Prayer Request Records</Heading>
            <VStack space={4} marginBottom={10}>
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

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : filteredForms.length === 0 ? (
                    <Text>No prayer requests available.</Text>
                ) : (
                    filteredForms.map((form, idx) => (
                        <TouchableOpacity
                            key={form._id}
                            onPress={() =>
                                navigation.navigate("PrayerRequestDetails", { prayerId: form._id })
                            }
                        >
                            <Box p={4} borderWidth={1} borderRadius={8} mb={2}>
                                <Text><Text style={{ fontWeight: "bold" }}>Record #{idx + 1}</Text></Text>
                                 <Text><Text style={{ fontWeight: "bold" }}>Type:</Text> {form.prayerType || "N/A"}</Text>
                                <Text><Text style={{ fontWeight: "bold" }}>Offeror's Full Name:</Text> {form.offerrorsName || "N/A"}</Text>
                                <Text>
                                    <Text style={{ fontWeight: "bold" }}>Prayer Request Date:</Text>{" "}
                                    {form.prayerRequestDate
                                        ? new Date(form.prayerRequestDate).toLocaleDateString()
                                        : "N/A"}
                                </Text>
                                <Text>
                                    <Text style={{ fontWeight: "bold" }}>Intentions:</Text>{" "}
                                    {Array.isArray(form.Intentions) && form.Intentions.length > 0
                                        ? form.Intentions.map((intent, i) => (
                                            <Text key={intent._id || i}>
                                                {intent.name || "Unnamed"}
                                                {i !== form.Intentions.length - 1 ? ", " : ""}
                                            </Text>
                                        ))
                                        : "N/A"}
                                </Text>
                               
                               
                            </Box>
                        </TouchableOpacity>
                    ))
                )}
            </VStack>
        </ScrollView>
    );
};

export default SubmittedPrayerRequestList;