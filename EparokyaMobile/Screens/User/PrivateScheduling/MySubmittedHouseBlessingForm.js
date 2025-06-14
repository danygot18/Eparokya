import baseURL from '../../../assets/common/baseUrl';
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, ActivityIndicator, Modal, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

const MySubmittedHouseBlessingForm = () => {
    const route = useRoute();
    const { formId } = route.params;
    const [blessingDetails, setBlessingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const { token } = useSelector((state) => state.auth);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        const fetchBlessingDetails = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}/houseBlessing/getHouseBlessing/${formId}`,
                    { withCredentials: true }
                );

                const blessing = response.data.houseBlessing;
                setBlessingDetails(blessing);         
            } catch (err) {
                setError("Failed to fetch house blessing details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlessingDetails();
    }, [formId]);

    const handleCancel = () => {
        setShowModal(true);
    };

    const submitCancel = async () => {
        if (!cancelReason.trim()) {
            Alert.alert("Error", "Please provide a reason for cancellation.");
            return;
        }
        setCancelLoading(true);
        try {
            await axios.post(
                `${baseURL}/houseBlessing/declineBlessing/${formId}`,
                { reason: cancelReason },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );
            setShowModal(false);
            setCancelReason("");
            Alert.alert("Success", "House blessing request cancelled successfully!");
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Error cancelling the house blessing request.");
        } finally {
            setCancelLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error: {error}</Text>;

    // Helper for address formatting
    const address = blessingDetails?.address || {};
    const addressParts = [
        address.houseDetails,
        address.lot && `Lot ${address.lot}`,
        address.block && `Block ${address.block}`,
        address.phase && `Phase ${address.phase}`,
        address.street,
        address.baranggay,
        address.district,
        address.city
    ].filter(Boolean);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Card: Blessing Status */}
            <View style={styles.card}>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Blessing Status:</Text>
                    <Text style={[
                        styles.value,
                        blessingDetails?.blessingStatus === "Confirmed" ? styles.statusConfirmed :
                            blessingDetails?.blessingStatus === "Cancelled" ? styles.statusCancelled : styles.statusPending
                    ]}>{blessingDetails?.blessingStatus || "N/A"}
                    </Text>
                </View>
            </View>
            {/* Card: House Blessing Details */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>House Blessing Details</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Full Name:</Text>
                    <Text style={styles.value}>{blessingDetails?.fullName || "N/A"}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Contact Number:</Text>
                    <Text style={styles.value}>{blessingDetails?.contactNumber || "N/A"}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{addressParts.length ? addressParts.join(", ") : "N/A"}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Blessing Date:</Text>
                    <Text style={styles.value}>{blessingDetails?.blessingDate ? new Date(blessingDetails.blessingDate).toLocaleDateString() : "N/A"}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Blessing Time:</Text>
                    <Text style={styles.value}>{blessingDetails?.blessingTime || "N/A"}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Floors:</Text>
                    <Text style={styles.value}>
                        {blessingDetails?.floors ?? "N/A"}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Rooms:</Text>
                    <Text style={styles.value}>
                        {blessingDetails?.rooms ?? "N/A"}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>New Construction:</Text>
                    <Text style={styles.value}>
                        {blessingDetails?.isNewConstruction === true
                            ? "Yes"
                            : blessingDetails?.isNewConstruction === false
                                ? "No"
                                : "N/A"}
                    </Text>
                </View>
            </View>

            {/* Card: Admin Comments */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Admin Comments</Text>
                {blessingDetails?.comments && blessingDetails.comments.length > 0 ? (
                    blessingDetails.comments.map((comment, index) => (
                        <View key={index} style={styles.commentBox}>
                            <Text style={styles.commentLabel}>Selected Comment:</Text>
                            <Text style={styles.commentValue}>{comment?.selectedComment || "N/A"}</Text>
                            <Text style={styles.commentLabel}>Additional Comment:</Text>
                            <Text style={styles.commentValue}>{comment?.additionalComment || "N/A"}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noData}>No admin comments yet.</Text>
                )}
            </View>

            {/* Card: Updated Blessing Date */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Updated Blessing Date</Text>
                <Text style={styles.value}>
                    {blessingDetails?.adminRescheduled?.date ? new Date(blessingDetails.adminRescheduled.date).toLocaleDateString() : "N/A"}
                </Text>
                {blessingDetails?.adminRescheduled?.reason && (
                    <View style={{ marginTop: 8 }}>
                        <Text style={styles.label}>Reason for Rescheduling</Text>
                        <Text style={styles.value}>{blessingDetails.adminRescheduled.reason || "N/A"}</Text>
                    </View>
                )}
            </View>

            {/* Card: Priest */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Priest</Text>
                <Text style={styles.value}>{blessingDetails?.priest?.title || "N/A"} {blessingDetails?.priest?.fullName || "N/A"}</Text>
            </View>

            {/* Cancel Button */}
            {blessingDetails?.blessingStatus === "Pending" && (
                <View style={{ marginTop: 16 }}>
                    <TouchableOpacity
                        style={[
                            styles.cancelButton,
                            blessingDetails?.blessingStatus !== "Pending" && styles.cancelButtonDisabled
                        ]}
                        onPress={handleCancel}
                        disabled={blessingDetails?.blessingStatus !== "Pending"}
                    >
                        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                            Cancel Request
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Cancel Modal */}
            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>
                            Reason for Cancellation
                        </Text>
                        <TextInput
                            placeholder="Enter reason"
                            value={cancelReason}
                            onChangeText={setCancelReason}
                            style={styles.input}
                            multiline
                        />
                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                style={styles.modalButtonCancel}
                                disabled={cancelLoading}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={submitCancel}
                                style={styles.modalButtonSubmit}
                                disabled={cancelLoading}
                            >
                                <Text style={{ color: "#fff" }}>
                                    {cancelLoading ? "Cancelling..." : "Submit"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Cancelled Info */}
            {blessingDetails?.blessingStatus === "Cancelled" && (
                <View style={styles.cancelledBox}>
                    <Text style={styles.cancelledText}>
                        House blessing has been cancelled.
                    </Text>
                    <Text style={styles.cancelledText}>
                        Reason: {blessingDetails?.cancellingReason?.reason || "N/A"}
                    </Text>
                    <Text style={styles.cancelledText}>
                        From: {blessingDetails?.cancellingReason?.user || "N/A"}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#f7f7f7",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 18,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2e5c3c",
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    detailRow: {
        flexDirection: "row",
        marginBottom: 6,
    },
    label: {
        fontWeight: "bold",
        color: "#333",
        minWidth: 120,
    },
    value: {
        color: "#444",
        flex: 1,
        flexWrap: "wrap",
    },
    statusConfirmed: {
        color: "#388e3c",
        fontWeight: "bold",
    },
    statusCancelled: {
        color: "#d32f2f",
        fontWeight: "bold",
    },
    statusPending: {
        color: "#fbc02d",
        fontWeight: "bold",
    },
    commentBox: {
        backgroundColor: "#f4f4f4",
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
    },
    commentLabel: {
        fontWeight: "bold",
        color: "#555",
    },
    commentValue: {
        color: "#333",
        marginBottom: 4,
    },
    noData: {
        color: "#888",
        fontStyle: "italic",
    },
    cancelledBox: {
        padding: 16,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#d32f2f",
        backgroundColor: "#fff0f0",
        marginTop: 16,
        marginBottom: 10,
    },
    cancelledText: {
        color: "#d32f2f",
        textAlign: "center",
        marginTop: 10,
        fontWeight: "bold",
    },
    cancelButton: {
        backgroundColor: "#e53935",
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 30,
        marginBottom: 10,
        elevation: 2,
    },
    cancelButtonDisabled: {
        backgroundColor: "#ccc",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 12,
        width: "85%"
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        minHeight: 60,
        marginBottom: 16
    },
    modalButtonCancel: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "#eee",
        borderRadius: 8,
        marginRight: 8
    },
    modalButtonSubmit: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "#d32f2f",
        borderRadius: 8
    }
});

export default MySubmittedHouseBlessingForm;