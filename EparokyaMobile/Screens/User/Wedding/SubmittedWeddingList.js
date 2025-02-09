import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../../assets/common/baseUrl";

const SubmittedWeddingList = () => {
    const [weddingForms, setWeddingForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchMySubmittedForms();
    }, []);

    const fetchMySubmittedForms = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${baseURL}/getAllUserSubmittedWedding`,
                { withCredentials: true }
            );

            // console.log("Frontend API Response:", response.data);

            if (response.data && Array.isArray(response.data.forms)) {
                setWeddingForms(response.data.forms);
            } else {
                setWeddingForms([]);
            }
        } catch (error) {
            console.error("Error fetching wedding forms:", error);
            setError("Unable to fetch wedding forms.");
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (weddingId) => {
        navigation.navigate("SubmittedWeddingForm", { weddingId });
        console.log("Wedding ID:", weddingId);
    };

    if (loading) {
        return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Submitted Wedding Forms</Text>
            {weddingForms.length === 0 ? (
                <Text style={styles.noRecords}>No submitted wedding forms found.</Text>
            ) : (
                <FlatList
                    data={weddingForms}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => {
                        const statusColor =
                            item.weddingStatus === "Confirmed" ? "#4caf50" :
                            item.weddingStatus === "Declined" ? "#ff5722" : "#ffd700";

                        return (
                            <TouchableOpacity
                                style={[styles.card, { borderLeftColor: statusColor }]}
                                onPress={() => handleCardClick(item._id)}
                            >
                                <View style={styles.cardHeader}>
                                    <Text style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                                        {item.weddingStatus ?? "Unknown"}
                                    </Text>
                                    <Text style={styles.cardTitle}>
                                        Record #{index + 1}: {item.brideName ?? "Unknown Bride"} & {item.groomName ?? "Unknown Groom"}
                                    </Text>
                                </View>
                                <View style={styles.cardDetails}>
                                    <Text><Text style={styles.bold}>Wedding Date:</Text> {item.weddingDate ? new Date(item.weddingDate).toLocaleDateString() : "N/A"}</Text>
                                    <Text><Text style={styles.bold}>Wedding Time:</Text> {item.weddingTime ?? "N/A"}</Text>
                                    <Text><Text style={styles.bold}>Bride Contact:</Text> {item.bridePhone ?? "N/A"} | <Text style={styles.bold}>Groom Contact:</Text> {item.groomPhone ?? "N/A"}</Text>
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
        marginBottom: 10,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    error: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },
    noRecords: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
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
        marginTop: 5,
    },
    cardDetails: {
        marginTop: 10,
    },
    bold: {
        fontWeight: "bold",
    },
});

export default SubmittedWeddingList;
