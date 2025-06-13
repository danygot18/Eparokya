import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Button, Alert, ActivityIndicator, Modal, TextInput,StyleSheet, TouchableOpacity } from "react-native";
import { Box, VStack, HStack } from "native-base";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import baseURL from "../../../assets/common/baseUrl";
import { format } from 'date-fns';

const MySubmittedCounselingForm = () => {
    const route = useRoute();
    const { formId } = route.params;
    const [counselingDetails, setCounselingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        fetchCounselingDetails();
    }, []);

    const fetchCounselingDetails = async () => {
        try {
            const response = await axios.get(`${baseURL}/getCounselingForm/${formId}`, {
                withCredentials: true,
            });
            setCounselingDetails(response.data);
        } catch (err) {
            setError("Failed to fetch counseling details.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
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
                `${baseURL}/declineCounseling/${formId}`,
                { reason: cancelReason },
                { withCredentials: true }
            );
            setShowModal(false);
            setCancelReason("");
            Alert.alert("Success", "Counseling cancelled successfully!");
            fetchCounselingDetails();
        } catch (error) {
            Alert.alert("Error", "Failed to cancel the counseling.");
        } finally {
            setCancelLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <ScrollView padding={10}>
            <Box p={4} borderWidth={1} borderRadius={8}>
                <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 4 }}>
                    Counseling Details
                </Text>
                <VStack space={2}>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Full Name: </Text>
                        {counselingDetails?.person?.fullName || "N/A"}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Purpose: </Text>
                        {counselingDetails?.purpose || "N/A"}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Date of Birth: </Text>
                        {counselingDetails?.person?.dateOfBirth
                            ? new Date(counselingDetails.person.dateOfBirth).toLocaleDateString()
                            : "N/A"}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Address: </Text>
                        {[
                            counselingDetails?.address?.BldgNameTower,
                            counselingDetails?.address?.LotBlockPhaseHouseNo,
                            counselingDetails?.address?.SubdivisionVillageZone,
                            counselingDetails?.address?.Street,
                            counselingDetails?.address?.District,
                            counselingDetails?.address?.barangay === "Others"
                                ? counselingDetails?.address?.customBarangay
                                : counselingDetails?.address?.barangay,
                            counselingDetails?.address?.city === "Others"
                                ? counselingDetails?.address?.customCity
                                : counselingDetails?.address?.city,
                        ]
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Counseling Date: </Text>
                        {counselingDetails?.counselingDate
                            ? new Date(counselingDetails.counselingDate).toLocaleDateString()
                            : "N/A"}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Counseling Time: </Text>
                        {counselingDetails?.counselingTime
                            ? format(new Date(`1970-01-01T${counselingDetails.counselingTime}`), 'hh:mm a')
                            : "N/A"}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Status: </Text>
                        {counselingDetails?.counselingStatus || "N/A"}
                    </Text>
                </VStack>
                <Box p={4} borderWidth={1} borderRadius={8} mt={4}>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Contact Person: </Text>
                        {counselingDetails?.contactPerson?.fullName || "N/A"}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Contact Number: </Text>
                        {counselingDetails?.contactPerson?.contactNumber || "N/A"}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Relationship: </Text>
                        {counselingDetails?.contactPerson?.relationship || "N/A"}
                    </Text>
                </Box>
            </Box>
            <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 10 }}>
                Admin Section
            </Text>
            {/* Admin Comments Section */}
            <Box p={4} borderWidth={1} borderRadius={8} mt={4}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Admin Comments</Text>
                {counselingDetails?.comments?.length > 0 ? (
                    counselingDetails.comments.map((comment, index) => (
                        <Box key={index} mt={2} p={2} borderWidth={1} borderRadius={6}>
                            <Text>
                                <Text style={{ fontWeight: "bold" }}>Selected Comment: </Text>
                                {comment?.selectedComment || "N/A"}
                            </Text>
                            <Text>
                                <Text style={{ fontWeight: "bold" }}>Additional Comment: </Text>
                                {comment?.additionalComment || "N/A"}
                            </Text>
                        </Box>
                    ))
                ) : (
                    <Text>No comments available.</Text>
                )}
            </Box>

            {/* Updated Counseling Date */}
            <Box p={4} borderWidth={1} borderRadius={8} mt={4}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Updated Counseling Date</Text>
                <Text>
                    Date: {counselingDetails?.adminRescheduled?.date
                        ? new Date(counselingDetails.adminRescheduled.date).toLocaleDateString()
                        : "N/A"}
                </Text>
                <Text>
                    Reason: {counselingDetails?.adminRescheduled?.reason || "N/A"}
                </Text>
            </Box>

            {/* Assigned Priest */}
            <Box p={4} borderWidth={1} borderRadius={8} mt={4} mb={4}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Assigned Priest</Text>
                <Text>{counselingDetails?.Priest?.title} {counselingDetails?.Priest?.fullName || "No priest assigned"}</Text>
            </Box>

            <Button
            
                title="Cancel Counseling"
                color="red"
                onPress={handleCancel}
                disabled={
                    counselingDetails?.counselingStatus === "Cancelled" ||
                    counselingDetails?.counselingStatus === "Approved"
                }
            />

            {/* Cancel Modal */}
            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <View style={{
                        backgroundColor: "#fff",
                        padding: 24,
                        borderRadius: 12,
                        width: "85%"
                    }}>
                        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>
                            Reason for Cancellation
                        </Text>
                        <TextInput
                            placeholder="Enter reason"
                            value={cancelReason}
                            onChangeText={setCancelReason}
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 8,
                                padding: 10,
                                minHeight: 60,
                                marginBottom: 16
                            }}
                            multiline
                        />
                        <HStack justifyContent="flex-end" space={2}>
                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 16,
                                    backgroundColor: "#eee",
                                    borderRadius: 8,
                                    marginRight: 8
                                }}
                                disabled={cancelLoading}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={submitCancel}
                                style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 16,
                                    backgroundColor: "#d32f2f",
                                    borderRadius: 8
                                }}
                                disabled={cancelLoading}
                            >
                                <Text style={{ color: "#fff" }}>
                                    {cancelLoading ? "Cancelling..." : "Submit"}
                                </Text>
                            </TouchableOpacity>
                        </HStack>
                    </View>
                </View>
            </Modal>

            {counselingDetails?.counselingStatus === "Cancelled" && (
                <Box p={4} borderWidth={1} borderRadius={8} mt={4} mb={10}>
                    <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                        Counseling has been cancelled.
                    </Text>
                    <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                        Reason: {counselingDetails?.cancellingReason?.reason || "N/A"}
                    </Text>
                    <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                        From: {counselingDetails?.cancellingReason?.user || "N/A"}
                    </Text>
                </Box>
            )}
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    cancelButton: {
        backgroundColor: "#e53935", // red
        padding: 10,
        borderRadius: 6,
    },
    cancelButtonDisabled: {
        backgroundColor: "#ccc", // light gray when disabled
    },
}
)

export default MySubmittedCounselingForm;