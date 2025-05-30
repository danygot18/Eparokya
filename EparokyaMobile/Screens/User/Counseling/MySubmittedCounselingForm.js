import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Button, Alert, ActivityIndicator } from "react-native";
import { Box, VStack, HStack } from "native-base";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import baseURL from "../../../assets/common/baseUrl";

const MySubmittedCounselingForm = () => {
    const route = useRoute();
    const { formId } = route.params;
    const [counselingDetails, setCounselingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        try {
            await axios.put(`${baseURL}/declineCounseling/${formId}`, { withCredentials: true });
            Alert.alert("Success", "Counseling cancelled successfully!");
        } catch (error) {
            Alert.alert("Error", "Failed to cancel the counseling.");
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <ScrollView padding={5}>
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
                        <Text style={{ fontWeight: "bold" }}>Contact Number: </Text>
                        {counselingDetails?.contactNumber || "N/A"}
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
                        {counselingDetails?.counselingTime || "N/A"}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Status: </Text>
                        {counselingDetails?.counselingStatus || "N/A"}
                    </Text>
                </VStack>
            </Box>

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
                    {counselingDetails?.counselingDate
                        ? new Date(counselingDetails.counselingDate).toLocaleDateString()
                        : "N/A"}
                </Text>
            </Box>

            {/* Assigned Priest */}
            <Box p={4} borderWidth={1} borderRadius={8} mt={4}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Assigned Priest</Text>
                <Text>{counselingDetails?.priest?.name || "No priest assigned"}</Text>
            </Box>

            <Button title="Cancel Counseling" color="red" onPress={handleCancel} />
        </ScrollView>
    );

};

export default MySubmittedCounselingForm;
